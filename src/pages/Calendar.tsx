import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { List, LayoutGrid, Columns, MapPin, Monitor } from 'lucide-react';
import { useEvents, AY_MONTHS } from '../context/EventsContext';
import { CalendarGrid } from '../components/CalendarGrid';
import { DayEventsModal } from '../components/DayEventsModal';
import { EventModal } from '../components/EventModal';
import { EventListCard } from '../components/EventCard';
import { CategoryLegend } from '../components/CategoryLegend';
import { NoticeBanner } from '../components/Toast';
import type { CalendarEvent, CalendarView, ModalityFilter } from '../types/event';
import { cn, format } from '../lib/utils';
import { CATEGORIES } from '../data/categories';
import { getEventModality, matchesModalityFilter } from '../lib/venue';

const VIEWS: { id: CalendarView; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'month', label: 'Month', icon: LayoutGrid },
  { id: 'week', label: 'Week', icon: Columns },
  { id: 'list', label: 'List', icon: List },
];

const MODALITY_FILTERS: { id: ModalityFilter; label: string; icon: typeof MapPin }[] = [
  { id: 'all', label: 'All activities', icon: List },
  { id: 'face-to-face', label: 'Face-to-face', icon: MapPin },
  { id: 'online', label: 'Online', icon: Monitor },
];

const LIST_SECTIONS: {
  key: string;
  title: string;
  description: string;
  match: (event: CalendarEvent) => boolean;
}[] = [
  {
    key: 'face-to-face',
    title: 'Face-to-face activities',
    description: 'On-campus and physical venues',
    match: (e) => getEventModality(e) === 'face-to-face',
  },
  {
    key: 'online',
    title: 'Online activities',
    description: 'Virtual, Zoom, Google Meet, and similar',
    match: (e) => getEventModality(e) === 'online',
  },
  {
    key: 'hybrid',
    title: 'Hybrid activities',
    description: 'Can run on-campus or online (e.g. WVSU or Online)',
    match: (e) => getEventModality(e) === 'hybrid',
  },
];

export default function CalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    filteredEvents, events, conflicts, categoryFilter, setCategoryFilter,
    orgFilter, setOrgFilter, venueFilter, setVenueFilter,
    modalityFilter, setModalityFilter,
    organizations, venues, compactView, toggleCompactView,
    calendarView, setCalendarView, calendarDate, setCalendarDate,
  } = useEvents();

  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [dayModal, setDayModal] = useState<{ date: Date; events: CalendarEvent[] } | null>(null);

  const orgParam = searchParams.get('org');
  useEffect(() => {
    if (orgParam) setOrgFilter(orgParam);
  }, [orgParam, setOrgFilter]);

  const viewParam = searchParams.get('view') as CalendarView | null;
  useEffect(() => {
    if (viewParam && ['month', 'week', 'list'].includes(viewParam)) {
      setCalendarView(viewParam);
    }
  }, [viewParam, setCalendarView]);

  const handleViewChange = (v: CalendarView) => {
    setCalendarView(v);
    const next = new URLSearchParams(searchParams);
    next.set('view', v);
    setSearchParams(next, { replace: true });
  };

  const conflictDates = useMemo(
    () => new Set(conflicts.map((c) => c.date)),
    [conflicts]
  );

  const sorted = useMemo(
    () => [...filteredEvents].sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [filteredEvents]
  );

  const modalityCounts = useMemo(() => {
    const base = events.filter((e) => {
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      if (orgFilter !== 'all' && e.organization !== orgFilter && e.host !== orgFilter) return false;
      if (venueFilter !== 'all' && e.location !== venueFilter) return false;
      return true;
    });
    return {
      all: base.length,
      'face-to-face': base.filter((e) => matchesModalityFilter(e, 'face-to-face')).length,
      online: base.filter((e) => matchesModalityFilter(e, 'online')).length,
    };
  }, [events, categoryFilter, orgFilter, venueFilter]);

  const listSections = useMemo(() => {
    if (modalityFilter !== 'all') {
      return [{ key: modalityFilter, title: '', description: '', items: sorted }];
    }
    const sections = LIST_SECTIONS.map((section) => ({
      key: section.key,
      title: section.title,
      description: section.description,
      items: sorted.filter(section.match),
    })).filter((section) => section.items.length > 0);

    const venueTba = sorted.filter((e) => getEventModality(e) === 'undetermined');
    if (venueTba.length > 0) {
      sections.push({
        key: 'undetermined',
        title: 'Venue not yet confirmed',
        description: 'Activities with TBA/TBD locations',
        items: venueTba,
      });
    }
    return sections;
  }, [modalityFilter, sorted]);

  const selectClass = 'px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-slate-800';

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-usc-black dark:text-white">Unified Calendar</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 font-medium">
          Academic Year 2026–2027 · Filter face-to-face vs online below
        </p>
      </div>

      <NoticeBanner />

      {/* View toggle — prominent */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-gray-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex rounded-xl border-2 border-usc-black dark:border-usc-gold overflow-hidden shadow-sm">
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleViewChange(id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition',
                  calendarView === id
                    ? 'bg-usc-black text-white'
                    : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
                )}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {filteredEvents.length} events shown
          </span>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400 mr-1">Format:</span>
          {MODALITY_FILTERS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setModalityFilter(id)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition border',
                modalityFilter === id
                  ? 'bg-usc-gold text-usc-black border-usc-gold shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:border-usc-gold/50',
              )}
            >
              <Icon size={15} />
              {label}
              <span className={cn(
                'text-[11px] font-extrabold px-1.5 py-0.5 rounded-full',
                modalityFilter === id ? 'bg-usc-black/10' : 'bg-gray-100 dark:bg-slate-700',
              )}>
                {modalityCounts[id]}
              </span>
            </button>
          ))}
        </div>

        {/* AY month quick jump */}
        {calendarView !== 'list' && (
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 self-center mr-1">Jump to:</span>
            {AY_MONTHS.map((m) => {
              const active = m.getMonth() === calendarDate.getMonth() && m.getFullYear() === calendarDate.getFullYear();
              return (
                <button
                  key={m.toISOString()}
                  onClick={() => setCalendarDate(m)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-bold transition',
                    active
                      ? 'bg-usc-gold text-usc-black shadow'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  )}
                >
                  {format(m, 'MMM yy')}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap gap-3 items-center pt-1 border-t border-gray-100 dark:border-slate-800">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={selectClass}>
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={orgFilter} onChange={(e) => setOrgFilter(e.target.value)} className={selectClass}>
            <option value="all">All Organizations</option>
            {organizations.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={venueFilter} onChange={(e) => setVenueFilter(e.target.value)} className={selectClass}>
            <option value="all">All Venues</option>
            {venues.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          <button
            onClick={toggleCompactView}
            className="px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
          >
            {compactView ? 'Spacious' : 'Compact'} cells
          </button>
        </div>
      </div>

      <CategoryLegend compact />

      {calendarView === 'list' ? (
        <div className="space-y-8">
          {listSections.map((section) => (
            <div key={section.key} className="space-y-3">
              {modalityFilter === 'all' && (
                <div className="px-1">
                  <h2 className="text-lg font-bold text-usc-black dark:text-white">{section.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
                </div>
              )}
              {section.items.map((e) => <EventListCard key={e.id} event={e} onClick={() => setSelected(e)} />)}
            </div>
          ))}
          {sorted.length === 0 && (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              <p className="text-lg font-semibold">No events found</p>
              <p className="text-sm mt-1">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      ) : (
        <CalendarGrid
          view={calendarView}
          currentDate={calendarDate}
          onDateChange={setCalendarDate}
          onEventClick={setSelected}
          onDayClick={(day, dayEvents) => setDayModal({ date: day, events: dayEvents })}
          events={filteredEvents}
          conflictDates={conflictDates}
        />
      )}

      <DayEventsModal
        date={dayModal?.date ?? null}
        events={dayModal?.events ?? []}
        onClose={() => setDayModal(null)}
        onEventClick={setSelected}
      />
      <EventModal event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
