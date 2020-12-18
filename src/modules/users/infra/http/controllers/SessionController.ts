import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { Request, Response } from 'express';
import UserMap from '@modules/users/mappers/UserMap';
import { container } from 'tsyringe';

export default class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);
    const result = await authenticateUser.execute({ email, password });
    if (result.onSuccess) {
      const { user, token } = result.onSuccess;
      return response.status(200).json({ user: UserMap.toDTO(user), token });
    }
    return response.status(400).json({ error: result.onError?.message });
  }
}
