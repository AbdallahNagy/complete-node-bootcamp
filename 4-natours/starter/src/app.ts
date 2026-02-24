import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import qs from 'qs';
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';

const app = express();

app.set('query parser', (str: string) => qs.parse(str));
app.use(express.json());
app.use(express.static(`${__dirname}/../public`));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*splat', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'fail',
    message: `can't find ${req.originalUrl} on this server`
  });
  next();
});

export default app;
