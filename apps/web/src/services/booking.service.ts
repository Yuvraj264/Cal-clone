import axios from 'axios';
import { Booking } from '@calclone/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace('/v1', '') 
  : 'http://localhost:5000/api';

const bookingClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const BookingService = {
  /**
   * Fetches all booking records from backend.
   */
  async fetchBookings(): Promise<Booking[]> {
    const response = await bookingClient.get('/bookings');
    return response.data.data;
  },

  /**
   * Fetches a single booking record by ID.
   */
  async fetchBookingById(id: string): Promise<Booking> {
    const response = await bookingClient.get(`/bookings/${id}`);
    return response.data.data;
  },

  /**
   * Cancels a booking using its ObjectId.
   */
  async cancelBooking(id: string): Promise<Booking> {
    const response = await bookingClient.patch(`/bookings/${id}/cancel`);
    return response.data.data;
  },
};
export default BookingService;
