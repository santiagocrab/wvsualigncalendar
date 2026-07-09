import { Link } from 'react-router-dom';
import { Calendar, AlertTriangle, TrendingUp, Clock, Heart, Building2 } from 'lucide-react';
import { useMemo } from 'react';
import { useEvents } from '../context/EventsContext';
import { CategoryLegend } from '../components/CategoryLegend';
import { NoticeBanner } from '../components/Toast';
import { EventListCard } from '../components/EventCard';
import { format, parseISO, addDays } from 'date-fns';
import { CATEGORY_META } from '../data/categories';
import type { EventCategory } from '../types/event';

export default function DashboardPage() {
  const { events, conflicts, organizations } = useEvents();
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const weekEnd = format(addDays(today, 7), 'yyyy-MM-dd');

  const stats = useMemo(() => ({
    total: events.length,
    needsApproval: events.filter((e) => ['Proposed', 'Pending Approval'].includes(e.status)).length,
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

  const cards = [
    { label: 'Total Events', value: stats.total, icon: Calendar, color: 'bg-usc-black/90', iconColor: 'text-white' },
    { label: 'Organizations', value: organizations.length, icon: Building2, color: 'bg-usc-gold-wash', iconColor: 'text-usc-gold-dark' },
    { label: 'Conflicts', value: stats.conflictCount, icon: AlertTriangle, color: 'bg-usc-rose-wash', iconColor: 'text-usc-rose' },
    { label: 'Outreach Programs', value: stats.outreach, icon: Heart, color: 'bg-usc-plum-wash', iconColor: 'text-usc-plum' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-usc-black dark:text-white">USC Unified Calendar Dashboard</h1>
          <p className="text-usc-muted dark:text-white/50 text-sm mt-1 font-medium">
            {format(today, 'EEEE, MMMM d, yyyy')} · Academic Year 2026–2027 · Read-only
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/calendar" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-usc-black text-[#F5F3F0] text-sm font-semibold shadow-sm hover:bg-usc-charcoal transition">
            <Calendar size={16} /> View Calendar
          </Link>
          <Link to="/conflicts" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-usc-rose-wash text-usc-rose border border-usc-rose/20 text-sm font-semibold hover:bg-usc-rose/10 transition">
            <AlertTriangle size={16} /> Conflict Checker ({stats.highConflicts} high)
          </Link>
          <Link to="/organizations" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-usc-gold-wash text-usc-gold-dark border border-usc-gold/25 text-sm font-semibold hover:bg-usc-gold/10 transition">
            <Building2 size={16} /> Organizations ({organizations.length})
          </Link>
        </div>
      </div>

      <NoticeBanner />

      {/* USC brand hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-usc-surface to-usc-charcoal text-[#F0EDE8] p-6 lg:p-8 border border-usc-border/30 shadow-sm">
        <div className="usc-ray-bar absolute top-0 left-0 right-0" />
        <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
          <img src="/usc.jpg" alt="USC Seal" className="w-20 h-20 rounded-full object-cover usc-gold-ring shrink-0" />
          <div className="text-center sm:text-left">
            <p className="text-usc-gold-light text-xs font-semibold uppercase tracking-[0.25em]">West Visayas State University</p>
            <h2 className="font-display text-xl lg:text-2xl font-bold mt-1">University Student Council</h2>
            <p className="text-white/60 text-sm mt-2 max-w-xl">Official unified calendar for Academic Year 2026–2027 — all councils, organizations, and USC activities in one place.</p>
          </div>
        </div>
      </div>

      {/* Featured callouts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/conflicts" className="group block rounded-2xl p-6 bg-usc-rose-wash dark:bg-usc-rose/10 border border-usc-rose/20 shadow-sm hover:shadow-md hover:border-usc-rose/35 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-usc-rose/80 text-xs font-semibold uppercase tracking-widest">Featured Tool</p>
              <h2 className="text-xl font-bold text-usc-black dark:text-[#F0EDE8] mt-1">Conflict Checker</h2>
              <p className="text-usc-muted dark:text-white/55 text-sm mt-2 leading-relaxed">
                {stats.conflictCount} same-venue clashes — {stats.highConflicts} at high-traffic venues.
              </p>
            </div>
            <AlertTriangle size={36} className="text-usc-rose/70 group-hover:scale-105 transition" />
          </div>
        </Link>
        <Link to="/organizations" className="group block rounded-2xl p-6 bg-usc-gold-wash dark:bg-usc-gold/8 border border-usc-gold/25 shadow-sm hover:shadow-md hover:border-usc-gold/40 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-usc-gold-dark text-xs font-semibold uppercase tracking-widest">Featured Directory</p>
              <h2 className="text-xl font-bold text-usc-black dark:text-[#F0EDE8] mt-1">All Organizations</h2>
              <p className="text-usc-muted dark:text-white/55 text-sm mt-2 leading-relaxed">
                Browse {organizations.length} councils and student organizations with their scheduled activities.
              </p>
            </div>
            <Building2 size={36} className="text-usc-gold-dark group-hover:scale-105 transition" />
          </div>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, iconColor }) => (
          <div key={label} className="bg-white dark:bg-[#2A2724] rounded-2xl p-5 shadow-sm border border-usc-border dark:border-[#3D3935]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-usc-muted uppercase tracking-wide font-medium">{label}</p>
                <p className="text-3xl font-bold text-usc-black dark:text-[#F0EDE8] mt-1">{value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                <Icon size={22} className={iconColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#2A2724] rounded-2xl p-6 shadow-sm border border-usc-border dark:border-[#3D3935]">
          <h2 className="font-bold text-usc-black dark:text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-usc-gold" /> Category Summary
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {(Object.keys(CATEGORY_META) as EventCategory[]).map((cat) => {
              const count = events.filter((e) => e.category === cat).length;
              const m = CATEGORY_META[cat];
              return (
                <div
                  key={cat}
                  className="flex items-center gap-3 p-3 rounded-xl border border-usc-border dark:border-[#4A4541] bg-white dark:bg-[#332F2C]"
                >
                  <span className="w-3 h-8 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-usc-black dark:text-[#F0EDE8] leading-snug line-clamp-2">
                      {cat}
                    </p>
                    <p className="text-xl font-bold mt-0.5" style={{ color: m.countColor }}>
                      {count}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-[#2A2724] rounded-2xl p-6 shadow-sm border border-usc-border dark:border-[#3D3935]">
          <h2 className="font-bold text-usc-black dark:text-white">Busiest Dates</h2>
          <div className="mt-4 space-y-2">
            {byDate.map(([d, count]) => (
              <div key={d} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 font-medium">{format(parseISO(d), 'MMM d, yyyy')}</span>
                <span className="font-extrabold text-usc-black dark:text-white">{count} events</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-bold text-usc-black dark:text-white mb-3">Upcoming This Week</h2>
          <div className="space-y-3">
            {stats.thisWeek.slice(0, 5).map((e) => (
              <EventListCard key={e.id} event={e} onClick={() => {}} />
            ))}
            {stats.thisWeek.length === 0 && <p className="text-gray-500 text-sm font-medium">No events this week.</p>}
          </div>
        </div>
        <div>
          <h2 className="font-bold text-usc-black dark:text-white mb-3 flex items-center gap-2">
            <Clock size={16} /> Pending USC Review
          </h2>
          <div className="space-y-3">
            {events.filter((e) => e.status === 'Proposed' || e.status === 'Pending Approval').slice(0, 5).map((e) => (
              <EventListCard key={e.id} event={e} onClick={() => {}} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#2A2724] rounded-2xl p-5 shadow-sm border border-usc-border dark:border-[#3D3935]">
        <CategoryLegend />
      </div>
    </div>
  );
}
