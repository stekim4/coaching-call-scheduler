const { User, Slot, Call } = require('../models');

const seedDatabase = async () => {
  // Clear existing data to start with a clean slate
  await Call.destroy({ where: {} });
  await Slot.destroy({ where: {} });
  await User.destroy({ where: {} });

  // Seed initial user data
  await User.bulkCreate([
    { id: 1, name: 'Coach A', role: 'coach', phoneNumber: '123-456-7890' },
    { id: 2, name: 'Coach B', role: 'coach', phoneNumber: '123-456-7891' },
    { id: 3, name: 'Student A', role: 'student', phoneNumber: '234-567-8901' },
    { id: 4, name: 'Student B', role: 'student', phoneNumber: '234-567-8902' },
  ]);

  // Seed initial slot data
  await Slot.bulkCreate([
    { id: 1, coachId: 1, startTime: '2024-05-01T09:00:00-05:00', endTime: '2024-05-01T11:00:00-05:00' }, // Past slot example - associated with completed call id 1
    { id: 2, coachId: 1, startTime: '2024-08-01T09:00:00-05:00', endTime: '2024-08-01T11:00:00-05:00' }, // Upcoming slot example - associated with upcoming call id 2
    { id: 3, coachId: 1, startTime: '2024-10-01T09:00:00-05:00', endTime: '2024-10-01T11:00:00-05:00' }, // Upcoming slot example - no call association
  ]);

  // Seed initial call data
  await Call.bulkCreate([
    { id: 1, studentId: 3, slotId: 1 }, // Completed call example
    { id: 2, studentId: 3, slotId: 2 }, // Upcoming call example
  ]);
};

module.exports = seedDatabase;