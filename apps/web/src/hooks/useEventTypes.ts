import { useState, useEffect, useCallback } from 'react';
import EventTypeService, { EventTypePayload } from '../services/eventType.service';

export function useEventTypes() {
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await EventTypeService.fetchEventTypes();
      setEventTypes(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve event templates.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventTypes();
  }, [fetchEventTypes]);

  const createEventType = useCallback(async (payload: EventTypePayload) => {
    try {
      const data = await EventTypeService.createEventType(payload);
      setEventTypes((prev) => [...prev, data]);
      await fetchEventTypes();
    } catch (err) {
      throw err;
    }
  }, [fetchEventTypes]);

  /**
   * Optimistic deletion with auto-rollback on failure
   */
  const deleteEventType = useCallback(async (id: string) => {
    const backup = [...eventTypes];
    
    // Instantly filter out from UI optimistically
    setEventTypes((prev) => prev.filter((et) => (et.id || et._id) !== id));

    try {
      await EventTypeService.deleteEventType(id);
    } catch (err) {
      // Rollback on failure
      setEventTypes(backup);
      throw err;
    }
  }, [eventTypes]);

  return {
    eventTypes,
    loading,
    error,
    refetch: fetchEventTypes,
    createEventType,
    deleteEventType,
  };
}

export default useEventTypes;
