import { Location } from "./Location";
import { EventOrganization } from "./Organization";

export type Event = {
  id: string;
  name: string;
  description: string;
  img_url: string;
  location: Location;
  //dates
  date: string;
  open_date: string;
  visible_date: string;
  close_date: string;
  organization: EventOrganization;
  //colors
  primary_color: string;
  secondary_color: string;
};

export type EventContextProps = Event | null;
