import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-3xl border border-border/80 bg-surface p-6 shadow-lift animate-fade-up">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Close">
            <X size={18} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
