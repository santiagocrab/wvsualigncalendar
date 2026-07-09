import { AlertCircle } from 'lucide-react';

export function NoticeBanner() {
  return (
    <div className="bg-usc-gold-wash dark:bg-usc-gold/8 border border-usc-gold/25 rounded-2xl px-5 py-4 flex items-start gap-3">
      <AlertCircle className="text-usc-gold-dark shrink-0 mt-0.5" size={20} />
      <div>
        <p className="text-sm font-semibold text-usc-black dark:text-[#F0EDE8]">Official USC Notice</p>
        <p className="text-sm text-usc-muted dark:text-white/55 mt-1 leading-relaxed">
          Proposed events are subject for approval and may change. This is a read-only publication of the unified calendar for Academic Year 2026–2027.
        </p>
      </div>
    </div>
  );
}
