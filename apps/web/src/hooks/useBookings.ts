import { useState, useEffect, useCallback } from 'react';
import { Booking } from '@calclone/types';
import BookingService from '../services/booking.service';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BookingService.fetchBookings();
      setBookings(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /**
   * Optimistic cancellation update with auto-rollback on REST failure.
   */
  const cancelBooking = useCallback(async (id: string) => {
    const backup = [...bookings];
    
    // 1. Instantly transition UI status optimistically
    setBookings((prev) =>
      prev.map((b) => {
        const bid = b.id || (b as any)._id;
        if (bid === id) {
          return { ...b, status: 'cancelled' };
        }
        return b;
      })
    );

    try {
      await BookingService.cancelBooking(id);
    } catch (err: any) {
      // 2. Rollback to backup state on failure
      setBookings(backup);
      throw err;
    }
  }, [bookings]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    cancelBooking,
  };
}

export default useBookings;
