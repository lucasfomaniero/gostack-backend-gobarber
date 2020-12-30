import path from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';
import IStorageProvider from '@shared/container/Providers/StorageProvider/Models/IStorageProvider';
import AppError from '../../../shared/errors/AppError';
import Result from '../../../shared/interfaces/Result';
import User from '../infra/typeorm/entities/User';

import uploadConfig from '../../../config/uploadConfig';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  userID: string;
  avatarFileName: string;
}
@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ userID, avatarFileName }: IRequest): Promise<User> {
    const foundUser = await this.usersRepository.findById(userID);

    // Didn't find the user.
    if (!foundUser) {
      throw new AppError(
        'User not found. Only authenticated users can change an avatar',
        400,
      );
    }

    // Check if the user already has an avatar.
    if (foundUser.avatar) {
      await this.storageProvider.deleteFile(foundUser.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFileName);

    foundUser.avatar = fileName;

    await this.usersRepository.save(foundUser);

    return foundUser;
  }
}
