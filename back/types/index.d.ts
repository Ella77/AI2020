import { User } from '../src/model/user';

declare global {
  namespace Express {
    export interface Request {
        user?: User;
    }
  }
}