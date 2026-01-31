import React, { createContext, useContext, useEffect, useState, useRef } from "react";

export type EventItem = {
  TITLE: string;
  DESCRIPTION?: string;
  IMG_1?: string;
  IMG_2?: string;
  IMG_3?: string;
  DATE?: string;
};

const EVENTS_JSON_URL = "/events/events.json";

const EventsContext = createContext<{ events: EventItem[]; loading: boolean; error: string | null }>({ events: [], loading: true, error: null });

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to fetch with cache busting and timeout
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${EVENTS_JSON_URL}?cb=${Date.now()}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
      const res = await fetch(url, { cache: "no-store", signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      const filteredEvents = Array.isArray(data)
        ? data.filter((event) => event.TITLE && event.TITLE.trim().length > 0)
        : [];
      setEvents(filteredEvents);
    } catch (e: any) {
      setError("Failed to load events. Please try again later.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // Set up refresh every 6 hours (21600000 ms)
    intervalRef.current = setInterval(fetchEvents, 6 * 60 * 60 * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <EventsContext.Provider value={{ events, loading, error }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => useContext(EventsContext);
