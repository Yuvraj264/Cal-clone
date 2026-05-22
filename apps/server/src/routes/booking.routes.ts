import { Router } from 'express';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  cancelBooking,
} from '../controllers/booking.controller';
import { validateCreateBooking } from '../validators/booking.validator';

const router = Router();

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', validateCreateBooking, createBooking);
router.patch('/:id/cancel', cancelBooking);

export default router;
