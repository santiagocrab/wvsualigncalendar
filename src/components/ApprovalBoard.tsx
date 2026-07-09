import type { CalendarEvent, EventStatus } from '../types/event';
import { CategoryBadge } from './CategoryLegend';
import { formatDateShort } from '../lib/utils';
import { MapPin } from 'lucide-react';

const COLUMNS: { status: EventStatus; label: string; color: string }[] = [
  { status: 'Proposed', label: 'Proposed', color: 'border-t-emerald-500' },
  { status: 'Pending Approval', label: 'Pending Review', color: 'border-t-yellow-500' },
  { status: 'Needs Revision', label: 'Needs Revision', color: 'border-t-orange-500' },
  { status: 'Approved', label: 'Approved', color: 'border-t-green-600' },
  { status: 'Cancelled', label: 'Cancelled', color: 'border-t-gray-400' },
];

interface Props {
  events: CalendarEvent[];
  onEventClick: (e: CalendarEvent) => void;
}

export function ApprovalBoard({ events, onEventClick }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map(({ status, label, color }) => {
        const colEvents = events.filter((e) => e.status === status);
        return (
          <div key={status} className={`min-w-[260px] flex-1 bg-gray-100 dark:bg-slate-800/50 rounded-2xl border-t-4 ${color}`}>
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-sm text-usc-black dark:text-white">{label}</h3>
              <span className="text-xs font-extrabold bg-white dark:bg-slate-900 text-usc-black dark:text-white px-2.5 py-0.5 rounded-full shadow-sm">
                {colEvents.length}
              </span>
            </div>
            <div className="p-3 space-y-2 min-h-[200px] max-h-[500px] overflow-y-auto">
              {colEvents.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-8 font-medium">No events</p>
              )}
              {colEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => onEventClick(ev)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onEventClick(ev)}
                  className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition"
                >
                  <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{ev.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 font-medium">{ev.host}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-semibold">{formatDateShort(ev.startDate)}</p>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-600 dark:text-gray-400 font-medium">
                    <MapPin size={10} />{ev.location}
                  </div>
                  <div className="mt-2"><CategoryBadge category={ev.category} small /></div>
                  {ev.remarks && <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 truncate">{ev.remarks}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
