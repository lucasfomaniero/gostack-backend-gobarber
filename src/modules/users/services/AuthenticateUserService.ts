import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/Models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}
@injectable()
export default class AuthenticateUserService {
  private user?: User;

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const foundUser = await this.usersRepository.findByEmail(email);

    if (!foundUser) {
      throw new Error('Invalid password/email combination');
    }

    const matchedPassword = await this.isValidPassword(
      password,
      foundUser.password,
    );

    if (!matchedPassword) {
      throw new Error('Invalid password/email combination');
    }
    this.user = foundUser;
    return {
      user: this.user,
      token: this.generateToken(),
    };
  }

  private async isValidPassword(
    password: string,
    cryptPassword: string,
  ): Promise<boolean> {
    return this.hashProvider.compareHash(password, cryptPassword);
  }

  private generateToken(): string {
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: this.user?.id,
      expiresIn,
    });
    return token;
  }
}
