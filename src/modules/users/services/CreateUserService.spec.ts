import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/implementations/BCryptHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });
  it('should not be able to create a new user with same email from another', async () => {
    await createUser.execute({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      createUser.execute({
        email: 'johndoe@email.com',
        name: 'John Doe 2',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
