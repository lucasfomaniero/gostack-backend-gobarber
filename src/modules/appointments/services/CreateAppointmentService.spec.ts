import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('Create Appointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 25),
      providerID: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerID).toBe('123123');
  });

  it('should not be able to create an appointment in the same date', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
    const date = new Date(2020, 4, 25);

    await createAppointment.execute({
      date,
      providerID: '123123',
    });
    expect(
      createAppointment.execute({
        date,
        providerID: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
