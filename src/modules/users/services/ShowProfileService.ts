import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  userID: string;
}
@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userID }: IRequest): Promise<User> {
    const foundUser = await this.usersRepository.findById(userID);
    if (!foundUser) {
      throw new AppError('User not found.', 400);
    }
    return foundUser;
  }
}
