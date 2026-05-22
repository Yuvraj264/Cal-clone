import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface BookingFormProps {
  date: string;
  time: string;
  onSubmit: (formData: { bookerName: string; bookerEmail: string }) => Promise<void>;
  onBack: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  date,
  time,
  onSubmit,
  onBack,
}) => {
  const [bookerName, setBookerName] = useState('');
  const [bookerEmail, setBookerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!bookerName.trim()) {
      setError('Name is required.');
      return;
    }
    if (!bookerEmail.trim() || !/^\S+@\S+\.\S+$/.test(bookerEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ bookerName, bookerEmail });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl dark:bg-gray-900/40 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
        <span className="font-bold text-gray-900 dark:text-white">Selected Appointment Time:</span>{' '}
        {date} at {time}
      </div>

      <Input
        label="Your name"
        placeholder="e.g. Jane Doe"
        value={bookerName}
        onChange={(e) => setBookerName(e.target.value)}
        id="booker-name"
        required
      />

      <Input
        label="Email address"
        type="email"
        placeholder="e.g. jane@example.com"
        value={bookerEmail}
        onChange={(e) => setBookerEmail(e.target.value)}
        id="booker-email"
        required
      />

      {error && (
        <span className="text-[11px] font-semibold text-rose-600">
          {error}
        </span>
      )}

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button variant="outline" size="sm" type="button" onClick={onBack}>
          Back
        </Button>
        <Button size="sm" type="submit" loading={submitting}>
          Confirm Appointment
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
