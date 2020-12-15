import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentController = new AppointmentsController();
const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', appointmentController.findAllAppointments);

appointmentsRouter.post('/', appointmentController.create);

export default appointmentsRouter;
