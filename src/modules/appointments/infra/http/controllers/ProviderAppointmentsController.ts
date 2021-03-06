import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const providerID = request.user.id;
    const { day, month, year } = request.query;

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService,
    );

    try {
      const appointments = await listProviderAppointments.execute({
        providerID,
        day: Number(day),
        month: Number(month),
        year: Number(year),
      });
      return response.json(classToClass(appointments));
    } catch (error) {
      return response.status(404).json(error);
    }
  }
}
