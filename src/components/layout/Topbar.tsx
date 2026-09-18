import { Bot, Menu, Monitor, Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import type { Theme } from '../../types/app';

const titles: Record<string, string> = {
  '/': 'Overview',
  '/ingestion': 'Data ingestion',
  '/data-quality': 'Data quality',
  '/standardization': 'Standardization',
  '/forecast-eda': 'Forecast EDA',
  '/model-selection': 'Model selection',
  '/training': 'Model training',
  '/dashboard': 'Forecast dashboard',
  '/segment-performance': 'Segment performance & bias',
  '/experiments': 'Experiments',
  '/ensemble': 'Ensemble builder',
  '/overrides': 'Business overrides',
  '/template-compare': 'Template comparison',
  '/approval': 'Approval',
  '/versions': 'Forecast versions',
};

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { pathname } = useLocation();
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const setAssistantOpen = useAppStore((s) => s.setAssistantOpen);
  const cycle = () =>
    setTheme(({ system: 'light', light: 'dark', dark: 'system' } as Record<Theme, Theme>)[theme]);
  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/50 bg-white/65 px-4 backdrop-blur-2xl md:px-8">
      <button
        onClick={onMenu}
        className="rounded-xl p-2 text-muted transition hover:bg-canvas lg:hidden"
      >
        <Menu size={20} />
      </button>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet">
          Forecast workspace
        </p>
        <h1 className="font-display truncate text-lg font-bold tracking-tight text-ink md:text-xl">
          {titles[pathname] ?? 'Control room'}
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => setAssistantOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-border/60 bg-white/80 px-3 py-2 text-xs font-bold text-ink shadow-soft transition hover:border-violet/35 hover:text-violet"
        >
          <span className="relative">
            <Bot size={15} className="text-violet" />
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-teal ring-2 ring-white" />
          </span>
          <span className="hidden sm:inline">Assistant</span>
        </button>
        <button
          onClick={cycle}
          title={`Theme: ${theme}`}
          className="rounded-xl border border-border/60 bg-white/80 p-2.5 text-muted shadow-soft transition hover:text-violet"
        >
          <Icon size={17} />
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet via-blue to-teal text-[11px] font-bold text-white shadow-glow">
          FC
        </div>
      </div>
    </header>
  );
}
