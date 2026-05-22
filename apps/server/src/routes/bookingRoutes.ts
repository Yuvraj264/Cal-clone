import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { authGuard } from '../middlewares/authGuard';

const router = Router();

// Public routes (used by guest booking page)
router.post('/public/book', BookingController.book);
router.post('/:id/cancel/public', BookingController.cancel);

// Protected routes (host administration dashboard)
router.get('/', authGuard, BookingController.getHostBookings);
router.post('/:id/cancel', authGuard, BookingController.cancel);

export default router;
