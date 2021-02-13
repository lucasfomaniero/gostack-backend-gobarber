import path from 'path';
import fs from 'fs';
import mime from 'mime';
import uploadConfig from '@config/uploadConfig';
import AppError from '@shared/errors/AppError';
import aws, { S3 } from 'aws-sdk';
import IStorageProvider from '../Models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-2',
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new AppError('File not found.', 404);
    }
    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: 'app-gobarber-lucasmaniero',
        Key: file,
        ACL: 'public-read',
        ContentType,
        Body: fileContent,
      })
      .promise();
    await fs.promises.unlink(originalPath);
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider;
