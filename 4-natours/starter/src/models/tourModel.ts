import mongoose, { Document, Schema } from 'mongoose';

export interface ITour extends Document {
    name: string;
    duration: number;
    maxGroupSize: number;
    difficulty: string;
    ratingsAverage: number;
    ratingsQuantity: number;
    price: number;
    priceDiscount?: number;
    summary: string;
    description?: string;
    imageCover: string;
    images: string[];
    createdAt: Date;
    startDates: Date[];
}

const tourSchema = new Schema<ITour>({
    name: {
        type: String,
        required: [true, 'a tour must have a name'],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'a tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'a tour must have a group type']
    },
    difficulty: {
        type: String,
        required: [true, 'a tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'a tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'a tour must have a summary']
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'a tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
});

export default mongoose.model<ITour>('Tour', tourSchema);
