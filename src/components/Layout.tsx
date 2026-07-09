import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, AlertTriangle, Building2,
  Kanban, BarChart3, Settings, Search, Moon, Sun,
} from 'lucide-react';
import { useEvents } from '../context/EventsContext';
import { cn } from '../lib/utils';
import { USC_LOGO } from '../lib/brand';

const MAIN_NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
];

const FEATURED_NAV = [
  { to: '/conflicts', icon: AlertTriangle, label: 'Conflict Checker', desc: 'Physical venue clashes', hot: true },
  { to: '/organizations', icon: Building2, label: 'Organizations', desc: 'All councils & orgs', hot: false },
];

const MORE_NAV = [
  { to: '/approval', icon: Kanban, label: 'Approval Board' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings & Legend' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { search, setSearch, darkMode, toggleDarkMode, conflicts, organizations } = useEvents();
  const highConflicts = conflicts.filter((c) => c.severity === 'High').length;

  return (
    <div className="min-h-screen flex bg-usc-cream dark:bg-[#1F1D1B]">
      <aside className="hidden lg:flex w-[17.5rem] flex-col fixed inset-y-0 z-30 bg-usc-surface text-[#F0EDE8] shadow-xl border-r border-usc-border/20">
        <div className="usc-ray-bar shrink-0" />

        <div className="p-5 border-b border-white/8">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <img
                src={USC_LOGO}
                alt="WVSU University Student Council"
                className="w-24 h-24 rounded-full object-cover usc-gold-ring"
              />
            </div>
            <p className="font-display font-bold text-sm leading-snug text-[#F5F3F0] tracking-wide">
              University Student Council
            </p>
            <p className="text-[10px] text-usc-gold-light font-semibold uppercase tracking-[0.2em] mt-1">
              WVSU · Unified Calendar
            </p>
            <p className="text-xs text-white/50 mt-2 font-medium">Academic Year 2026–2027</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {MAIN_NAV.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
              pathname === to
                ? 'bg-usc-gold/20 text-usc-gold-light border border-usc-gold/25'
                : 'text-white/70 hover:bg-white/8 hover:text-white'
            )}>
              <Icon size={18} strokeWidth={2.5} /> {label}
            </Link>
          ))}

          <p className="text-[10px] uppercase tracking-widest text-usc-gold-light/80 font-semibold px-3 pt-5 pb-2">Featured</p>
          {FEATURED_NAV.map(({ to, icon: Icon, label, desc, hot }) => {
            const active = pathname === to;
            const badge = label === 'Conflict Checker' ? highConflicts : organizations.length;
            return (
              <Link key={to} to={to} className={cn(
                'block px-3 py-3 rounded-xl transition-all mb-1.5 border',
                active
                  ? 'bg-usc-warm text-usc-black border-usc-gold/40 shadow-sm'
                  : 'bg-white/5 border-white/8 hover:border-usc-gold/30 hover:bg-white/8'
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                    hot ? 'bg-usc-rose/90' : 'bg-usc-gold/25'
                  )}>
                    <Icon size={17} className={hot ? 'text-white' : 'text-usc-gold-light'} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className={cn('font-semibold text-sm', active ? 'text-usc-black' : 'text-[#F0EDE8]')}>{label}</p>
                    <p className={cn('text-[11px]', active ? 'text-usc-muted' : 'text-white/40')}>{desc}</p>
                  </div>
                  <span className={cn(
                    'text-xs font-extrabold px-2 py-0.5 rounded-full shrink-0',
                    hot ? 'bg-usc-rose-wash text-usc-rose' : 'bg-usc-gold-wash text-usc-gold-dark'
                  )}>
                    {badge}
                  </span>
                </div>
              </Link>
            );
          })}

          <p className="text-[10px] uppercase tracking-widest text-white/35 font-bold px-3 pt-4 pb-2">More</p>
          {MORE_NAV.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
              pathname === to ? 'bg-usc-gold/15 text-usc-gold-light' : 'text-white/50 hover:bg-white/8 hover:text-white/80'
            )}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 text-[11px] text-white/40 leading-relaxed text-center">
          Office of Student Affairs · WVSU<br />
          <span className="text-usc-gold-light/60">Official read-only publication</span>
        </div>
      </aside>

      <div className="flex-1 lg:ml-[17.5rem] flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#2A2724]/90 backdrop-blur-md border-b border-usc-border shadow-sm">
          <div className="usc-ray-bar" />
          <div className="flex items-center gap-3 px-4 lg:px-8 py-3">
            <img src={USC_LOGO} alt="USC" className="lg:hidden w-10 h-10 rounded-full object-cover ring-2 ring-usc-gold-light" />
            <div className="hidden md:block min-w-0">
              <h1 className="font-display text-sm font-bold text-usc-black dark:text-[#F0EDE8] truncate">
                WVSU USC Unified Calendar
              </h1>
              <p className="text-xs text-usc-muted dark:text-white/50 font-medium">AY 2026–2027 · Read-only</p>
            </div>
            <div className="flex-1 max-w-lg ml-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-usc-muted" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, organizations, venues..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-usc-border text-sm font-medium text-usc-ink dark:text-[#F0EDE8] bg-usc-warm dark:bg-[#2A2724] focus:ring-2 focus:ring-usc-gold/25 focus:border-usc-gold"
              />
            </div>
            <Link to="/conflicts" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-usc-rose-wash dark:bg-usc-rose/15 text-usc-rose dark:text-[#E8A0A0] text-xs font-semibold border border-usc-rose/25">
              <AlertTriangle size={14} /> {highConflicts} High
            </Link>
            <Link to="/organizations" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-usc-gold-wash dark:bg-usc-gold/10 text-usc-gold-dark dark:text-usc-gold-light text-xs font-semibold border border-usc-gold/25">
              <Building2 size={14} /> {organizations.length} Orgs
            </Link>
            <button onClick={toggleDarkMode} className="p-2.5 rounded-xl border border-usc-border text-usc-muted dark:text-usc-gold-light hover:bg-usc-gold-wash dark:hover:bg-usc-gold/10" aria-label="Toggle theme">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <div className="lg:hidden flex overflow-x-auto gap-2 px-4 pb-3">
            {[...MAIN_NAV, ...FEATURED_NAV, ...MORE_NAV].map(({ to, label }) => (
              <Link key={to} to={to} className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition',
                pathname === to
                  ? 'bg-usc-gold/20 text-usc-gold-dark dark:text-usc-gold-light'
                  : 'bg-white dark:bg-[#2A2724] text-usc-ink dark:text-[#E8E4DF] border border-usc-border'
              )}>
                {label.split(' ')[0]}
              </Link>
            ))}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 text-usc-ink dark:text-[#E8E4DF]">{children}</main>
      </div>
    </div>
  );
}
