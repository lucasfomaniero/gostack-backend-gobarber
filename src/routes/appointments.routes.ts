import { Router } from 'express';
import { parseISO, startOfHour } from 'date-fns';
import AppointmentsRepository from '../repository/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

const appointmentsRepository = new AppointmentsRepository();
// const appointments: Appointment[] = [];

appointmentsRouter.get('/', (request, response) => {
  return response.status(200).json(appointmentsRepository.all());
});

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;
  const parsedDate = parseISO(date);
  const createAppointment = new CreateAppointmentService(
    appointmentsRepository,
  );
  const result = createAppointment.execute({ provider, date: parsedDate });

  if (result.onSuccess) {
    return response.status(200).json(result.onSuccess);
  }
  return response.status(400).json({ error: result.onError?.message });

  // try {
  //     const { provider, date } = request.body;
  //     const parsedDate = parseISO(date);
  //     const createAppointment = new createAppointmentService(appointmentsRepository);
  //     const appointment = createAppointment.execute({provider, date: parsedDate})

  // return response.status(200).json(appointment);
  // } catch (error) {
  //     return response.status(400).json({error: error.message});
  // }
});

export default appointmentsRouter;
