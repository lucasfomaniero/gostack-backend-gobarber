import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/Providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderService from './ListProviderService';

let fakeUsersRepository: FakeUsersRepository;
let listProviderService: ListProviderService;
let fakeCacheProvider: FakeCacheProvider;

describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderService = new ListProviderService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to list the providers excepting the user id', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntre@gmail.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'John Qua',
      email: 'johnqua@gmail.com',
      password: '123456',
    });

    const providers = await listProviderService.execute({
      userID: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
  it('should be able to list all providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntre@gmail.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'John Qua',
      email: 'johnqua@gmail.com',
      password: '123456',
    });

    const providers = await listProviderService.execute({});

    expect(providers).toEqual([user1, user2, loggedUser]);
  });
});
