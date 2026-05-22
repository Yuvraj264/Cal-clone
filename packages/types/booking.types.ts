export type BookingStatus = 'scheduled' | 'cancelled' | 'completed' | 'confirmed';

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

export type Slot = string; // e.g. "09:00"

export interface SlotResponse {
  date: string;
  slots: Slot[];
}

export interface SlotQueryParams {
  slug: string;
  date: string;
}
