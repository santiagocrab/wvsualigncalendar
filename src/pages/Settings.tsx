import { CategoryLegend } from '../components/CategoryLegend';
import { STATUS_META, EVENT_TYPES, USC_NOTICE } from '../data/categories';
import { useEvents } from '../context/EventsContext';
import { Moon, Sun, Maximize2, Minimize2 } from 'lucide-react';

export default function SettingsPage() {
  const { darkMode, toggleDarkMode, compactView, toggleCompactView } = useEvents();

  const btnClass = 'flex items-center gap-2 px-4 py-2.5 rounded-xl border border-usc-border dark:border-[#3D3935] text-sm font-semibold text-usc-ink dark:text-[#E8E4DF] hover:bg-usc-warm dark:hover:bg-[#332F2C]';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-usc-black dark:text-[#F0EDE8]">Settings & Legend</h1>
        <p className="text-usc-muted dark:text-white/50 text-sm mt-1 font-medium">Display preferences, legends, and USC guidelines.</p>
      </div>

      <div className="bg-white dark:bg-[#2A2724] rounded-2xl p-6 shadow-sm border border-usc-border dark:border-[#3D3935] space-y-4">
        <h2 className="font-bold text-usc-black dark:text-white">Display Preferences</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={toggleDarkMode} className={btnClass}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={toggleCompactView} className={btnClass}>
            {compactView ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            {compactView ? 'Spacious View' : 'Compact View'}
          </button>
        </div>
      </div>

      <div className="bg-usc-gold-wash dark:bg-usc-gold/8 border border-usc-gold/25 rounded-2xl p-5">
        <h2 className="font-semibold text-usc-black dark:text-[#F0EDE8]">Official USC Notice</h2>
        <p className="text-sm text-usc-muted dark:text-white/55 mt-2 leading-relaxed">{USC_NOTICE}</p>
      </div>

      <div className="bg-white dark:bg-[#2A2724] rounded-2xl p-6 shadow-sm border border-usc-border dark:border-[#3D3935]">
        <h2 className="font-bold text-usc-black dark:text-white mb-4">Event Category Legend</h2>
        <CategoryLegend />
      </div>

      <div className="bg-white dark:bg-[#2A2724] rounded-2xl p-6 shadow-sm border border-usc-border dark:border-[#3D3935]">
        <h2 className="font-bold text-usc-black dark:text-[#F0EDE8] mb-4">Status Meanings</h2>
        <div className="space-y-3">
          {Object.entries(STATUS_META).map(([status, meta]) => (
            <div key={status} className="flex items-center gap-3 text-sm">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: meta.bg, color: meta.color }}>{status}</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {status === 'Approved' && 'Officially approved for the university calendar.'}
                {status === 'Pending Approval' && 'Awaiting USC/OSA review.'}
                {status === 'Proposed' && 'Submitted but not yet approved.'}
                {status === 'Needs Revision' && 'Requires changes before approval.'}
                {status === 'Cancelled' && 'Event has been cancelled.'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#2A2724] rounded-2xl p-6 shadow-sm border border-usc-border dark:border-[#3D3935]">
        <h2 className="font-bold text-usc-black dark:text-[#F0EDE8] mb-4">Event Types</h2>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((t) => (
            <span key={t} className="px-3 py-1 rounded-full bg-usc-warm dark:bg-[#332F2C] text-xs text-usc-ink dark:text-[#E8E4DF] font-medium">{t}</span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-6 border border-usc-gold/30 bg-usc-gold-wash dark:bg-[#1F1D1B] dark:border-usc-gold/20">
        <h2 className="font-bold text-usc-gold-dark dark:text-usc-gold">USC Reminders</h2>
        <ul className="mt-3 space-y-2 text-sm text-usc-charcoal dark:text-[#F5F0E8]/85 list-disc list-inside leading-relaxed">
          <li>Organizations are discouraged from scheduling on-campus events Friday–Sunday (MC 114).</li>
          <li>Avoid major activities during WVSU examination periods.</li>
          <li>Coordinate high-traffic venues (COM Gym, Cultural Center, PESCAR) with OSA.</li>
          <li>All proposed events require USC approval before official posting.</li>
        </ul>
      </div>
    </div>
  );
}
