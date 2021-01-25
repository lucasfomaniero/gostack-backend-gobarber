import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderService from '@modules/appointments/services/ListProviderService';

// TODO: Method findAllAppointments is different
export default class ProvidersController {
  public async findAllProviders(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const userID = request.user.id;
    const findProviders = container.resolve(ListProviderService);
    const providers = await findProviders.execute({
      userID,
    });
    return response.json(providers);
  }
}
