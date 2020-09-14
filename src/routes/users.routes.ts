import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';
import UserMap from '../mappers/UserMap';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const service = new CreateUserService();

    const savedUser = await service.execute({ name, email, password });
    const user = UserMap.toDTO(savedUser);

    return response.status(200).json(user);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default usersRouter;
