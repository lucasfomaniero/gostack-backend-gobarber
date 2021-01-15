import IMailProvider from '@shared/container/Providers/MailProvider/Models/IFakeMailProvider';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UserToken')
    private userToken: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const foundUser = await this.usersRepository.findByEmail(email);

    if (!foundUser) {
      throw new AppError('Invalid e-mail address. Please try again.');
    }

    await this.userToken.generate(foundUser.id);

    await this.mailProvider.sendMail(
      email,
      'Seguem as instruções para recuperar a senha.',
    );
  }
}

export default SendForgotPasswordEmailService;
