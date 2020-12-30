import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/Providers/StorageProvider/Fakes/FakeStorageProvider';
import FakeHashProvider from '../providers/HashProvider/Fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('Update User Avatar', () => {
  it('should be able to upload an user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakestorageProvider = new FakeStorageProvider();
    const fakeHashProvider = new FakeHashProvider();
    // Creates a new user
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakestorageProvider,
    );
    const userWithSavedAvatar = await updateUserAvatar.execute({
      avatarFileName: 'arquivoNome',
      userID: user.id,
    });
    expect(userWithSavedAvatar.avatar).toBeTruthy();
  });
});
