import { Request, Response } from 'express';
import User from '../models/userModel';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const users = await User.find();
    
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
};

export const createUser = (req: Request, res: Response): void => {
    res.status(500).json({
        status: 'fail',
        message: 'not defined yet!'
    });
};

export const updateUserById = (req: Request, res: Response): void => {
    res.status(500).json({
        status: 'fail',
        message: 'not defined yet!'
    });
};

export const getUserById = (req: Request, res: Response): void => {
    res.status(500).json({
        status: 'fail',
        message: 'not defined yet!'
    });
};

export const deleteUserById = (req: Request, res: Response): void => {
    res.status(500).json({
        status: 'fail',
        message: 'not defined yet!'
    });
};
