import type { ReactNode } from 'react';

export function KpiStat({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-3.5 shadow-soft backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-violet via-blue to-teal opacity-90" />
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{label}</span>
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-soft text-violet">
          {icon}
        </span>
      </div>
      <p className="mt-2 font-mono text-xl font-semibold tracking-tight text-ink md:text-2xl">{value}</p>
      {detail && <p className="mt-0.5 text-[11px] text-muted">{detail}</p>}
    </div>
  );
}
