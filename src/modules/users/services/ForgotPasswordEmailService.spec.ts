import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/Providers/MailProvider/Fakes/FakeMailProvider';
import FakeStorageProvider from '@shared/container/Providers/StorageProvider/Fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import ForgotPasswordEmailService from './ForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let forgotPasswordEmail: ForgotPasswordEmailService;

describe('SendForgotPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    forgotPasswordEmail = new ForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
    );
  });
  it('should be able to recover the password using its email', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await forgotPasswordEmail.execute({
      email: 'johndoe@gmail.com',
    });
    expect(sendEmail).toBeCalled();
  });
  it('should not be able to recover the password using an invalid email', async () => {
    await expect(
      forgotPasswordEmail.execute({
        email: 'johndoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
