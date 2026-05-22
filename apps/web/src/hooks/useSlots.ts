import { useState, useEffect, useCallback } from 'react';
import SlotService from '../services/slot.service';

export function useSlots(slug: string, date: string) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    if (!slug || !date) {
      setSlots([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await SlotService.fetchAvailableSlots(slug, date);
      setSlots(data.slots || []);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve available scheduling slots.');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [slug, date]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  return {
    slots,
    loading,
    error,
    refetch: fetchSlots,
  };
}

export default useSlots;
