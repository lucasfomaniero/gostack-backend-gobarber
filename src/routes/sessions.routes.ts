import { Router } from 'express';
import UserMap from '../mappers/UserMap';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const authenticateUser = new AuthenticateUserService();
  const result = await authenticateUser.execute({ email, password });
  if (result.onSuccess) {
    const { user, token } = result.onSuccess;
    return response.status(200).json({ user: UserMap.toDTO(user), token });
  }
  return response.status(400).json({ error: result.onError?.message });
});

export default sessionsRouter;
