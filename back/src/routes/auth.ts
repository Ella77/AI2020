import Express from 'express';
import * as userController from '../controller/user';
const Router = Express.Router();

Router.post('/sign-up', userController.signUp);
Router.post('/sign-in', userController.signIn);

export default Router;