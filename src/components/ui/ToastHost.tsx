import { CheckCircle2, X } from 'lucide-react';
import { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

function Toast({ id, title, message }: { id: string; title: string; message?: string }) {
  const dismiss = useAppStore((s) => s.dismissToast);
  useEffect(() => {
    const timer = setTimeout(() => dismiss(id), 3500);
    return () => clearTimeout(timer);
  }, [dismiss, id]);
  return (
    <div className="flex w-80 gap-3 rounded-2xl border border-border/70 bg-surface/95 p-4 shadow-lift backdrop-blur-xl animate-fade-up">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal-soft text-teal">
        <CheckCircle2 size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink">{title}</p>
        {message && <p className="text-xs text-muted">{message}</p>}
      </div>
      <button onClick={() => dismiss(id)} className="text-muted hover:text-ink">
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastHost() {
  const toasts = useAppStore((s) => s.toasts);
  return (
    <div className="fixed bottom-24 left-4 z-[60] space-y-2 sm:left-6 lg:bottom-6 lg:left-[calc(16rem+1.5rem)]">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} />
      ))}
    </div>
  );
}
