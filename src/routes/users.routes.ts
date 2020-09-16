import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import UserMap from '../mappers/UserMap';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/uploadConfig';
import UpdateUserAvatarService from '../services/UploadUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const service = new CreateUserService();

    const savedUser = await service.execute({ name, email, password });
    const user = UserMap.toDTO(savedUser);

    return response.status(200).json(user);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const service = new UpdateUserAvatarService();
    const result = await service.execute({
      userID: request.user.id,
      filename: request.file.filename,
    });

    if (result.onSuccess) {
      const user = UserMap.toDTO(result.onSuccess);
      return response.status(200).json(user);
    }

    return response.status(400).json({ message: result.onError?.message });
  },
);

export default usersRouter;
