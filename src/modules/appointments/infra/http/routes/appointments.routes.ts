import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Joi, Segments } from 'celebrate';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentController = new AppointmentsController();
const appointmentsRouter = Router();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', appointmentController.findAllAppointments);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      providerID: Joi.string().uuid().required(),
      // date: Joi.string().isoDate(),
      date: Joi.date(),
    },
  }),
  appointmentController.create,
);
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
