import IMailProvider from '@shared/container/Providers/MailProvider/Models/IFakeMailProvider';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
}

@injectable()
class ForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const foundUser = await this.usersRepository.findByEmail(email);

    if (!foundUser) {
      throw new AppError('Invalid e-mail address. Please try again.');
    }

    await this.mailProvider.sendMail(
      email,
      'Seguem as instruções para recuperar a senha.',
    );
  }
}

export default ForgotPasswordEmailService;
