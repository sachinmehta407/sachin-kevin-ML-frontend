import type { ReactNode } from 'react';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet">{eyebrow}</p>
        <h1 className="font-display mt-1.5 text-2xl font-extrabold leading-tight text-ink md:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

export const tableClass = 'w-full text-left text-sm';
export const thClass =
  'border-b border-border px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted';
export const tdClass = 'border-b border-border/60 px-3 py-3 text-ink';
