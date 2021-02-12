import uploadConfig from '@config/uploadConfig';
import { container } from 'tsyringe';
import DiskStorageProvider from './Implementations/DiskStorageProvider';
import S3StorageProvider from './Implementations/S3StorageProvider';
import IStorageProvider from './Models/IStorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
