import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/Fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('Create User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'New User Name',
      email: 'newuser@gmail.com',
      password: '123412341234',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create an user with an existing email', async () => {
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
