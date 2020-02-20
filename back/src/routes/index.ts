import express from 'express';
import meetingRouter from './meeting';
import authRouter from './auth';
import userRouter from './user';

const Router = express.Router();

Router.use('/meetings', meetingRouter);
Router.use('/auth', authRouter);
Router.use('/users', userRouter);

Router.use('/', (req, res) => {
  res.status(200).send('hello');
});

export default Router;
