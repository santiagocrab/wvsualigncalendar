import { Link } from 'react-router-dom';
import { Calendar, Building2, MapPin } from 'lucide-react';
import type { CalendarEvent } from '../types/event';

interface OrgStats {
  name: string;
  total: number;
  upcoming: CalendarEvent | null;
  outreach: number;
  proposed: number;
  conflictCount: number;
}

export function OrganizationCard({ org }: { org: OrgStats }) {
  return (
    <div className="bg-white dark:bg-[#2A2724] rounded-2xl p-5 shadow-sm border border-usc-border dark:border-[#3D3935] hover:shadow-md hover:border-usc-gold/30 transition">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-usc-gold-wash dark:bg-usc-gold/15 flex items-center justify-center shrink-0">
          <Building2 size={22} className="text-usc-gold-dark" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-usc-black dark:text-white text-sm leading-snug line-clamp-2">{org.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-semibold">
            {org.total > 0 ? `${org.total} events scheduled` : 'No events in calendar yet'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="text-center p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-100/80 dark:border-emerald-900/40">
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{org.proposed}</p>
          <p className="text-[10px] text-usc-muted font-medium">Proposed</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-usc-plum-wash dark:bg-usc-plum/10 border border-usc-plum/15">
          <p className="text-lg font-bold text-usc-plum">{org.outreach}</p>
          <p className="text-[10px] text-usc-muted font-medium">Outreach</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-usc-rose-wash dark:bg-usc-rose/10 border border-usc-rose/15">
          <p className="text-lg font-bold text-usc-rose">{org.conflictCount}</p>
          <p className="text-[10px] text-usc-muted font-medium">Conflicts</p>
        </div>
      </div>
      {org.upcoming && (
        <div className="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 text-xs border border-gray-100 dark:border-slate-700">
          <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wide text-[10px] font-bold">Next Event</p>
          <p className="font-bold mt-1 truncate text-gray-900 dark:text-white">{org.upcoming.title}</p>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-0.5 font-medium">
            <MapPin size={10} />{org.upcoming.location}
          </p>
        </div>
      )}
      <Link
        to={`/calendar?org=${encodeURIComponent(org.name)}`}
        className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-usc-black text-[#F5F3F0] text-sm font-semibold hover:bg-usc-charcoal transition"
      >
        <Calendar size={14} /> View Calendar
      </Link>
    </div>
  );
}

export function buildOrgStats(events: CalendarEvent[], conflicts: { event1: { id: string; organization: string }; event2?: { id: string } }[], orgs: string[]): OrgStats[] {
  const today = new Date().toISOString().slice(0, 10);
  const conflictEventIds = new Set(conflicts.flatMap((c) => [c.event1.id, c.event2?.id].filter(Boolean)));

  return orgs.map((name) => {
    const orgEvents = events.filter(
      (e) => e.organization === name || e.host === name
    );
    const upcoming = orgEvents
      .filter((e) => e.startDate >= today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))[0] ?? null;
    return {
      name,
      total: orgEvents.length,
      upcoming,
      outreach: orgEvents.filter((e) => e.category === 'Org/CSC Outreach Programs').length,
      proposed: orgEvents.filter((e) => e.status === 'Proposed').length,
      conflictCount: orgEvents.filter((e) => conflictEventIds.has(e.id)).length,
    };
  }).sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
}
