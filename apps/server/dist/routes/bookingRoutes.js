"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const authGuard_1 = require("../middlewares/authGuard");
const router = (0, express_1.Router)();
// Public routes (used by guest booking page)
router.post('/public/book', bookingController_1.BookingController.book);
router.post('/:id/cancel/public', bookingController_1.BookingController.cancel);
// Protected routes (host administration dashboard)
router.get('/', authGuard_1.authGuard, bookingController_1.BookingController.getHostBookings);
router.post('/:id/cancel', authGuard_1.authGuard, bookingController_1.BookingController.cancel);
exports.default = router;
