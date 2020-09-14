import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO, startOfHour } from 'date-fns';
import AppointmentsRepository from '../repository/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();
  return response.status(200).json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const { providerID, date } = request.body;
  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentService();
  const result = await createAppointment.execute({
    providerID,
    date: parsedDate,
  });

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
