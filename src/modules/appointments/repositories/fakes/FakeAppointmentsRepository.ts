import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { v4 as uuid } from 'uuid';
import { isEqual } from 'date-fns';
import IAppointmentsRepository from '../IAppointmentsRepository';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async create({
    date,
    providerID,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();
    Object.assign(appointment, { id: uuid(), date, providerID });
    this.appointments.push(appointment);
    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment => {
      return isEqual(appointment.date, date);
    });
    return findAppointment;
  }

  public async find(): Promise<Appointment[]> {
    return this.appointments;
  }
}

export default FakeAppointmentsRepository;
