import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}) {
  const styles = {
    primary:
      'bg-gradient-to-b from-[#6358e0] to-violet text-white shadow-glow hover:brightness-110 hover:-translate-y-px active:translate-y-0',
    secondary:
      'border border-border bg-surface text-ink shadow-soft hover:border-violet/30 hover:bg-violet-soft/50',
    ghost: 'text-muted hover:bg-canvas hover:text-ink',
    danger: 'bg-coral text-white hover:bg-coral/90 shadow-soft',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-tight transition duration-150 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
