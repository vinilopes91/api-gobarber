import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const loggedUser = await fakeUsersRepository.create({
      email: 'logged_user@email.com',
      name: 'Logged User',
      password: '123456',
    });

    const user1 = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      email: 'johndoe2@email.com',
      name: 'John Doe2',
      password: '123456',
    });

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });
});
