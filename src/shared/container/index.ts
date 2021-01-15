import { container } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import '@modules/users/providers';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IStorageProvider from './Providers/StorageProvider/Models/IStorageProvider';
import DiskStorageProvider from './Providers/StorageProvider/Implementations/DiskStorageProvider';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IStorageProvider>(
  'Storageprovider',
  DiskStorageProvider,
);
