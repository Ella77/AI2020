import Express from 'express';
import * as meetingController from '../controller/meeting';
import {verifyLogin} from '../middleware/auth';
const Router = Express.Router();

Router.get('/self/meetings', verifyLogin, meetingController.getMyMeetings);

export default Router;