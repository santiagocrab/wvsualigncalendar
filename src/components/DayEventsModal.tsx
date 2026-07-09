import { X, Calendar as CalIcon } from 'lucide-react';
import type { CalendarEvent } from '../types/event';
import { CategoryBadge, ModalityBadge } from './CategoryLegend';
import { format, formatTimeRange } from '../lib/utils';
import { MapPin, Clock } from 'lucide-react';

interface Props {
  date: Date | null;
  events: CalendarEvent[];
  onClose: () => void;
  onEventClick: (e: CalendarEvent) => void;
}

export function DayEventsModal({ date, events, onClose, onEventClick }: Props) {
  if (!date) return null;

  const sorted = [...events].sort((a, b) => {
    const ta = a.startTime || '00:00';
    const tb = b.startTime || '00:00';
    return ta.localeCompare(tb) || a.title.localeCompare(b.title);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#2A2724] rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col border border-usc-border dark:border-[#3D3935]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-usc-gold-wash dark:bg-usc-gold/15 text-usc-black dark:text-[#F5F0E8] px-6 py-4 rounded-t-2xl flex items-center justify-between shrink-0 border-b border-usc-gold/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-usc-gold flex items-center justify-center">
              <CalIcon size={20} className="text-usc-black" />
            </div>
            <div>
              <p className="text-xs font-semibold text-usc-gold-dark dark:text-usc-gold">Events on</p>
              <h2 className="text-lg font-bold">{format(date, 'EEEE, MMMM d, yyyy')}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          {sorted.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12 font-medium">No events on this date.</p>
          ) : (
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-3">
              {sorted.length} event{sorted.length !== 1 ? 's' : ''} — tap for details
            </p>
          )}
          <div className="space-y-2">
            {sorted.map((ev) => (
              <button
                key={ev.id}
                onClick={() => { onEventClick(ev); onClose(); }}
                className="w-full text-left rounded-xl p-4 border border-usc-border dark:border-[#3D3935] hover:border-usc-gold/40 hover:shadow-sm transition bg-usc-warm dark:bg-[#332F2C]/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-usc-black dark:text-white text-sm leading-snug">{ev.title}</p>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <CategoryBadge category={ev.category} small />
                    <ModalityBadge event={ev} small />
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-semibold">
                  Hosted by: <span className="text-gray-800 dark:text-gray-200">{ev.host}</span>
                </p>
                <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-gray-600 dark:text-gray-400 font-medium">
                  {ev.location && ev.location !== 'TBA' && (
                    <span className="flex items-center gap-1"><MapPin size={11} />{ev.location}</span>
                  )}
                  {ev.startTime && (
                    <span className="flex items-center gap-1"><Clock size={11} />{formatTimeRange(ev.startTime, ev.endTime)}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-usc-border dark:border-[#3D3935] shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-usc-gold text-usc-black text-sm font-bold hover:bg-usc-gold-dark hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
