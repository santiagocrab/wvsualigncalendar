import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarEvent } from '../types/event';
import {
  cn, getMonthDays, getWeekDays, getEventsForDay, isToday, format,
} from '../lib/utils';
import { EventPill } from './EventCard';
import { useEvents } from '../context/EventsContext';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Props {
  view: 'month' | 'week';
  currentDate: Date;
  onDateChange: (d: Date) => void;
  onEventClick: (e: CalendarEvent) => void;
  onDayClick: (day: Date, dayEvents: CalendarEvent[]) => void;
  events: CalendarEvent[];
  conflictDates: Set<string>;
}

export function CalendarGrid({ view, currentDate, onDateChange, onEventClick, onDayClick, events, conflictDates }: Props) {
  const { compactView } = useEvents();
  const days = useMemo(
    () => view === 'month'
      ? getMonthDays(currentDate.getFullYear(), currentDate.getMonth())
      : getWeekDays(currentDate),
    [view, currentDate]
  );

  const goPrev = () => {
    if (view === 'month') {
      onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      onDateChange(new Date(currentDate.getTime() - 7 * 86400000));
    }
  };

  const goNext = () => {
    if (view === 'month') {
      onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      onDateChange(new Date(currentDate.getTime() + 7 * 86400000));
    }
  };

  const cellMinH = compactView ? 'min-h-[88px]' : 'min-h-[120px]';
  const maxShow = compactView ? 2 : 4;

  return (
    <div className="usc-card overflow-hidden dark:bg-[#252220]">
      <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-usc-border dark:border-[#3D3935] bg-usc-warm dark:bg-[#2A2724]/50">
        <h2 className="text-xl font-extrabold text-usc-black dark:text-[#F5F0E8]">
          {view === 'month'
            ? format(currentDate, 'MMMM yyyy')
            : `Week of ${format(days[0], 'MMM d, yyyy')}`}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDateChange(new Date(2026, 7, 1))}
            className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-usc-border dark:border-[#3D3935] text-usc-ink dark:text-[#E8E4DF] hover:bg-white dark:hover:bg-[#2A2724]"
          >
            AY Start
          </button>
          <button onClick={goPrev} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200" aria-label="Previous">
            <ChevronLeft size={20} />
          </button>
          <button onClick={goNext} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200" aria-label="Next">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-usc-border dark:border-[#3D3935]">
        {DAY_NAMES.map((d, i) => (
          <div key={d} className={cn(
            'py-2.5 text-center text-xs font-semibold uppercase tracking-wider',
            i === 0 || i === 6
              ? 'text-usc-rose/80 bg-usc-rose-wash/50 dark:bg-usc-rose/8 dark:text-usc-rose/70'
              : 'text-usc-muted dark:text-white/60 bg-usc-warm dark:bg-[#2A2724]'
          )}>
            {d}
          </div>
        ))}
      </div>

      <div className={cn('grid grid-cols-7', view === 'week' && 'min-h-[420px]')}>
        {days.map((day) => {
          const dayEvents = getEventsForDay(events, day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const dayStr = format(day, 'yyyy-MM-dd');
          const hasConflict = conflictDates.has(dayStr);
          const isHoliday = dayEvents.some((e) => e.category === 'National Holiday');

          return (
            <div
              key={dayStr}
              role="button"
              tabIndex={0}
              onClick={() => onDayClick(day, dayEvents)}
              onKeyDown={(e) => e.key === 'Enter' && onDayClick(day, dayEvents)}
              className={cn(
                'border-b border-r border-usc-border dark:border-[#3D3935] p-2 transition cursor-pointer hover:bg-usc-gold-wash/40 dark:hover:bg-[#332F2C]/60',
                cellMinH,
                !isCurrentMonth && view === 'month' && 'opacity-45 bg-usc-warm/50 dark:bg-[#1F1D1B]/50',
                isToday(day) && 'ring-2 ring-inset ring-usc-gold/50',
                isHoliday && 'bg-usc-rose-wash/40 dark:bg-usc-rose/8',
                hasConflict && 'bg-orange-50/50 dark:bg-orange-950/15'
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={cn(
                  'text-sm font-extrabold w-8 h-8 flex items-center justify-center rounded-full',
                  isToday(day) ? 'bg-usc-gold text-white' : 'text-usc-ink dark:text-[#E8E4DF]'
                )}>
                  {format(day, 'd')}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-slate-700 px-1.5 rounded-full">
                    {dayEvents.length}
                  </span>
                )}
              </div>
              <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                {dayEvents.slice(0, maxShow).map((ev) => (
                  <EventPill key={ev.id} event={ev} onClick={() => onEventClick(ev)} />
                ))}
                {dayEvents.length > maxShow && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDayClick(day, dayEvents); }}
                    className="text-[10px] font-bold text-usc-black dark:text-usc-gold pl-0.5 hover:underline"
                  >
                    +{dayEvents.length - maxShow} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
