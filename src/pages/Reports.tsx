import { useMemo } from 'react';
import { Download, Printer } from 'lucide-react';
import { useEvents } from '../context/EventsContext';
import { CATEGORY_META } from '../data/categories';
import type { EventCategory } from '../types/event';
import { format, parseISO } from 'date-fns';

export default function ReportsPage() {
  const { events, conflicts } = useEvents();

  const byMonth = useMemo(() => {
    const m: Record<string, number> = {};
    events.forEach((e) => {
      const key = format(parseISO(e.startDate), 'MMM yyyy');
      m[key] = (m[key] || 0) + 1;
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [events]);

  const byOrg = useMemo(() => {
    const m: Record<string, number> = {};
    events.forEach((e) => { m[e.organization] = (m[e.organization] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [events]);

  const byVenue = useMemo(() => {
    const m: Record<string, number> = {};
    events.forEach((e) => { if (e.location !== 'TBA') m[e.location] = (m[e.location] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [events]);

  const maxMonth = byMonth[0]?.[1] ?? 1;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-usc-black dark:text-white">Analytics & Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 font-medium">University-wide event distribution and scheduling insights.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800">
            <Printer size={16} /> Print
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-usc-black text-white text-sm font-bold">
            <Download size={16} /> Export (Print)
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold">Busiest Month</p>
          <p className="text-xl font-extrabold text-usc-black dark:text-white mt-1">{byMonth[0]?.[0] ?? 'N/A'}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{byMonth[0]?.[1]} events</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold">Needs Approval</p>
          <p className="text-xl font-extrabold text-emerald-600 mt-1">{events.filter((e) => e.status === 'Proposed').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold">Total Conflicts</p>
          <p className="text-xl font-extrabold text-red-600 mt-1">{conflicts.length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h2 className="font-bold text-usc-black dark:text-white mb-4">Events per Month</h2>
          {byMonth.map(([month, count]) => (
            <div key={month} className="flex items-center gap-3 mb-2">
              <span className="text-xs w-20 text-gray-700 dark:text-gray-300 font-semibold">{month}</span>
              <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                <div className="h-full bg-usc-gold rounded-full transition-all" style={{ width: `${(count / maxMonth) * 100}%` }} />
              </div>
              <span className="text-xs font-extrabold w-6 text-right text-gray-900 dark:text-white">{count}</span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h2 className="font-bold text-usc-black dark:text-white mb-4">Events per Category</h2>
          {(Object.keys(CATEGORY_META) as EventCategory[]).map((cat) => {
            const count = events.filter((e) => e.category === cat).length;
            return (
              <div key={cat} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 text-sm">
                <span className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-medium">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_META[cat].color }} />
                  {cat}
                </span>
                <span className="font-extrabold text-gray-900 dark:text-white">{count}</span>
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h2 className="font-bold text-usc-black dark:text-white mb-4">Top Organizations</h2>
          {byOrg.map(([org, count]) => (
            <div key={org} className="flex justify-between py-2 text-sm border-b border-gray-100 dark:border-slate-800">
              <span className="truncate text-gray-800 dark:text-gray-200 font-medium">{org}</span>
              <span className="font-extrabold ml-2 text-gray-900 dark:text-white">{count}</span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h2 className="font-bold text-usc-black dark:text-white mb-4">Busiest Venues</h2>
          {byVenue.map(([venue, count]) => (
            <div key={venue} className="flex justify-between py-2 text-sm border-b border-gray-100 dark:border-slate-800">
              <span className="truncate text-gray-800 dark:text-gray-200 font-medium">{venue}</span>
              <span className="font-extrabold ml-2 text-gray-900 dark:text-white">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
