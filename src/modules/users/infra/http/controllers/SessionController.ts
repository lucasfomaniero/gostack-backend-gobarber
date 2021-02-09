import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { classToClass } from 'class-transformer';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);
    try {
      const { user, token } = await authenticateUser.execute({
        email,
        password,
      });

      return response.json({ user: classToClass(user), token });
    } catch (error) {
      return response.json('Invalid email password combination');
    }
  }
}
