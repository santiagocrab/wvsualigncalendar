import { Link } from 'react-router-dom';
import { Calendar, AlertTriangle, Building2, Sparkles, CalendarDays } from 'lucide-react';
import { useMemo } from 'react';
import { useEvents } from '../context/EventsContext';
import { CategoryLegend } from '../components/CategoryLegend';
import { NoticeBanner } from '../components/Toast';
import { EventListCard } from '../components/EventCard';
import { format, parseISO, addDays } from 'date-fns';
import { CATEGORY_META } from '../data/categories';
import type { EventCategory } from '../types/event';
import { cn } from '../lib/utils';

export default function DashboardPage() {
  const { events, conflicts, organizations } = useEvents();
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const weekEnd = format(addDays(today, 7), 'yyyy-MM-dd');

  const stats = useMemo(() => ({
    total: events.length,
    conflictCount: conflicts.length,
    highConflicts: conflicts.filter((c) => c.severity === 'High').length,
    outreach: events.filter((e) => e.category === 'Org/CSC Outreach Programs').length,
    thisWeek: events.filter((e) => e.startDate >= todayStr && e.startDate <= weekEnd),
  }), [events, conflicts, todayStr, weekEnd]);

  const byDate = useMemo(() => {
    const c: Record<string, number> = {};
    events.forEach((e) => { c[e.startDate] = (c[e.startDate] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [events]);

  const chips = [
    { label: 'Events', value: stats.total, bg: 'bg-usc-sky-wash dark:bg-usc-sky/15', border: 'border-usc-sky/25', text: 'text-usc-sky' },
    { label: 'Organizations', value: organizations.length, bg: 'bg-usc-gold-wash dark:bg-usc-gold/15', border: 'border-usc-gold/30', text: 'text-usc-gold-dark dark:text-usc-gold' },
    { label: 'Venue conflicts', value: stats.conflictCount, bg: 'bg-usc-coral-wash dark:bg-usc-coral/15', border: 'border-usc-coral/25', text: 'text-usc-coral' },
    { label: 'Outreach', value: stats.outreach, bg: 'bg-usc-lavender-wash dark:bg-usc-lavender/15', border: 'border-usc-lavender/25', text: 'text-usc-lavender' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome hero */}
      <section className="usc-card overflow-hidden dark:bg-[#252220]">
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-usc-gold-wash via-white to-usc-sky-wash dark:from-usc-gold/10 dark:via-[#252220] dark:to-usc-sky/10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img src="/usc.jpg" alt="USC" className="w-24 h-24 rounded-2xl object-cover usc-gold-ring shrink-0 rotate-[-2deg]" />
            <div className="text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 border border-usc-gold/30 text-xs font-semibold text-usc-gold-dark dark:text-usc-gold mb-3">
                <Sparkles size={12} /> Shared with all WVSU orgs
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-usc-black dark:text-[#F5F0E8] leading-tight">
                Hey orgs — here&apos;s everyone&apos;s calendar
              </h1>
              <p className="text-usc-muted dark:text-white/55 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
                {organizations.length} organizations · {stats.total} activities · AY 2026–2027.
                Find your events, check venue overlaps, and see what&apos;s coming up.
              </p>
              <div className="flex flex-wrap gap-2 mt-5 justify-center sm:justify-start">
                <Link to="/calendar" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-usc-gold text-usc-black text-sm font-bold hover:bg-usc-gold-dark hover:text-white transition shadow-sm">
                  <Calendar size={16} /> Open calendar
                </Link>
                <Link to="/organizations" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#2A2724] text-usc-ink dark:text-[#F2EDE6] text-sm font-bold border border-usc-border hover:border-usc-gold transition">
                  <Building2 size={16} /> Browse orgs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NoticeBanner />

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {chips.map(({ label, value, bg, border, text }) => (
          <div key={label} className={cn('usc-stat-chip border', bg, border)}>
            <p className={`text-2xl sm:text-3xl font-extrabold ${text}`}>{value}</p>
            <p className="text-xs font-semibold text-usc-muted dark:text-white/50 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/conflicts" className="usc-card p-5 hover:border-usc-coral/40 transition group dark:bg-[#252220]">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-usc-coral-wash dark:bg-usc-coral/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <AlertTriangle size={22} className="text-usc-coral" />
            </div>
            <div>
              <h2 className="font-bold text-usc-black dark:text-[#F5F0E8]">Venue conflict checker</h2>
              <p className="text-sm text-usc-muted dark:text-white/50 mt-1 leading-relaxed">
                {stats.conflictCount} cross-org overlaps found · {stats.highConflicts} at busy venues like COM Gym
              </p>
            </div>
          </div>
        </Link>
        <Link to="/calendar" className="usc-card p-5 hover:border-usc-gold/50 transition group dark:bg-[#252220]">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-usc-gold-wash dark:bg-usc-gold/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <CalendarDays size={22} className="text-usc-gold-dark dark:text-usc-gold" />
            </div>
            <div>
              <h2 className="font-bold text-usc-black dark:text-[#F5F0E8]">Month & week view</h2>
              <p className="text-sm text-usc-muted dark:text-white/50 mt-1 leading-relaxed">
                Tap any date to see all events that day. Jump between AY months in one click.
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 usc-card p-5 sm:p-6 dark:bg-[#252220]">
          <h2 className="font-bold text-usc-black dark:text-[#F5F0E8] text-lg">Events by category</h2>
          <p className="text-xs text-usc-muted dark:text-white/45 mt-0.5 mb-4">Color key for the calendar</p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {(Object.keys(CATEGORY_META) as EventCategory[]).map((cat) => {
              const count = events.filter((e) => e.category === cat).length;
              const m = CATEGORY_META[cat];
              return (
                <div
                  key={cat}
                  className="flex items-center gap-3 p-3 rounded-xl bg-usc-warm dark:bg-[#2A2724] border border-usc-border/80 dark:border-[#3D3833]"
                >
                  <span className="w-2.5 h-10 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-usc-black dark:text-[#F5F0E8] leading-snug">{cat}</p>
                    <p className="text-lg font-extrabold mt-0.5" style={{ color: m.countColor }}>{count}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="usc-card p-5 sm:p-6 dark:bg-[#252220]">
          <h2 className="font-bold text-usc-black dark:text-[#F5F0E8] text-lg">Busiest days</h2>
          <div className="mt-4 space-y-3">
            {byDate.map(([d, count], i) => (
              <div key={d} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-usc-gold-wash dark:bg-usc-gold/15 text-usc-gold-dark dark:text-usc-gold text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-usc-charcoal dark:text-white/70 flex-1">{format(parseISO(d), 'MMM d, yyyy')}</span>
                <span className="text-sm font-bold text-usc-black dark:text-[#F5F0E8]">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div>
          <h2 className="font-bold text-usc-black dark:text-[#F5F0E8] mb-3">This week</h2>
          <div className="space-y-2.5">
            {stats.thisWeek.slice(0, 5).map((e) => (
              <EventListCard key={e.id} event={e} onClick={() => {}} />
            ))}
            {stats.thisWeek.length === 0 && (
              <p className="text-usc-muted text-sm font-medium py-6 text-center usc-card dark:bg-[#252220]">Nothing scheduled this week yet.</p>
            )}
          </div>
        </div>
        <div>
          <h2 className="font-bold text-usc-black dark:text-[#F5F0E8] mb-3">Waiting on USC approval</h2>
          <div className="space-y-2.5">
            {events.filter((e) => e.status === 'Proposed' || e.status === 'Pending Approval').slice(0, 5).map((e) => (
              <EventListCard key={e.id} event={e} onClick={() => {}} />
            ))}
          </div>
        </div>
      </div>

      <div className="usc-card p-5 dark:bg-[#252220]">
        <CategoryLegend />
      </div>
    </div>
  );
}
