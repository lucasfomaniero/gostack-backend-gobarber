import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/Fakes/FakeHashProvider';
import UpdateUserProfileService from './UpdateUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfileService: UpdateUserProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateUserProfileService = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to upload the user data', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateUserProfileService.execute({
      name: 'John Tre',
      userID: user.id,
      email: 'johntre@gmail.com',
    });
    expect(updatedUser.name).toBe('John Tre');
    expect(updatedUser.email).toBe('johntre@gmail.com');
  });
  it('should not be able to update a profile of a non existing user', async () => {
    await expect(
      updateUserProfileService.execute({
        name: 'John Tre',
        userID: 'non-existing-id',
        email: 'johntre@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be possible to change the email to an existing one', async () => {
    await fakeUsersRepository.create({
      name: 'User One',
      email: 'user_one@gmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'User Two',
      email: 'usertwo@gmail.com',
      password: '123456',
    });

    await expect(
      updateUserProfileService.execute({
        name: 'John Tre',
        userID: user.id,
        email: 'user_one@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user_one@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateUserProfileService.execute({
      name: 'John Tre',
      userID: user.id,
      email: 'user_one@gmail.com',
      password: '123123',
      oldPassword: '123456',
    });

    expect(updatedUser.password).toBe('123123');
  });
  it('should confirm the old password when updating it', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user_one@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateUserProfileService.execute({
      name: 'John Tre',
      userID: user.id,
      email: 'user_one@gmail.com',
      password: '123123',
      oldPassword: '123456',
    });

    expect(updatedUser.password).toBe('123123');
  });
  it('should not be able to update the password without providing the old one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user_one@gmail.com',
      password: '123456',
    });

    await expect(
      updateUserProfileService.execute({
        name: 'John Tre',
        userID: user.id,
        email: 'user_one@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the password with old wrong password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user_one@gmail.com',
      password: '123456',
    });

    await expect(
      updateUserProfileService.execute({
        name: 'John Tre',
        userID: user.id,
        email: 'user_one@gmail.com',
        password: '123123',
        oldPassword: '000000',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
