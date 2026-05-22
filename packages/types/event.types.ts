export interface IEventTypeBase {
  userId: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  slug: string;
  timezone: string;
}

export interface IEventTypeDTO extends IEventTypeBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}
