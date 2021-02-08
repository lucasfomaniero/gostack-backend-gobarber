import { startOfHour, isBefore, getHours, format } from 'date-fns';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  providerID: string;
  date: Date;
  userID: string;
}
@injectable()
export default class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    providerID,
    date,
    userID,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date.");
    }

    if (userID === providerID) {
      throw new AppError("You can't create an appointment with yourself.");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create appontments between 8am and 5pm.',
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      date,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('There is an appointment in the same date.', 400);
    }

    const appointment = await this.appointmentsRepository.create({
      providerID,
      date: appointmentDate,
      userID,
    });

    await this.createNotificationAtDate(appointmentDate, providerID);

    return appointment;
  }

  private async createNotificationAtDate(
    date: Date,
    userID: string,
  ): Promise<void> {
    const dateFormatted = format(date, "dd/MM/yyyy 'às' HH'h'mm");

    await this.notificationsRepository.create({
      recipientID: userID,
      content: `Novo agendamento para o dia ${dateFormatted}`,
    });
  }
}
