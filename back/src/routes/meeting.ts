import Express from 'express';
import * as meetingController from '../controller/meeting';
const Router = Express.Router();

Router.post('/', meetingController.postMeeting);

export default Router;