import {
  Activity,
  BarChart3,
  Beaker,
  Blend,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileDiff,
  Gauge,
  Home,
  Layers3,
  RotateCcw,
  Scale,
  SlidersHorizontal,
  Sparkles,
  Upload,
  WandSparkles,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import type { AppStageId, StageStatus } from '../../types/app';

const groups = [
  ['OVERVIEW', [['Overview', '/', Home, 'overview']]],
  [
    'DATA',
    [
      ['Ingestion', '/ingestion', Upload, 'ingestion'],
      ['Data quality', '/data-quality', ClipboardCheck, 'quality'],
      ['Standardization', '/standardization', WandSparkles, 'standardization'],
    ],
  ],
  ['ANALYSIS', [['Forecast EDA', '/forecast-eda', Activity, 'eda']]],
  [
    'MODELING',
    [
      ['Model selection', '/model-selection', Layers3, 'model-selection'],
      ['Training', '/training', Sparkles, 'training'],
      ['Experiments', '/experiments', Beaker, 'experiments'],
      ['Ensemble', '/ensemble', Blend, 'ensemble'],
    ],
  ],
  [
    'PERFORMANCE',
    [
      ['Dashboard', '/dashboard', Gauge, 'dashboard'],
      ['Segment & bias', '/segment-performance', Scale, 'segment-performance'],
    ],
  ],
  [
    'DECISION',
    [
      ['Overrides', '/overrides', SlidersHorizontal, 'overrides'],
      ['Template compare', '/template-compare', FileDiff, 'template-compare'],
      ['Approval', '/approval', CheckCircle2, 'approval'],
      ['Versions', '/versions', Database, 'versions'],
    ],
  ],
] as const;

const statusStyle: Record<StageStatus, string> = {
  locked: 'bg-white/5 text-white/40',
  ready: 'bg-[#2A66E8]/25 text-[#B8D0FF]',
  'in-progress': 'bg-[#B86E08]/25 text-[#FFD9A0]',
  complete: 'bg-[#0C9587]/25 text-[#9EE8DE]',
};

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const statuses = useAppStore((s) => s.stageStatus);
  const resetDemo = useAppStore((s) => s.resetDemo);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-ink/50 backdrop-blur-sm lg:hidden ${open ? '' : 'hidden'}`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[var(--rail)] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_300px_at_0%_0%,rgba(83,70,211,.4),transparent_60%)]" />

        <div className="relative flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet to-teal shadow-glow">
            <BarChart3 size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold leading-tight">Forecast Control Room</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">
              AutoML Sales Forecasting
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="relative flex-1 overflow-y-auto p-3">
          {groups.map(([group, links]) => (
            <div key={group} className="mb-4">
              <p className="mb-1.5 px-3 text-[10px] font-bold tracking-[0.2em] text-white/35">{group}</p>
              {links.map(([label, path, Icon, stage]) => {
                const status = statuses[stage as AppStageId];
                return (
                  <NavLink
                    end={path === '/'}
                    onClick={onClose}
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `mb-0.5 flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]'
                          : 'text-white/55 hover:bg-white/[0.06] hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-lg transition ${
                            isActive
                              ? 'bg-gradient-to-br from-violet to-blue text-white'
                              : 'bg-white/5 text-white/55'
                          }`}
                        >
                          <Icon size={14} />
                        </span>
                        <span className="flex-1 truncate">{label}</span>
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusStyle[status]}`}
                        >
                          {status === 'in-progress' ? 'active' : status}
                        </span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="relative border-t border-white/10 p-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
            <div className="flex items-center gap-2">
              <span className="status-dot bg-teal animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
                Demo mode
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-white/45">
              Mock data only — no live training or APIs.
            </p>
            <button
              type="button"
              onClick={resetDemo}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <RotateCcw size={14} />
              Reset demo
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
