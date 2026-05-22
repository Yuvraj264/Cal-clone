export interface IAvailabilityBase {
  userId: string;
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  timezone: string;
}

export interface IAvailabilityDTO extends IAvailabilityBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}
