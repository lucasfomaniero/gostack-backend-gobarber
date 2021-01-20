import { Router } from 'express';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import sessionRouter from '@modules/users/infra/http/routes/sessions.routes';
import userRouter from '@modules/users/infra/http/routes/users.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', userRouter);
routes.use('/password', passwordRouter);
routes.use('/sessions', sessionRouter);
routes.use('/profile', profileRouter);

export default routes;
