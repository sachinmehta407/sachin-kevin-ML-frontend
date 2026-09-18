export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return <div><div className="mb-1 flex justify-between text-xs text-muted">{label && <span>{label}</span>}<span className="ml-auto font-mono">{Math.round(value)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-violet-soft"><div className="h-full rounded-full bg-gradient-to-r from-violet to-teal transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div></div>;
}
