import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import rawEvents from '../data/events.json';
import officialOrgs from '../data/official_organizations.json';
import type { CalendarEvent, CalendarView, ModalityFilter } from '../types/event';
import { detectConflicts } from '../lib/conflicts';
import { matchesModalityFilter } from '../lib/venue';

interface EventsContextValue {
  events: CalendarEvent[];
  conflicts: ReturnType<typeof detectConflicts>;
  darkMode: boolean;
  compactView: boolean;
  search: string;
  setSearch: (s: string) => void;
  categoryFilter: string;
  setCategoryFilter: (s: string) => void;
  orgFilter: string;
  setOrgFilter: (s: string) => void;
  venueFilter: string;
  setVenueFilter: (s: string) => void;
  modalityFilter: ModalityFilter;
  setModalityFilter: (s: ModalityFilter) => void;
  calendarView: CalendarView;
  setCalendarView: (v: CalendarView) => void;
  calendarDate: Date;
  setCalendarDate: (d: Date) => void;
  toggleDarkMode: () => void;
  toggleCompactView: () => void;
  filteredEvents: CalendarEvent[];
  organizations: string[];
  venues: string[];
  readonly: true;
}

const EventsContext = createContext<EventsContextValue | null>(null);

const AY_MONTHS = [
  new Date(2026, 6, 1), new Date(2026, 7, 1), new Date(2026, 8, 1),
  new Date(2026, 9, 1), new Date(2026, 10, 1), new Date(2026, 11, 1),
  new Date(2027, 0, 1), new Date(2027, 1, 1), new Date(2027, 2, 1),
  new Date(2027, 3, 1), new Date(2027, 4, 1), new Date(2027, 5, 1),
];

export { AY_MONTHS };

export function EventsProvider({ children }: { children: ReactNode }) {
  const events = rawEvents as CalendarEvent[];
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [orgFilter, setOrgFilter] = useState('all');
  const [venueFilter, setVenueFilter] = useState('all');
  const [modalityFilter, setModalityFilter] = useState<ModalityFilter>('all');
  const [calendarView, setCalendarView] = useState<CalendarView>('month');
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 7, 1));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const filteredEvents = useMemo(() => {
    const q = search.toLowerCase();
    return events.filter((e) => {
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      if (orgFilter !== 'all' && e.organization !== orgFilter && e.host !== orgFilter) return false;
      if (venueFilter !== 'all' && e.location !== venueFilter) return false;
      if (!matchesModalityFilter(e, modalityFilter)) return false;
      if (!q) return true;
      return [e.title, e.organization, e.host, e.location, e.description, e.category]
        .join(' ').toLowerCase().includes(q);
    });
  }, [events, search, categoryFilter, orgFilter, venueFilter, modalityFilter]);

  const conflicts = useMemo(() => detectConflicts(events), [events]);

  const organizations = useMemo(
    () => officialOrgs.map((o) => o.name).sort((a, b) => a.localeCompare(b)),
    []
  );

  const venues = useMemo(
    () => [...new Set(events.map((e) => e.location).filter((v) => v && v !== 'TBA'))].sort(),
    [events]
  );

  const value: EventsContextValue = {
    events, conflicts, darkMode, compactView, search, setSearch,
    categoryFilter, setCategoryFilter, orgFilter, setOrgFilter,
    venueFilter, setVenueFilter, modalityFilter, setModalityFilter,
    calendarView, setCalendarView, calendarDate, setCalendarDate,
    toggleDarkMode: useCallback(() => setDarkMode((d) => !d), []),
    toggleCompactView: useCallback(() => setCompactView((c) => !c), []),
    filteredEvents, organizations, venues, readonly: true,
  };

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents must be used within EventsProvider');
  return ctx;
}
