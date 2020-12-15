import { Router } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { container } from 'tsyringe';
import UserMap from '../../../../../mappers/UserMap';
import SessionController from '../controllers/SessionController';

const sessionsRouter = Router();
const controller = new SessionController();
sessionsRouter.post('/', controller.create);

export default sessionsRouter;
