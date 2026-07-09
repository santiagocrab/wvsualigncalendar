import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventsContext';
import { ConflictCard } from '../components/ConflictChecker';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ConflictsPage() {
  const { conflicts } = useEvents();
  const [filter, setFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');

  const filtered = useMemo(
    () => filter === 'all' ? conflicts : conflicts.filter((c) => c.severity === filter),
    [conflicts, filter]
  );

  const counts = {
    High: conflicts.filter((c) => c.severity === 'High').length,
    Medium: conflicts.filter((c) => c.severity === 'Medium').length,
    Low: conflicts.filter((c) => c.severity === 'Low').length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="rounded-2xl bg-usc-rose-wash dark:bg-usc-rose/10 border border-usc-rose/20 p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-usc-rose/15 flex items-center justify-center shrink-0">
            <ShieldAlert size={28} className="text-usc-rose" />
          </div>
          <div>
            <p className="text-usc-rose/80 text-xs font-semibold uppercase tracking-widest">Featured · Scheduling Intelligence</p>
            <h1 className="text-3xl font-bold text-usc-black dark:text-[#F0EDE8] mt-1 flex items-center gap-2">
              Conflict Checker
            </h1>
            <p className="text-usc-muted dark:text-white/55 text-sm mt-2 max-w-xl leading-relaxed">
              Lists only cross-organization physical venue clashes — excludes online, TBA/TBD venues, and same-host bookings ({conflicts.length} flagged).
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <span className="px-3 py-1.5 rounded-full bg-usc-rose/15 text-usc-rose text-sm font-semibold">{counts.High} High</span>
              <span className="px-3 py-1.5 rounded-full bg-usc-coral/15 text-usc-coral text-sm font-semibold">{counts.Medium} Medium</span>
              <span className="px-3 py-1.5 rounded-full bg-usc-gold-wash text-usc-gold-dark text-sm font-semibold">{counts.Low} Low</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'High', 'Medium', 'Low'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
              filter === f
                ? 'bg-usc-black text-[#F5F3F0] shadow-sm'
                : 'bg-white dark:bg-[#2A2724] border border-usc-border dark:border-[#3D3935] text-usc-ink dark:text-[#E8E4DF] hover:bg-usc-warm dark:hover:bg-[#332F2C]'
            }`}
          >
            {f === 'all' ? `All (${conflicts.length})` : `${f} (${counts[f]})`}
          </button>
        ))}
        <Link to="/calendar" className="ml-auto px-4 py-2.5 rounded-xl text-sm font-bold text-usc-black dark:text-usc-gold border border-usc-gold hover:bg-amber-50 dark:hover:bg-amber-950/20">
          View Calendar →
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((c) => <ConflictCard key={c.id} conflict={c} />)}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <AlertTriangle size={40} className="mx-auto text-green-500 mb-3" />
          <p className="text-lg font-semibold">No conflicts for this filter</p>
          <p className="text-sm mt-1">All scheduled events appear clear.</p>
        </div>
      )}
    </div>
  );
}
