import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const userID = request.user.id;
    const showProfile = container.resolve(ShowProfileService);
    try {
      const user = await showProfile.execute({ userID });
      return response.status(200).json(user);
    } catch (error) {
      return response.status(404).json('User not found');
    }
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const userID = request.user.id;
    const { name, email, oldPassword, password } = request.body;

    const updateProfile = container.resolve(UpdateUserProfileService);
    try {
      const user = await updateProfile.execute({
        userID,
        name,
        email,
        oldPassword,
        password,
      });

      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return response.json(userWithoutPassword);
    } catch (error) {
      return response.json({
        message: error.message,
      });
    }
  }
}
