import type { ReactNode } from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border/90 bg-canvas/40 p-10 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-soft text-violet shadow-soft">
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
