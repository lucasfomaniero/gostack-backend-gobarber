import { getRepository, Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User);
    const userExists = await userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      throw new Error('E-mail address already taken.');
    }
    const hashPassword = await hash(password, 8);
    const user = userRepository.create({
      name,
      email,
      password: hashPassword,
    });

    await userRepository.save(user);

    return user;
  }
}
