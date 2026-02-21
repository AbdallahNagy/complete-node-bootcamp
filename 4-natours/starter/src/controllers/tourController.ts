import { Request, Response, NextFunction } from 'express';
import Tour from '../models/tourModel';
import APIFeatures from '../utils/apiFeatures';

export const aliasTopTours = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.url =
    '/?sort=-ratingsAverage,price&fields=ratingsAverage,price,name,difficulty,summary&limit=5';
  next();
};

export const getAllTours = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const getTourById = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const createTour = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const updateTourById = async (
  req: Request,
  res: Response
): Promise<void> => {
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
      message: "can't update tour"
    });
  }
};

export const deleteTourById = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const getTourStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numOfTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: {
          avgPrice: 1
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

export const getMonthlyPlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const year = +req.params.year;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: { _id: 0 }
      },
      {
        $sort: { numToursStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};
