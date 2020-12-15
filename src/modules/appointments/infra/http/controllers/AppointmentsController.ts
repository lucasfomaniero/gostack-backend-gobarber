import { parseISO } from 'date-fns';
import { Request, Response } from 'express';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import { container } from 'tsyringe';
import Appointment from '../../typeorm/entities/Appointment';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { providerID, date } = request.body;
    const parsedDate = parseISO(date);
    const createAppointment = container.resolve(CreateAppointmentService);
    const result = await createAppointment.execute({
      providerID,
      date: parsedDate,
    });

    if (result.onSuccess) {
      return response.status(200).json(result.onSuccess);
    }
    return response.status(400).json({ error: result.onError?.message });
  }

  public async findAllAppointments(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const appointmentsRepository = new AppointmentsRepository();
    const appointments = await appointmentsRepository.find();
    return response.status(200).json(appointments);
  }
}
