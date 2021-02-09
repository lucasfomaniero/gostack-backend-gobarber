import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import SessionController from '../controllers/SessionController';

const sessionsRouter = Router();
const controller = new SessionController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  controller.create,
);

export default sessionsRouter;
