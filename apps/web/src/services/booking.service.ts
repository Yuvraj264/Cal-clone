import { Booking, CreateBookingPayload } from '@calclone/types';
import { apiClient, invalidateApiCache } from './apiClient';

export class BookingService {
  /**
   * Fetch all bookings with event type details populated, sorted upcoming first.
   */
  static async fetchBookings(): Promise<Booking[]> {
    const res = await apiClient.get<{ success: boolean; data: Booking[] }>('/bookings');
    return res.data.data;
  }

  /**
   * Fetch a single booking by ID.
   */
  static async fetchBookingById(id: string): Promise<Booking> {
    const res = await apiClient.get<{ success: boolean; data: Booking }>(`/bookings/${id}`);
    return res.data.data;
  }

  /**
   * Create new guest booking appointment.
   */
  static async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    invalidateApiCache(); // Invalidate local request cache on mutation
    const res = await apiClient.post<{ success: boolean; data: Booking }>('/bookings', payload);
    return res.data.data;
  }

  /**
   * Cancel an appointment (Status transition scheduled -> cancelled).
   */
  static async cancelBooking(id: string): Promise<Booking> {
    invalidateApiCache(); // Invalidate local request cache on mutation
    const res = await apiClient.patch<{ success: boolean; data: Booking }>(`/bookings/${id}/cancel`);
    return res.data.data;
  }
}

export default BookingService;
