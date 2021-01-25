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
    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 25),
      providerID: '123123',
      userID: '123456',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerID).toBe('123123');
  });

  it('should not be able to create an appointment in the same date', async () => {
    const date = new Date(2020, 4, 25);

    await createAppointment.execute({
      date,
      providerID: '123123',
      userID: '123456',
    });
    expect(
      createAppointment.execute({
        date,
        providerID: '123123',
        userID: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
