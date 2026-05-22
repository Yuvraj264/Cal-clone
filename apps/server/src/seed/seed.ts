import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { UserModel, EventTypeModel, AvailabilityModel, BookingModel } from '../models';
import { BOOKING_STATUS } from '../constants/validation';

// Load environmental variables
dotenv.config();

const sampleUsers = [
  {
    name: 'Alice Developer',
    email: 'alice@calclone.dev',
  },
  {
    name: 'Bob Designer',
    email: 'bob@calclone.dev',
  },
];

const sampleEventTypes = (userIds: string[]) => [
  {
    userId: userIds[0],
    title: 'SDE 30m Tech Interview',
    description: 'Technical alignment and systems architecture review.',
    duration: 30,
    slug: 'tech-interview',
    timezone: 'UTC',
  },
  {
    userId: userIds[0],
    title: 'SDE 60m Design Interview',
    description: 'Deep dive into scalable product planning, database schemas, and MERN integrations.',
    duration: 60,
    slug: 'system-design',
    timezone: 'UTC',
  },
  {
    userId: userIds[1],
    title: 'Creative Sync 15m',
    description: 'Fast alignment for design tokens, typography, and shadcn styling rules.',
    duration: 15,
    slug: 'creative-sync',
    timezone: 'UTC',
  },
];

const sampleAvailability = (userIds: string[]) => [
  // Alice availability: Mon (1) to Fri (5), 09:00 to 17:00
  ...Array.from({ length: 5 }, (_, i) => ({
    userId: userIds[0],
    dayOfWeek: i + 1,
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'UTC',
  })),
  // Bob availability: Mon (1) to Thu (4), 10:00 to 16:00
  ...Array.from({ length: 4 }, (_, i) => ({
    userId: userIds[1],
    dayOfWeek: i + 1,
    startTime: '10:00',
    endTime: '16:00',
    timezone: 'UTC',
  })),
];

const sampleBookings = (eventTypeIds: string[]) => [
  {
    eventTypeId: eventTypeIds[0],
    bookerName: 'Carol Guest',
    bookerEmail: 'carol@guest.dev',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    status: BOOKING_STATUS.SCHEDULED,
  },
  {
    eventTypeId: eventTypeIds[1],
    bookerName: 'Dan Recruiter',
    bookerEmail: 'dan@recruiting.dev',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // day after tomorrow
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    status: BOOKING_STATUS.SCHEDULED,
  },
];

export async function seedDatabase(): Promise<void> {
  try {
    console.log('[SEED SYSTEM]: Cleaning existing datasets...');
    await UserModel.deleteMany({});
    await EventTypeModel.deleteMany({});
    await AvailabilityModel.deleteMany({});
    await BookingModel.deleteMany({});

    console.log('[SEED SYSTEM]: Inserting sample users...');
    const insertedUsers = await UserModel.insertMany(sampleUsers);
    const userIds = insertedUsers.map((u) => u._id.toString());

    console.log('[SEED SYSTEM]: Inserting sample event types...');
    const insertedEventTypes = await EventTypeModel.insertMany(sampleEventTypes(userIds));
    const eventTypeIds = insertedEventTypes.map((e) => e._id.toString());

    console.log('[SEED SYSTEM]: Inserting availability slots matrix...');
    await AvailabilityModel.insertMany(sampleAvailability(userIds));

    console.log('[SEED SYSTEM]: Inserting scheduled guest bookings...');
    await BookingModel.insertMany(sampleBookings(eventTypeIds));

    console.log('[SEED SYSTEM]: Database seeded successfully with core resources.');
  } catch (error: any) {
    console.error(`[SEED SYSTEM ERROR]: Failure populating database: ${error.message}`);
    throw error;
  }
}

// Support executing seed process directly via CLI command execution
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      console.log('[SEED SYSTEM]: Process finished successfully. Shutting down connection...');
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('[SEED SYSTEM FATAL]: Boot failure:', err);
      process.exit(1);
    }
  })();
}
