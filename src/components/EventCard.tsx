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
      className="calendar-pill w-full text-left px-2 py-1 text-[10px] truncate hover:opacity-90 transition"
      style={{ backgroundColor: meta.color, color: meta.textColor }}
      title={`${event.title} — ${event.host}`}
    >
      {event.title}
    </button>
  );
}

export function EventListCard({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const meta = CATEGORY_META[event.category];
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="usc-card p-4 hover:border-usc-gold/50 hover:shadow-md transition cursor-pointer dark:bg-[#252220] overflow-hidden"
    >
      <div className="flex gap-3">
        <div className="w-1 rounded-full shrink-0 self-stretch min-h-[3rem]" style={{ backgroundColor: meta.color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-usc-black dark:text-[#F5F0E8] text-sm leading-snug line-clamp-2">{event.title}</h3>
              <p className="text-xs text-usc-muted dark:text-white/50 mt-1">
                {event.host} · {formatDate(event.startDate)}
              </p>
            </div>
            <CategoryBadge category={event.category} small />
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5 text-[11px] text-usc-muted dark:text-white/45 font-medium">
            <span className="flex items-center gap-1"><MapPin size={11} />{event.location}</span>
            {event.startTime && (
              <span className="flex items-center gap-1"><Clock size={11} />{formatTimeRange(event.startTime, event.endTime)}</span>
            )}
            <span className="flex items-center gap-1"><Users size={11} />{event.targetParticipants}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
