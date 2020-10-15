import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Doe Updated',
      email: 'johndoe@email.com',
    });

    expect(updatedUser.name).toBe('John Doe Updated');
    expect(updatedUser.email).toBe('johndoe@email.com');
  });

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        name: 'teste',
        email: 'teste@teste.com',
        user_id: '2131231312',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    const userTest = await fakeUsersRepository.create({
      email: 'johndoetest@email.com',
      name: 'John Teste',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: userTest.id,
        name: 'John Doe Updated',
        email: 'johndoe@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Doe Updated',
      email: 'johndoe@email.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old_password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe Updated',
        email: 'johndoe@email.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old_password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe Updated',
        email: 'johndoe@email.com',
        password: '123123',
        old_password: 'wrong_password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
