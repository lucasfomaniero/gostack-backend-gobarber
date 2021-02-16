import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { v4 as uuid } from 'uuid';
import { getMonth, getYear, isEqual, getDate } from 'date-fns';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IAppointmentsRepository from '../IAppointmentsRepository';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async create({
    date,
    providerID,
    userID,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();
    Object.assign(appointment, { id: uuid(), date, providerID, userID });
    this.appointments.push(appointment);
    return appointment;
  }

  public async findByDate(
    date: Date,
    providerID: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment => {
      return (
        isEqual(appointment.date, date) && appointment.providerID === providerID
      );
    });
    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    providerID,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.providerID === providerID &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findAllInDayFromProvider({
    providerID,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.providerID === providerID &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async find(): Promise<Appointment[]> {
    return this.appointments;
  }
}

export default FakeAppointmentsRepository;
