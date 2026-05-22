import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';

interface AvailabilityFormProps {
  initialAvailability: {
    id?: string;
    _id?: string;
    timezone?: string;
    slots: {
      weekday: string;
      startTime: string;
      endTime: string;
      isActive: boolean;
    }[];
  };
  onSave: (data: any) => Promise<void>;
}

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  initialAvailability,
  onSave,
}) => {
  const [timezone, setTimezone] = useState(initialAvailability.timezone || 'Asia/Kolkata');
  const [slots, setSlots] = useState(initialAvailability.slots || []);
  const [submitting, setSubmitting] = useState(false);

  const handleToggleDay = (index: number) => {
    setSlots((prev) =>
      prev.map((slot, i) => {
        if (i === index) {
          return { ...slot, isActive: !slot.isActive };
        }
        return slot;
      })
    );
  };

  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setSlots((prev) =>
      prev.map((slot, i) => {
        if (i === index) {
          return { ...slot, [field]: value };
        }
        return slot;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave({
        timezone,
        slots,
      });
    } catch (err) {
      console.error('Failed to update availability form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Timezone Select */}
      <div className="bg-white border border-gray-150 p-6 rounded-2xl dark:bg-gray-900 dark:border-gray-800/80">
        <Select
          label="Scheduling Timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          options={[
            { value: 'Asia/Kolkata', label: 'India Standard Time (Asia/Kolkata)' },
            { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
            { value: 'America/New_York', label: 'Eastern Standard Time (America/New_York)' },
            { value: 'Europe/London', label: 'Greenwich Mean Time (Europe/London)' },
          ]}
          id="timezone-picker"
        />
      </div>

      {/* Weekday Configuration Rows */}
      <div className="bg-white border border-gray-150 rounded-2xl dark:bg-gray-900 dark:border-gray-800/80 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/40">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Active Hours</h3>
          <p className="text-xs text-gray-500">Configure weekly recurring working hours.</p>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {slots.map((slot, index) => (
            <div key={slot.weekday} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-dashed border-gray-100 dark:border-gray-800/50 last:border-b-0">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`day-${slot.weekday}`}
                  checked={slot.isActive}
                  onChange={() => handleToggleDay(index)}
                  className="h-4.5 w-4.5 rounded border-gray-300 text-black focus:ring-black dark:border-gray-700 dark:bg-gray-800"
                />
                <label
                  htmlFor={`day-${slot.weekday}`}
                  className="text-xs font-semibold text-gray-900 dark:text-white capitalize w-20"
                >
                  {slot.weekday}
                </label>
              </div>

              {slot.isActive ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={slot.startTime}
                    onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                    className="w-20 px-2 py-1 text-xs text-center"
                    placeholder="09:00"
                  />
                  <span className="text-xs text-gray-400">to</span>
                  <Input
                    type="text"
                    value={slot.endTime}
                    onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                    className="w-20 px-2 py-1 text-xs text-center"
                    placeholder="17:00"
                  />
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic">Unavailable</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" loading={submitting}>
          Save availability
        </Button>
      </div>
    </form>
  );
};

export default AvailabilityForm;
