import { parseISO } from 'date-fns';
import { Request, Response } from 'express';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import { container } from 'tsyringe';
import Appointment from '../../typeorm/entities/Appointment';
// TODO: Method findAllAppointments is different
export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const userID = request.user.id;
    const { providerID, date } = request.body;
    // const parsedDate = parseISO(date);
    const createAppointment = container.resolve(CreateAppointmentService);

    try {
      const appointment = await createAppointment.execute({
        providerID,
        date,
        userID,
      });
      return response.json(appointment);
    } catch (error) {
      return response.json(error);
    }
  }

  public async findAllAppointments(
    request: Request,
    response: Response,
  ): Promise<Response> {
    try {
      const appointmentsRepository = new AppointmentsRepository();
      const appointments = await appointmentsRepository.find();
      return response.status(200).json(appointments);
    } catch (error) {
      return response.json(error);
    }
  }
}
