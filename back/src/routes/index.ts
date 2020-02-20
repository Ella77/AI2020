import express from 'express';
import meetingRouter from './meeting';
import authRouter from './auth';

const Router = express.Router();

Router.use('/meetings', meetingRouter);
Router.use('/auth', authRouter);

Router.use('/', (req, res) => {
  res.status(200).send('hello');
});

export default Router;
