import { getDate, getDaysInMonth, isAfter, isEqual, isSameDay } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
// :TODO - Correct this file to pass the test
interface IRequest {
  providerID: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    providerID,
    year,
    month,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        providerID,
        year,
        month,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    const currentDate = new Date();
    const eachDayArray = Array.from(
      {
        length: numberOfDaysInMonth,
      },
      (_, index) => index + 1,
    );
    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });
      const formattedDate = new Date(year, month - 1, day);
      return {
        day,
        available:
          appointmentsInDay.length < 10 &&
          (this.isAfterToday(formattedDate, currentDate) ||
            this.isTodayWithAvailableSpots(
              appointmentsInDay,
              formattedDate,
              currentDate,
            )),
      };
    });
    return availability;
  }

  private isAfterToday(date: Date, today: Date): boolean {
    return isAfter(date, today);
  }

  private isTodayWithAvailableSpots(
    appointments: Appointment[],
    date: Date,
    today: Date,
  ): boolean {
    console.log('Data:', date, 'Agendamentos no dia: ', appointments.length);
    return appointments.length < 10 && isSameDay(date, today);
  }
}
