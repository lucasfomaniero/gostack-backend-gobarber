import { getRepository, Repository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import Result from '../interfaces/Result';
import User from '../models/User';
import authConfig from '../config/auth';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

export default class AuthenticateUserService {
  private repository: Repository<User>;

  private user?: User;

  constructor() {
    this.repository = getRepository(User);
  }

  public async execute({
    email,
    password,
  }: Request): Promise<Result<Response>> {
    const foundUser = await this.repository.findOne({ where: { email } });
    if (
      foundUser &&
      (await this.isValidPassword(password, foundUser.password))
    ) {
      this.user = foundUser;
      return new Result<Response>(
        {
          user: this.user,
          token: this.generateToken(),
        },
        undefined,
      );
    }
    return new Result<Response>(
      undefined,
      Error('Incorrect email/password combination.'),
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
