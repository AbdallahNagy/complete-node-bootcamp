import { promisify } from 'util';
import catchAsync from '../utils/catchAsync';
import User from '../models/userModel';
import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import AppError from '../utils/appError';
import { Types } from 'mongoose';

export const signup = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: Function): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new AppError('Please provide email and password', 400));

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError('Incorrect email or password', 401));

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token
    });
  }
);

const signToken = (id: Types.ObjectId): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']
  });
};

export const protect = catchAsync(
  async (req: any, res: Response, next: Function) => {
    const { authorization } = req.headers;
    let token;

    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    }

    if (!token)
      return next(
        new AppError('you are not logged in! please login to get access.', 401)
      );

    const verifyAsync = promisify<string, string, jwt.JwtPayload>(
      jwt.verify as any
    );
    const decoded = await verifyAsync(token, process.env.JWT_SECRET!);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
      return next(
        new AppError(
          'The token belonging to this user does no longer exist.',
          401
        )
      );

    if (currentUser.changedPasswordAfter(decoded.iat!))
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );

    req.user = currentUser;
    next();
  }
);

export const restrictTo = (...roles: any) => {
  return catchAsync(async (req: any, res: Response, next: Function) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError('you do not have permission to perform this action', 403)
      );
    }

    next();
  });
};
