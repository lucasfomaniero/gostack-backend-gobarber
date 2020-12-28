import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/Fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('Create User', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'New User Name',
      email: 'newuser@gmail.com',
      password: '123412341234',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create an user with an existing email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password: '123456',
    });
    expect(
      createUser.execute({
        email: 'johndoe@gmail.com',
        name: 'John Doe',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
