import { inject, injectable } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/Providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
  userID?: string;
}
@injectable()
export default class ListProviderService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ userID }: IRequest): Promise<User[]> {
    const key = `providers-list:${userID}`;
    let users = await this.cacheProvider.recover<User[]>(key);

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        exceptUserID: userID,
      });
      if (!users) {
        throw new AppError('User not found.', 400);
      }
    }
    await this.cacheProvider.save(key, classToClass(users));
    return users;
  }
}
