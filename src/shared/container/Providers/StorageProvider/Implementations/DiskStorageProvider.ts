import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/uploadConfig';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '../Models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadFolder, file),
    );
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadFolder, file);

    try {
      fs.promises.stat(filePath);
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.log(error);
    }
  }
}

export default DiskStorageProvider;
