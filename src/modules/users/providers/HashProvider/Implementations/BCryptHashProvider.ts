import { compare, hash } from 'bcryptjs';
import IHashProvider from '../Models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
  async generateHash(payload: string): Promise<string> {
    const hashPassword = await hash(payload, 8);
    return hashPassword;
  }

  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

export default BCryptHashProvider;
