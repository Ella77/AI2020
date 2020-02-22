import Express from 'express';
import * as meetingController from '../controller/meeting';
import {verifyLogin} from '../middleware/auth';

const Router = Express.Router();

Router.post('/', verifyLogin, meetingController.postMeeting);
Router.post('/:meetingId/enter', verifyLogin, meetingController.enterMeeting);
Router.get('/', meetingController.getEntireMeetings);
Router.get('/:meetingId', meetingController.getMeetingById);
Router.put('/:meetingId/agenda-sequence', meetingController.updateSequenceNumber);
//Router.get('/search/:name/:type', meetingController.Deepsearch);


export default Router;
