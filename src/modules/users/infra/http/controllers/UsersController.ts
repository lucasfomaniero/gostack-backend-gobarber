import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import { classToClass } from 'class-transformer';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    // // Com a atualização do TypeScript, isso se faz necessário
    // const userWithoutPassword = {
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    //   createdAt: user.createdAt,
    //   updatedAt: user.updatedAt,
    // };

    return response.json(classToClass(user));
  }
}
