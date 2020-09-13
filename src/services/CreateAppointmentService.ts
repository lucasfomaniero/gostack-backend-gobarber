import { startOfHour } from 'date-fns';
import { getCustomRepository, Repository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repository/AppointmentsRepository';
import { Request } from '../interfaces/Request';
import Result from '../interfaces/Result';

export default class CreateAppointmentService {
  public async execute({
    provider,
    date,
  }: Request): Promise<Result<Appointment>> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);
    // It verifies if an appointment is in the same date
    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      date,
    );

    if (findAppointmentInSameDate) {
      return new Result<Appointment>(
        undefined,
        Error('This appointment is already taken.'),
      );
    }

    const appointment = appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);
    const result = new Result(appointment, undefined);
    return result;
  }
}
