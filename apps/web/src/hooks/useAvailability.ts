import { useState, useEffect, useCallback } from 'react';
import AvailabilityService, { AvailabilityPayload } from '../services/availability.service';

export function useAvailability() {
  const [availability, setAvailability] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AvailabilityService.fetchAvailability();
      if (data && data.length > 0) {
        setAvailability(data[0]);
      } else {
        // Fallback default setup to satisfy page load
        setAvailability({
          timezone: 'Asia/Kolkata',
          slots: [
            { weekday: 'monday', startTime: '09:00', endTime: '17:00', isActive: true },
            { weekday: 'tuesday', startTime: '09:00', endTime: '17:00', isActive: true },
            { weekday: 'wednesday', startTime: '09:00', endTime: '17:00', isActive: true },
            { weekday: 'thursday', startTime: '09:00', endTime: '17:00', isActive: true },
            { weekday: 'friday', startTime: '09:00', endTime: '17:00', isActive: true },
            { weekday: 'saturday', startTime: '09:00', endTime: '17:00', isActive: false },
            { weekday: 'sunday', startTime: '09:00', endTime: '17:00', isActive: false },
          ],
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve availability configurations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const saveAvailability = useCallback(async (payload: AvailabilityPayload) => {
    const backup = { ...availability };
    
    // Optimistic UI update
    setAvailability((prev: any) => ({
      ...prev,
      ...payload,
    }));

    try {
      const id = availability?.id || availability?._id;
      if (id) {
        await AvailabilityService.updateAvailability(id, payload);
      } else {
        await AvailabilityService.createAvailability(payload);
      }
      await fetchAvailability();
    } catch (err) {
      // Rollback on failure
      setAvailability(backup);
      throw err;
    }
  }, [availability, fetchAvailability]);

  return {
    availability,
    loading,
    error,
    refetch: fetchAvailability,
    saveAvailability,
  };
}

export default useAvailability;
