import { UserDTO } from '../dto/UserDTO';
import User from '../modules/users/infra/typeorm/entities/User';

export default class UserMap {
  // public static toDomain(): User{}

  // public static toPersistence(): User{}

  public static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
