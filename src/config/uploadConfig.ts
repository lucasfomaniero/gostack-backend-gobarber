import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder,
  uploadFolder: path.resolve(tmpFolder, 'uploads'),

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      // const formattedName = file.originalname.split(' ').join('');
      const formattedName = file.originalname.replace(/\s/g, '');
      const fileName = `${fileHash}-${formattedName}`;
      return callback(null, fileName);
    },
  }),
};
