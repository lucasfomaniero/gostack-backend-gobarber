import path from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import Result from '../../../interfaces/Result';
import User from '../infra/typeorm/entities/User';

import uploadConfig from '../../../config/uploadConfig';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  userID: string;
  filename: string;
}
@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userID, filename }: IRequest): Promise<Result<User>> {
    const foundUser = await this.usersRepository.findById(userID);

    // Didn't find the user.
    if (!foundUser) {
      return new Result<User>(
        undefined,
        new AppError(
          'User not found. Only authenticated users can change an avatar',
        ),
      );
    }

    // Check if the user already has an avatar.
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

    await this.usersRepository.save(foundUser);

    return new Result<User>(foundUser, undefined);
  }
}
