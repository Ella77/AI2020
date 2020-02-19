import express from 'express';
import meetingRouter from './meeting';

const Router = express.Router();

Router.use('/', (req, res) => {
  res.status(200).send('hello');
});

Router.use('/meetings', meetingRouter);

export default Router;
