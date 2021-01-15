import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { differenceInHours } from 'date-fns';
import IHashProvider from '../providers/HashProvider/Models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserToken')
    private userTokensRepository: IUserTokensRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists.');
    }
    const user = await this.usersRepository.findById(userToken.userID);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const tokenCreatedAt = userToken.createdAt;

    if (differenceInHours(Date.now(), tokenCreatedAt) > 2) {
      throw new AppError('Token expired. Please try again');
    }

    user.password = await this.hashProvider.generateHash(password);
    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
