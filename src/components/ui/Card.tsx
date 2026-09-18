import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`panel p-5 transition duration-200 hover:shadow-lift ${className}`}>{children}</section>;
}

export function CardTitle({ children, subtitle }: { children: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-lg font-bold tracking-tight text-ink">{children}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}
