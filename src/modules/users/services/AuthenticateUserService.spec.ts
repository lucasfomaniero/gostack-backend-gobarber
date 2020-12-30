import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/Fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('User Authentication ', () => {
  it('should be able to login', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      hashProvider,
    );
    const createUser = new CreateUserService(fakeUsersRepository, hashProvider);

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });
    const response = await authenticateUser.execute({
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to login with invalid email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      hashProvider,
    );
    const createUser = new CreateUserService(fakeUsersRepository, hashProvider);

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    expect(
      authenticateUser.execute({
        email: 'johndoee@gmail.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to login with invalid password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      hashProvider,
    );
    const createUser = new CreateUserService(fakeUsersRepository, hashProvider);

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    expect(
      authenticateUser.execute({
        email: 'johndoe@gmail.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to login with invalid account', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      hashProvider,
    );
    expect(
      authenticateUser.execute({
        email: 'johndoe@gmail.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
