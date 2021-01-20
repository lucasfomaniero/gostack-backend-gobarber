import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/Models/IHashProvider';

interface IRequest {
  userID: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}
@injectable()
export default class UpdateUserProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    userID,
    name,
    email,
    oldPassword,
    password,
  }: IRequest): Promise<User> {
    const foundUser = await this.usersRepository.findById(userID);
    let hash: string;
    // Didn't find the user.
    if (!foundUser) {
      throw new AppError('User not found.', 400);
    }

    const foundUserWithSameEmail = await this.usersRepository.findByEmail(
      email,
    );

    if (foundUserWithSameEmail && foundUser.id !== foundUserWithSameEmail.id) {
      throw new AppError('Email address already taken. Please try again');
    }

    foundUser.name = name;
    foundUser.email = email;
    // Check if user changed the password
    if (password && !oldPassword) {
      throw new AppError(
        'You need to confirm the old password to set a new one',
      );
    }

    if (password && oldPassword) {
      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
        foundUser.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Wrong password. Please try again');
      }

      foundUser.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(foundUser);
  }
}
