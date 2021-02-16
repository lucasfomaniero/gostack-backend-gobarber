import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { providerID } = request.params;
    const { month, year } = request.query;

    const listProviderMonthAvailability = container.resolve(
      ListProviderMonthAvailabilityService,
    );

    try {
      const availability = await listProviderMonthAvailability.execute({
        providerID,
        month: Number(month),
        year: Number(year),
      });

      return response.json(availability);
    } catch (error) {
      return response.json(error);
    }
  }
}
