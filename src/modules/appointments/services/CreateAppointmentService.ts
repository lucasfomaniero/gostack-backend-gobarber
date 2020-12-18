import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';
import Result from '../../../shared/interfaces/Result';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  providerID: string;
  date: Date;
}
@injectable()
export default class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    providerID,
    date,
  }: IRequest): Promise<Result<Appointment>> {
    const appointmentDate = startOfHour(date);
    // It verifies if an appointment is in the same date
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      date,
    );

    if (findAppointmentInSameDate) {
      return new Result<Appointment>(
        undefined,
        new AppError('This appointment is already taken.'),
      );
    }

    const appointment = await this.appointmentsRepository.create({
      providerID,
      date: appointmentDate,
    });
    const result = new Result(appointment, undefined);
    return result;
  }
}
