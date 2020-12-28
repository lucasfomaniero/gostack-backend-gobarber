import { container } from 'tsyringe';
import BCryptHashProvider from './HashProvider/Implementations/BCryptHashProvider';
import IHashProvider from './HashProvider/Models/IHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
