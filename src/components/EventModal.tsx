import { useState } from 'react';
import { X, MapPin, Clock, Users, User, FileText, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import type { CalendarEvent } from '../types/event';
import { CategoryBadge, StatusBadge, ModalityBadge } from './CategoryLegend';
import { formatDate, formatTimeRange, copyEventDetails } from '../lib/utils';
import { useEvents } from '../context/EventsContext';
import { getConflictsForEvent } from '../lib/conflicts';

interface Props {
  event: CalendarEvent | null;
  onClose: () => void;
}

export function EventModal({ event, onClose }: Props) {
  const { conflicts } = useEvents();
  const [copied, setCopied] = useState(false);
  if (!event) return null;

  const eventConflicts = getConflictsForEvent(conflicts, event.id);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyEventDetails(event));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const labelClass = 'text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-bold';
  const valueClass = 'font-semibold mt-1 text-gray-900 dark:text-gray-100';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#2A2724] rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-usc-border dark:border-[#3D3935]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-usc-gold-wash dark:bg-usc-gold/15 text-usc-black dark:text-[#F5F0E8] p-6 rounded-t-2xl relative border-b border-usc-gold/20">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10" aria-label="Close">
            <X size={20} />
          </button>
          <div className="flex gap-2 mb-3 flex-wrap">
            <CategoryBadge category={event.category} />
            <StatusBadge status={event.status} />
            <ModalityBadge event={event} small />
          </div>
          <h2 className="text-xl font-extrabold pr-8 leading-snug">{event.title}</h2>
          <p className="text-usc-gold-dark dark:text-usc-gold text-sm mt-2 font-medium">Hosted by: {event.host}</p>
        </div>

        <div className="p-6 space-y-4">
          {eventConflicts.length > 0 && (
            <div className="bg-usc-rose-wash dark:bg-usc-rose/10 border border-usc-rose/25 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="text-usc-rose shrink-0" size={22} />
              <div>
                <p className="font-semibold text-usc-rose text-sm">Scheduling Conflict Detected</p>
                <p className="text-sm text-usc-muted dark:text-white/60 mt-1">{eventConflicts[0].recommendation}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className={labelClass}>Date</p>
              <p className={valueClass}>
                {formatDate(event.startDate)}
                {event.endDate !== event.startDate ? ` – ${formatDate(event.endDate)}` : ''}
              </p>
            </div>
            <div>
              <p className={labelClass}>Time</p>
              <p className={`${valueClass} flex items-center gap-1`}>
                <Clock size={14} />{formatTimeRange(event.startTime, event.endTime)}
              </p>
            </div>
            <div className="col-span-2">
              <p className={labelClass}>Venue / Location</p>
              <p className={`${valueClass} flex items-center gap-1`}>
                <MapPin size={14} />{event.location}
              </p>
              {event.mapLink && (
                <a href={event.mapLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 mt-1 font-semibold hover:underline">
                  <ExternalLink size={12} /> View Map
                </a>
              )}
            </div>
            <div>
              <p className={labelClass}>Organization</p>
              <p className={valueClass}>{event.organization}</p>
            </div>
            <div>
              <p className={labelClass}>Event Type</p>
              <p className={valueClass}>{event.eventType}</p>
            </div>
            <div className="col-span-2">
              <p className={labelClass}>Target Participants</p>
              <p className={`${valueClass} flex items-center gap-1`}>
                <Users size={14} />{event.targetParticipants}
              </p>
            </div>
            {event.contactPerson && (
              <div className="col-span-2">
                <p className={labelClass}>Contact Person</p>
                <p className={`${valueClass} flex items-center gap-1`}>
                  <User size={14} />{event.contactPerson}
                </p>
              </div>
            )}
          </div>

          <div>
            <p className={labelClass}>Description</p>
            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 leading-relaxed">{event.description}</p>
          </div>

          {event.remarks && (
            <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-xl p-3 text-sm text-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800">
              <p className="font-bold text-xs uppercase">Remarks</p>
              <p className="mt-1">{event.remarks}</p>
            </div>
          )}

          {event.sourceFile && (
            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 font-medium">
              <FileText size={12} />Source: {event.sourceFile}
            </p>
          )}

          <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-usc-gold text-usc-black text-sm font-bold hover:bg-usc-gold-dark hover:text-white transition"
            >
              <Copy size={14} /> {copied ? 'Copied!' : 'Copy Details'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
