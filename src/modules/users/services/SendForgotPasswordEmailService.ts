import ISendMailDTO from '@shared/container/Providers/MailProvider/dtos/ISendMailDTO';
import IMailProvider from '@shared/container/Providers/MailProvider/Models/IMailProvider';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import path from 'path';
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
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid e-mail address. Please try again.');
    }
    const filePath = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    const { token } = await this.userToken.generate(user.id);
    const message: ISendMailDTO = {
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'GoBarber - Recuperação de Senha',
      templateData: {
        file: filePath,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
        },
      },
    };
    await this.mailProvider.sendMail(message);
  }
}

export default SendForgotPasswordEmailService;
