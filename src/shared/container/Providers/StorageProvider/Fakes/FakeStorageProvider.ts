import IStorageProvider from '../Models/IStorageProvider';

class FakeStorageProvider implements IStorageProvider {
  private files: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.files.push(file);
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const foundFile = this.files.findIndex(f => f === file);
    this.files.splice(foundFile, 1);
  }
}

export default FakeStorageProvider;
