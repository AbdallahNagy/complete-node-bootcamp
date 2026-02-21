const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
    req.url = '/?sort=-ratingsAverage,price&fields=ratingsAverage,price,name,difficulty,summary&limit=5'
    next();
}

exports.getAllTours = async (req, res) => {
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
        })
    }
}

exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (_) {
        res.status(400).json({
            status: 'fail',
            message: 'error retieving tour'
        })
    }
}

exports.createTour = async (req, res) => {
    try {
        const tour = await Tour.create(req.body);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'error creating tour'
        });
    }
};

exports.updateTourById = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidations: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (_) {
        res.status(400).json({
            status: 'fail',
            message: 'can\'t update tour'
        })
    }
};

exports.deleteTourById = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        console.log(tour);

        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (err) {
        res.status(204).json({
            status: 'fail',
            message: err
        })
    }
};