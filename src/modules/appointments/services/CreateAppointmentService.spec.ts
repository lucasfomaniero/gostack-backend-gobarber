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

    if (appointment.onSuccess) {
      expect(appointment.onSuccess).toHaveProperty('id');
      expect(appointment.onSuccess.providerID).toBe('123123');
    }
  });

  it('should not be able to create an appointment in the same date', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 25),
      providerID: '123123',
    });
  });
});
