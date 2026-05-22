import dayjs from 'dayjs';
import { Types } from 'mongoose';
import { EventTypeModel, AvailabilityModel, BookingModel, UserModel } from '../models';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/http';
import { isValidISODate } from '../utils/dateTime';
import { generateIntervalSlots } from '../utils/slotGenerator';

export class SlotService {
  /**
   * Evaluates and returns open scheduling slots for a given slug template and target date.
   */
  static async getAvailableSlots(slug: string, dateStr: string) {
    // 1. Validate date query parameter
    if (!dateStr || !isValidISODate(dateStr)) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'INVALID_DATE', 'A valid ISO date parameter is required.');
    }

    // 2. Fetch the target Event Type template
    const eventType = await EventTypeModel.findOne({ slug: slug.toLowerCase(), isActive: true });
    if (!eventType) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'EVENT_NOT_FOUND', 'The requested event template slug does not exist or is inactive.');
    }

    // 3. Locate user profile linked to the event type
    const hostUser = await UserModel.findById(eventType.userId);
    if (!hostUser) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'HOST_NOT_FOUND', 'The host user linked to this event was not found.');
    }

    // 4. Fetch host availability schedule rules
    const availability = await AvailabilityModel.findOne({ userId: eventType.userId });
    if (!availability) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'AVAILABILITY_NOT_FOUND', 'Host availability rules are not configured yet.');
    }

    // 5. Check if the target day is working or blocked via overrides
    const targetDayOfWeek = dayjs(dateStr).day();
    
    // Check custom overrides first
    const override = availability.dateOverrides.find((o) => o.date === dateStr);
    let workingStart = '';
    let workingEnd = '';
    let isBlocked = false;

    if (override) {
      if (override.blocked) {
        isBlocked = true;
      } else {
        workingStart = override.startTime;
        workingEnd = override.endTime;
      }
    } else {
      // Fallback to weekly schedule slots
      const weeklySlot = availability.weeklySlots.find((s) => s.dayOfWeek === targetDayOfWeek && s.active);
      if (!weeklySlot) {
        isBlocked = true;
      } else {
        workingStart = weeklySlot.startTime;
        workingEnd = weeklySlot.endTime;
      }
    }

    if (isBlocked || !workingStart || !workingEnd) {
      return {
        date: dateStr,
        slots: [],
      };
    }

    // 6. Fetch existing guest bookings blocking availability slots (status = scheduled)
    const targetStart = dayjs(dateStr).startOf('day').toDate();
    const targetEnd = dayjs(dateStr).endOf('day').toDate();

    const scheduledBookings = await BookingModel.find({
      hostId: eventType.userId,
      status: 'scheduled',
      startTime: { $gte: targetStart, $lte: targetEnd },
    }).select('startTime endTime');

    // 7. Calculate bookable options using the slot generator utility
    const slots = generateIntervalSlots({
      startTime: workingStart,
      endTime: workingEnd,
      duration: eventType.duration,
      bookings: scheduledBookings,
      date: dateStr,
      timezone: availability.timezone || eventType.timezone || 'UTC',
    });

    return {
      date: dateStr,
      slots,
    };
  }
}
