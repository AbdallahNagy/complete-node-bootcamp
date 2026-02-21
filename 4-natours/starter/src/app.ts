import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import qs from 'qs';
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';

const app = express();

app.set('query parser', (str: string) => qs.parse(str));
app.use(express.json());
app.use(express.static(`${__dirname}/../public`));

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Hello from the middleware 👋');
    next();
});

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
