import Express from 'express';
import * as meetingController from '../controller/meeting';
import {verifyLogin} from '../middleware/auth';

const Router = Express.Router();

Router.post('/', verifyLogin, meetingController.postMeeting);
Router.post('/:meetingId/enter', verifyLogin, meetingController.enterMeeting);

export default Router;