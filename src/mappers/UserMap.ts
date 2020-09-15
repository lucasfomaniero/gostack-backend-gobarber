import { UserDTO } from '../dto/UserDTO';
import User from '../models/User';

export default class UserMap {
  // public static toDomain(): User{}

  // public static toPersistence(): User{}

  public static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
