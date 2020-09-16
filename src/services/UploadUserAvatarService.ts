import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import AppError from '../errors/AppError';
import Result from '../interfaces/Result';
import User from '../models/User';

import uploadConfig from '../config/uploadConfig';

interface Request {
  userID: string;
  filename: string;
}

export default class UpdateUserAvatarService {
  public async execute({ userID, filename }: Request): Promise<Result<User>> {
    const userRepository = getRepository(User);
    const foundUser = await userRepository.findOne(userID);

    if (!foundUser) {
      return new Result<User>(
        undefined,
        new AppError(
          'User not found. Only authenticated users can change a avatar',
        ),
      );
    }

    if (foundUser.avatar) {
      // Delete avatar
      // Pede ao node para juntar o nome do arquivo e o caminho de uploadConfig
      const userAvatarFilePath = path.join(
        uploadConfig.directory,
        foundUser.avatar,
      );
      // Pede para o fs do Node verificar se o arquivo existe no caminho informado
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    foundUser.avatar = filename;

    await userRepository.save(foundUser);

    return new Result<User>(foundUser, undefined);
  }
}
