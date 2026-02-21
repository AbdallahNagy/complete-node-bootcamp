import { Request, Response, NextFunction } from 'express';
import Tour from '../models/tourModel';
import APIFeatures from '../utils/apiFeatures';

export const aliasTopTours = (req: Request, res: Response, next: NextFunction): void => {
    req.url = '/?sort=-ratingsAverage,price&fields=ratingsAverage,price,name,difficulty,summary&limit=5';
    next();
};

export const getAllTours = async (req: Request, res: Response): Promise<void> => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

export const getTourById = async (req: Request, res: Response): Promise<void> => {
    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (_) {
        res.status(400).json({
            status: 'fail',
            message: 'error retieving tour'
        });
    }
};

export const createTour = async (req: Request, res: Response): Promise<void> => {
    try {
        const tour = await Tour.create(req.body);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'error creating tour'
        });
    }
};

export const updateTourById = async (req: Request, res: Response): Promise<void> => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (_) {
        res.status(400).json({
            status: 'fail',
            message: 'can\'t update tour'
        });
    }
};

export const deleteTourById = async (req: Request, res: Response): Promise<void> => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        console.log(tour);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(204).json({
            status: 'fail',
            message: err
        });
    }
};
