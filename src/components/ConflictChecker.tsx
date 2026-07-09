import { AlertTriangle } from 'lucide-react';
import type { EventConflict } from '../types/event';
import { formatDate } from '../lib/utils';
import { CategoryBadge } from './CategoryLegend';

const SEV_STYLES = {
  High: 'border-usc-rose/30 bg-usc-rose-wash dark:bg-usc-rose/8',
  Medium: 'border-usc-coral/30 bg-orange-50/80 dark:bg-orange-950/20',
  Low: 'border-usc-gold/25 bg-usc-gold-wash dark:bg-usc-gold/8',
};

const SEV_BADGE = {
  High: 'bg-usc-rose/15 text-usc-rose',
  Medium: 'bg-usc-coral/15 text-usc-coral',
  Low: 'bg-usc-gold-wash text-usc-gold-dark',
};

const SEV_ICON = {
  High: 'text-usc-rose',
  Medium: 'text-usc-coral',
  Low: 'text-usc-gold-dark',
};

export function ConflictCard({ conflict }: { conflict: EventConflict }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${SEV_STYLES[conflict.severity]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className={SEV_ICON[conflict.severity]} />
          <div>
            <p className="font-bold text-sm text-usc-black dark:text-[#F0EDE8]">{conflict.type}</p>
            <p className="text-xs text-usc-muted dark:text-white/50 font-medium">{formatDate(conflict.date)}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${SEV_BADGE[conflict.severity]}`}>
          {conflict.severity}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <div className="bg-white dark:bg-[#2A2724] rounded-xl p-3 border border-usc-border dark:border-[#3D3935]">
          <p className="text-sm font-semibold text-usc-black dark:text-[#F0EDE8]">{conflict.event1.title}</p>
          <p className="text-xs text-usc-muted dark:text-white/50 mt-0.5 font-medium">Hosted by: {conflict.event1.host}</p>
          <CategoryBadge category={conflict.event1.category} small />
        </div>
        {conflict.event2 && (
          <div className="bg-white dark:bg-[#2A2724] rounded-xl p-3 border border-usc-border dark:border-[#3D3935]">
            <p className="text-sm font-semibold text-usc-black dark:text-[#F0EDE8]">{conflict.event2.title}</p>
            <p className="text-xs text-usc-muted dark:text-white/50 mt-0.5 font-medium">Hosted by: {conflict.event2.host}</p>
          </div>
        )}
      </div>
      <p className="text-sm text-usc-ink dark:text-[#E8E4DF] mt-3 font-medium">
        <span className="font-semibold">Venue:</span> {conflict.venue}
      </p>
      <p className="text-sm text-usc-muted dark:text-white/60 mt-2 leading-relaxed">
        {conflict.recommendation}
      </p>
    </div>
  );
}
