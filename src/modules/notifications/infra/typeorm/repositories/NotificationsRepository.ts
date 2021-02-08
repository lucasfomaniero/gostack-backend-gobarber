import { getMongoRepository, MongoRepository } from 'typeorm';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/infra/typeorm/repositories/INotificationsRepository';

import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    recipientID,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      recipientID,
      content,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
