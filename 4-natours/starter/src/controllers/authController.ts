import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";
import { Request, Response } from "express";

export const signup = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
        const newUser = await User.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });
    }
)