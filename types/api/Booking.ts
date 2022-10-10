import { Event } from "./Event";
import { User } from "./User";

export type Booking = {
  id: string;
  date_booked: string;
  entered: boolean;
  code: string;
  event: Event;
  user: User;
};
