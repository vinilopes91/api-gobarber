import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';

import uploadConfig from '@config/upload';

import User from '../infra/typeorm/entities/User';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const userRespository = getRepository(User);

    const user = await userRespository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;

    await userRespository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
