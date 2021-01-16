import { Router } from 'express';

import SessionController from '../controllers/SessionController';

const sessionsRouter = Router();
const controller = new SessionController();

sessionsRouter.post('/', controller.create);

export default sessionsRouter;
