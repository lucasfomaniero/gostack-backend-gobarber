import User from '../models/User';

export default class UserMap {
  // public static toDomain(): User{}

  // public static toPersistence(): User{}

  public static toDTO(user: User): any {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
