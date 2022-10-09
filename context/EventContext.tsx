import React from "react";
import { Event, EventContextProps } from "../types/api/Event";

export const EventContext = React.createContext<EventContextProps>(null);

export type EventProviderProps = { children: React.ReactElement; event: Event };

export function EventProvider({ children, event }: EventProviderProps) {
  return <EventContext.Provider value={event}>{children}</EventContext.Provider>;
}

export function useEventContext() {
  return React.useContext(EventContext);
}
