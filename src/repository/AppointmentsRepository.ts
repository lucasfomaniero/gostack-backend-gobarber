import { isEqual } from 'date-fns';
import Appointment from '../models/Appointment';
import { CreateAppointmentDTO } from '../dto/CreateAppointmentDTO';

class AppointmentsRepository {
  private appointments: Appointment[];

  constructor() {
    this.appointments = [];
  }

  // public create(data: CreateAppointmentDTO ): Appointment {
  public create({ provider, date }: CreateAppointmentDTO): Appointment {
    const appointment = new Appointment({ provider, date });

    this.appointments = [...this.appointments, appointment];

    return appointment;
  }

  public all(): Appointment[] {
    return this.appointments;
  }

  public findByDate(parsedDate: Date): Appointment | null {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(appointment.date, parsedDate),
    );

    return findAppointment || null;
  }
}

export default AppointmentsRepository;
