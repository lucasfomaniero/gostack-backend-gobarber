import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Result from '../../../interfaces/Result';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

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
  ) {}

  public async execute({
    email,
    password,
  }: IRequest): Promise<Result<IResponse>> {
    const foundUser = await this.usersRepository.findByEmail(email);
    if (
      foundUser &&
      (await this.isValidPassword(password, foundUser.password))
    ) {
      this.user = foundUser;
      return new Result<IResponse>(
        {
          user: this.user,
          token: this.generateToken(),
        },
        undefined,
      );
    }

    return new Result<IResponse>(
      undefined,
      new AppError('Incorrect email/password combination.'),
    );
  }

  private async isValidPassword(
    password: string,
    cryptPassword: string,
  ): Promise<boolean> {
    return compare(password, cryptPassword);
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
