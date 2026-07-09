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
      <section className="usc-card overflow-hidden dark:bg-[#252220]">
        <div className="p-6 sm:p-8 bg-usc-coral-wash dark:bg-usc-coral/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#2A2724] flex items-center justify-center shrink-0">
              <ShieldAlert size={26} className="text-usc-coral" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-usc-black dark:text-[#F5F0E8]">
                Venue overlaps
              </h1>
              <p className="text-usc-muted dark:text-white/55 text-sm mt-2 max-w-xl leading-relaxed">
                When two <em>different</em> orgs book the same physical venue on the same day. Online, TBA/TBD, and same-org events are ignored — {conflicts.length} found.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="usc-pill bg-white dark:bg-[#2A2724] text-usc-coral border border-usc-coral/20">{counts.High} high priority</span>
                <span className="usc-pill bg-white dark:bg-[#2A2724] text-usc-charcoal dark:text-white/70 border border-usc-border">{counts.Medium} medium</span>
                <span className="usc-pill bg-white dark:bg-[#2A2724] text-usc-gold-dark dark:text-usc-gold border border-usc-gold/25">{counts.Low} low</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex gap-2 flex-wrap items-center">
        {(['all', 'High', 'Medium', 'Low'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition ${
              filter === f
                ? 'bg-usc-gold text-usc-black'
                : 'bg-white dark:bg-[#252220] border border-usc-border text-usc-ink dark:text-[#F2EDE6] hover:bg-usc-gold-wash'
            }`}
          >
            {f === 'all' ? `All (${conflicts.length})` : `${f} (${counts[f]})`}
          </button>
        ))}
        <Link to="/calendar" className="ml-auto px-4 py-2 rounded-full text-sm font-bold text-usc-gold-dark dark:text-usc-gold border border-usc-gold/40 hover:bg-usc-gold-wash">
          Back to calendar
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
