import { startOfHour } from 'date-fns';
import { getCustomRepository, Repository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repository/AppointmentsRepository';
import Result from '../interfaces/Result';

interface Request {
  providerID: string;
  date: Date;
}

export default class CreateAppointmentService {
  public async execute({
    providerID,
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
      providerID,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);
    const result = new Result(appointment, undefined);
    return result;
  }
}
