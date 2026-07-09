import { Info } from 'lucide-react';

export function NoticeBanner() {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-usc-sky-wash dark:bg-usc-sky/10 border border-usc-sky/20">
      <Info className="text-usc-sky shrink-0 mt-0.5" size={18} />
      <p className="text-sm text-usc-charcoal dark:text-white/70 leading-relaxed">
        <span className="font-semibold text-usc-black dark:text-[#F5F0E8]">Heads up:</span>{' '}
        green & proposed events still need USC approval — dates can shift. This calendar is for planning together, not final posting yet.
      </p>
    </div>
  );
}
