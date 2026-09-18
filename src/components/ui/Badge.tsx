import type { ReactNode } from 'react';

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'violet' | 'blue' | 'teal' | 'amber' | 'coral';
}) {
  const tones = {
    neutral: 'bg-canvas text-muted ring-1 ring-border/70',
    violet: 'bg-violet-soft text-violet ring-1 ring-violet/15',
    blue: 'bg-blue-soft text-blue ring-1 ring-blue/15',
    teal: 'bg-teal-soft text-teal ring-1 ring-teal/15',
    amber: 'bg-amber-soft text-amber ring-1 ring-amber/15',
    coral: 'bg-coral-soft text-coral ring-1 ring-coral/15',
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
