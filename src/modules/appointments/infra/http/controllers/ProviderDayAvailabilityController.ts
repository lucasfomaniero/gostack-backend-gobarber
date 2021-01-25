import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { providerID } = request.params;
    const { day, month, year } = request.body;

    const listProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );
    try {
      const availability = await listProviderDayAvailability.execute({
        providerID,
        day,
        month,
        year,
      });

      return response.json(availability);
    } catch (error) {
      return response.json(error);
    }
  }
}
