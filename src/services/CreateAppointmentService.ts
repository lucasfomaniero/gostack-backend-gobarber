import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repository/AppointmentsRepository';
import { Request } from '../models/Request';
import Result from '../models/Result';

export default class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository;

  constructor(repository: AppointmentsRepository) {
    // Dependency Inversion Principle
    this.appointmentsRepository = repository;
  }

  public execute({ provider, date }: Request): Result<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
      date,
    );

    if (findAppointmentInSameDate) {
      return new Result<Appointment>(
        undefined,
        Error('This appointment is already taken.'),
      );
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });
    const result = new Result(appointment, undefined);
    return result;
  }
}
