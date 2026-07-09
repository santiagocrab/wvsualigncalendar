import { MapPin, Clock, Users } from 'lucide-react';
import type { CalendarEvent } from '../types/event';
import { CATEGORY_META } from '../data/categories';
import { formatTimeRange, formatDate } from '../lib/utils';
import { CategoryBadge } from './CategoryLegend';

export function EventPill({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const meta = CATEGORY_META[event.category];
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="calendar-pill w-full text-left px-1.5 py-1 rounded-md text-[10px] truncate hover:brightness-110 transition shadow-sm"
      style={{ backgroundColor: meta.color, color: meta.textColor }}
      title={`${event.title} — ${event.host}`}
    >
      {event.title}
    </button>
  );
}

export function EventListCard({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-usc-black dark:text-white truncate text-base">{event.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Hosted by: <span className="font-semibold text-gray-800 dark:text-gray-200">{event.host}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{formatDate(event.startDate)}</p>
        </div>
        <CategoryBadge category={event.category} />
      </div>
      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600 dark:text-gray-400 font-medium">
        <span className="flex items-center gap-1"><MapPin size={12} className="text-gray-500" />{event.location}</span>
        <span className="flex items-center gap-1"><Users size={12} className="text-gray-500" />{event.targetParticipants}</span>
        {event.startTime && (
          <span className="flex items-center gap-1"><Clock size={12} className="text-gray-500" />{formatTimeRange(event.startTime, event.endTime)}</span>
        )}
      </div>
    </div>
  );
}
