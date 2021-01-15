import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { v4 as uuid } from 'uuid';
import IUserTokensRepository from '../IUserTokensRepository';

export default class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(userID: string): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userID,
    });
    this.userTokens.push(userToken);
    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const result = this.userTokens.find(userToken => userToken.token === token);
    return result;
  }
}
