import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import { BookingService } from '../services/booking.service';
import { HTTP_STATUS } from '../constants/http';

export const getAllBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await BookingService.getAllBookings();
  return successResponse(res, HTTP_STATUS.OK, bookings, 'Bookings retrieved successfully.');
});

export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await BookingService.getBookingById(id);
  return successResponse(res, HTTP_STATUS.OK, booking, 'Booking retrieved successfully.');
});

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  const newBooking = await BookingService.createBooking(payload);
  return successResponse(res, HTTP_STATUS.CREATED, newBooking, 'Booking created successfully');
});

export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const cancelledBooking = await BookingService.cancelBooking(id);
  return successResponse(res, HTTP_STATUS.OK, cancelledBooking, 'Booking cancelled successfully');
});
