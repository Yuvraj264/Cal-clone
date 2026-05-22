import dayjs from 'dayjs';
import { Types } from 'mongoose';
import { BookingModel, EventTypeModel, AvailabilityModel } from '../models';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/http';
import { CreateBookingPayload } from '@calclone/types';
import { SlotService } from './slot.service';
import { BOOKING_STATUSES } from '../constants/bookingStatuses';

export class BookingService {
  /**
   * Fetch all bookings with event type details populated, sorted upcoming first.
   */
  static async getAllBookings() {
    return await BookingModel.find()
      .populate({
        path: 'eventTypeId',
        select: 'title slug duration timezone',
      })
      .sort({ startTime: 1 }); // Chronological order: upcoming bookings first
  }

  /**
   * Fetch a single booking by ID.
   */
  static async getBookingById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'INVALID_ID', 'Provided booking ID format is invalid.');
    }

    const booking = await BookingModel.findById(id).populate({
      path: 'eventTypeId',
      select: 'title slug duration timezone',
    });

    if (!booking) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'BOOKING_NOT_FOUND', 'The requested booking does not exist.');
    }

    return booking;
  }

  /**
   * Create new guest booking appointment.
   */
  static async createBooking(payload: CreateBookingPayload) {
    // 1. Fetch event type configuration using slug
    const eventType = await EventTypeModel.findOne({ slug: payload.eventTypeSlug.toLowerCase(), isActive: true });
    if (!eventType) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'EVENT_NOT_FOUND',
        'The requested event template does not exist or is inactive.'
      );
    }

    // 2. Fetch Host Availability configuration
    const availability = await AvailabilityModel.findOne({ userId: eventType.userId });
    if (!availability) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'AVAILABILITY_NOT_FOUND',
        'Host availability schedules are not configured yet.'
      );
    }

    // 3. Leverage the Slot Engine (Phase 7) to get bookable slots for the target date
    const slotResults = await SlotService.getAvailableSlots(eventType.slug, payload.date);
    
    // 4. Verify if requested slot startTime is present in generated bookable slots
    if (!slotResults.slots.includes(payload.startTime)) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'SLOT_UNAVAILABLE',
        `The requested slot time '${payload.startTime}' is not available for booking on ${payload.date}.`
      );
    }

    // 5. Enforce dynamic timezone calculations
    const tz = availability.timezone || eventType.timezone || 'UTC';
    const startDateTime = dayjs.tz(`${payload.date}T${payload.startTime}:00`, tz);
    const endDateTime = startDateTime.add(eventType.duration, 'minute');

    const startUTC = startDateTime.toDate();
    const endUTC = endDateTime.toDate();

    // 6. Hard double booking prevention at application layer
    const doubleBooked = await BookingModel.exists({
      hostId: eventType.userId,
      status: BOOKING_STATUSES.SCHEDULED,
      startTime: startUTC,
    });

    if (doubleBooked) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        'DOUBLE_BOOKING',
        'The requested calendar slot is already booked by another scheduled meeting.'
      );
    }

    // 7. Insert and return Mongoose record
    const booking = new BookingModel({
      eventTypeId: eventType._id,
      hostId: eventType.userId,
      guestName: payload.bookerName,
      guestEmail: payload.bookerEmail,
      guestTimezone: tz,
      bookerName: payload.bookerName,
      bookerEmail: payload.bookerEmail,
      startTime: startUTC,
      endTime: endUTC,
      status: BOOKING_STATUSES.SCHEDULED,
    });

    await booking.save();
    return booking;
  }

  /**
   * Cancel an appointment (Status transition scheduled -> cancelled).
   */
  static async cancelBooking(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'INVALID_ID', 'Provided booking ID format is invalid.');
    }

    const booking = await BookingModel.findById(id);
    if (!booking) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'BOOKING_NOT_FOUND', 'The requested booking does not exist.');
    }

    booking.status = BOOKING_STATUSES.CANCELLED;
    await booking.save();

    return booking;
  }
}
