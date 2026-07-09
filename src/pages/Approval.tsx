import { useState } from 'react';
import { useEvents } from '../context/EventsContext';
import { ApprovalBoard } from '../components/ApprovalBoard';
import { EventModal } from '../components/EventModal';
import type { CalendarEvent } from '../types/event';
import { NoticeBanner } from '../components/Toast';

export default function ApprovalPage() {
  const { events } = useEvents();
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const boardEvents = events.filter((e) => e.category !== 'National Holiday');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-usc-black dark:text-white">Approval Board</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 font-medium">
          Read-only view of event approval status across all organizations. Status reflects submitted calendar data.
        </p>
      </div>
      <NoticeBanner />
      <ApprovalBoard events={boardEvents} onEventClick={setSelected} />
      <EventModal event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
