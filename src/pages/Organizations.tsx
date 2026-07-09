import { useMemo, useState } from 'react';
import { useEvents } from '../context/EventsContext';
import { OrganizationCard, buildOrgStats } from '../components/OrganizationCard';
import { Building2, Search } from 'lucide-react';

export default function OrganizationsPage() {
  const { events, conflicts, organizations } = useEvents();
  const [query, setQuery] = useState('');
  const stats = useMemo(() => buildOrgStats(events, conflicts, organizations), [events, conflicts, organizations]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return stats;
    return stats.filter((o) => o.name.toLowerCase().includes(q));
  }, [stats, query]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-usc-black to-usc-charcoal p-8 text-white shadow-2xl border border-usc-gold/30">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-usc-gold flex items-center justify-center shrink-0">
            <Building2 size={28} className="text-usc-black" />
          </div>
          <div className="flex-1">
            <p className="text-usc-gold text-xs font-bold uppercase tracking-widest">Featured Directory</p>
            <h1 className="text-3xl font-extrabold mt-1">Organizations & Councils</h1>
            <p className="text-white/80 text-sm mt-2 leading-relaxed">
              {organizations.length} official councils and student organizations for AY 2026–2027 (USC master list).
            </p>
          </div>
        </div>
        <div className="mt-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search organization name..."
            className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 font-medium text-sm border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-usc-gold"
          />
        </div>
      </div>

      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Showing {filtered.length} of {organizations.length} organizations
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((org) => <OrganizationCard key={org.name} org={org} />)}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-12 font-medium">No organizations match your search.</p>
      )}
    </div>
  );
}
