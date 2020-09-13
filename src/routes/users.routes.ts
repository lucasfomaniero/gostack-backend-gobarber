import { Router } from 'express';
import User from '../models/User';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  return response.send();
});

export default usersRouter;
