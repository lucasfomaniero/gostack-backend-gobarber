import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('Create Appointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });
    const appointment = await createAppointment.execute({
      date: new Date(2021, 4, 10, 13),
      providerID: 'provider-id',
      userID: 'user-id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerID).toBe('provider-id');
  });

  it('should not be able to create an appointment in the same date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 10).getTime();
    });
    const date = new Date(2021, 4, 10, 11);

    await createAppointment.execute({
      date,
      providerID: 'provider-id',
      userID: 'user-id',
    });
    expect(
      createAppointment.execute({
        date,
        providerID: 'provider-id',
        userID: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 4, 10, 11),
        providerID: 'provider-id',
        userID: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 4, 10, 13),
        providerID: 'user-id',
        userID: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 4, 11, 7),
        providerID: 'provider-id',
        userID: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2021, 4, 11, 18),
        providerID: 'provider-id',
        userID: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
