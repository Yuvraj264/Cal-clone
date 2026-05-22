export type BookingStatus = 'scheduled' | 'cancelled' | 'completed';

export interface IBookingBase {
  eventTypeId: string;
  bookerName: string;
  bookerEmail: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  status: BookingStatus;
}

export interface IBookingDTO extends IBookingBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}
