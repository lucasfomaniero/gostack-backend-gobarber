import {
  getDate,
  getDaysInMonth,
  getHours,
  isAfter,
  isEqual,
  isSameDay,
} from 'date-fns';
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
      // const compareDate = new Date(year, month - 1 , day, 23, 59, 59)
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });
      const formattedDate = new Date(year, month - 1, day);
      return {
        day,
        available:
          appointmentsInDay.length < 10 &&
          // (this.isAfterToday(formattedDate, compareDate) ||this.isTodayWithAvailableSpots(formattedDate, currentDate))
          (this.isAfterToday(formattedDate, currentDate) ||
            this.isTodayWithAvailableSpots(formattedDate, currentDate)),
      };
    });
    return availability;
  }

  private isAfterToday(date: Date, today: Date): boolean {
    return isAfter(date, today);
  }

  private isTodayWithAvailableSpots(date: Date, today: Date): boolean {
    const currentHour = getHours(today);
    return isSameDay(date, today) && currentHour < 17;
  }
}
