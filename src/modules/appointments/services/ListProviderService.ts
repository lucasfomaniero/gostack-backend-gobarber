import { inject, injectable } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  userID?: string;
}
@injectable()
export default class ListProviderService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userID }: IRequest): Promise<User[]> {
    const foundUser = await this.usersRepository.findAllProviders({
      exceptUserID: userID,
    });
    if (!foundUser) {
      throw new AppError('User not found.', 400);
    }
    return foundUser;
  }
}
