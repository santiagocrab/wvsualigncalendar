import { CATEGORY_META } from '../data/categories';
import type { EventCategory } from '../types/event';
import { cn } from '../lib/utils';

export function CategoryBadge({ category, small }: { category: EventCategory; small?: boolean }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={cn('inline-flex items-center rounded-full font-bold', small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs')}
      style={{ backgroundColor: meta.color, color: meta.textColor }}
    >
      {meta.short}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Approved: 'bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-300',
    'Pending Approval': 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-300',
    Proposed: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-300',
    'Needs Revision': 'bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-300',
    Cancelled: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };
  return (
    <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold', colors[status] || 'bg-gray-100 text-gray-800')}>
      {status}
    </span>
  );
}

export function CategoryLegend({ compact }: { compact?: boolean }) {
  return (
    <div className={cn('flex flex-wrap', compact ? 'gap-2' : 'gap-4')}>
      {(Object.keys(CATEGORY_META) as EventCategory[]).map((cat) => {
        const m = CATEGORY_META[cat];
        return (
          <div key={cat} className="flex items-center gap-2 text-sm font-semibold">
            <span className="w-4 h-4 rounded shrink-0 shadow-sm" style={{ backgroundColor: m.color }} />
            {!compact && <span className="text-usc-black dark:text-[#F0EDE8]">{cat}</span>}
            {compact && <span className="text-xs text-usc-black dark:text-[#F0EDE8]">{m.short}</span>}
          </div>
        );
      })}
    </div>
  );
}
