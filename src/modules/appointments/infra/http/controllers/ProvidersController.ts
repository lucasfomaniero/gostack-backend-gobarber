import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderService from '@modules/appointments/services/ListProviderService';
import { classToClass } from 'class-transformer';

// TODO: Method findAllAppointments is different
export default class ProvidersController {
  public async findAllProviders(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const userID = request.user.id;
    const findProviders = container.resolve(ListProviderService);
    try {
      const providers = await findProviders.execute({
        userID,
      });
      return response.status(204).json(classToClass(providers));
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}
