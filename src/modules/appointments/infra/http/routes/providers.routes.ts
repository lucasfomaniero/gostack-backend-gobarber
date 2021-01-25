import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providersRouter = Router();
providersRouter.use(ensureAuthenticated);
providersRouter.get(
  '/:providerID/month-availability',
  providerMonthAvailabilityController.index,
);
providersRouter.get(
  '/:providerID/day-availability',
  providerDayAvailabilityController.index,
);
providersRouter.get('/', providersController.findAllProviders);

export default providersRouter;
