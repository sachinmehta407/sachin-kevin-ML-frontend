import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { applyFilterChange, defaultFilters } from '../lib/filters';
import { assembleFinalForecast, suggestedAccuracyForScope } from '../lib/forecastAssembly';
import { countSkusInScope, seedForecastTemplates } from '../data/jewelleryCorpus';
import { dataQualityIssues } from '../data/dataQualityIssues';
import { defaultColumnMappings, demoFiles } from '../data/datasets';
import { experiments as seedExperiments } from '../data/experiments';
import { recentActivity } from '../data/activity';
import { templates } from '../data/templates';
import { forecastVersions } from '../data/versions';
import type { AssistantMessage } from '../services/assistant';
import type {
  ActivityItem, AppStageId, ApprovalStatus, ColumnMapping, EnsembleWeights,
  Experiment, ForecastVersion, IssueDecision, OverrideRow, StageStatus,
  Theme, ToastMessage, TrainingStatus, Transformation, UploadState,
} from '../types/app';
import type { FinalForecastAssembly, ForecastTemplate, TemplateScope } from '../types/jewellery';
import type { ForecastDashboardFilters } from '../types/forecast';

const stageIds: AppStageId[] = [
  'overview','ingestion','quality','standardization','eda','model-selection','training',
  'dashboard','segment-performance','experiments','ensemble','overrides',
  'template-lab','forecast-assembly','template-compare','approval','versions',
];
const initialStages = Object.fromEntries(stageIds.map((id, i) => [id, i < 2 ? 'ready' : 'locked'])) as Record<AppStageId, StageStatus>;

interface AppState {
  theme: Theme;
  stageStatus: Record<AppStageId, StageStatus>;
  files: typeof demoFiles;
  demoLoaded: boolean;
  uploadState: UploadState;
  columnMappings: ColumnMapping[];
  qualityIssues: typeof dataQualityIssues;
  decisions: Record<string, IssueDecision>;
  transformations: Transformation[];
  preparedApproved: boolean;
  selectedModels: string[];
  trainingStatus: TrainingStatus;
  trainingLogs: string[];
  trainingComplete: boolean;
  dashboardFilters: ForecastDashboardFilters;
  experiments: Experiment[];
  ensembleWeights: EnsembleWeights;
  overrides: OverrideRow[];
  forecastTemplates: ForecastTemplate[];
  finalAssembly: FinalForecastAssembly | null;
  templateA: string;
  templateB: string;
  compareLog: string[];
  approvalStatus: ApprovalStatus;
  versions: ForecastVersion[];
  activity: ActivityItem[];
  toasts: ToastMessage[];
  assistantOpen: boolean;
  assistantMessages: AssistantMessage[];
  setTheme: (theme: Theme) => void;
  setStageStatus: (id: AppStageId, status: StageStatus) => void;
  completeStage: (id: AppStageId, next?: AppStageId) => void;
  loadDemo: () => void;
  setUploadState: (state: UploadState) => void;
  setColumnMapping: (source: string, target: ColumnMapping['target']) => void;
  decideIssue: (id: string, decision: IssueDecision) => void;
  setTransformations: (rows: Transformation[]) => void;
  approvePrepared: () => void;
  toggleModel: (model: string) => void;
  startTraining: () => void;
  addTrainingLog: (line: string) => void;
  finishTraining: () => void;
  setDashboardFilter: (key: keyof ForecastDashboardFilters, value: string) => void;
  resetDashboardFilters: () => void;
  createExperiment: (name: string) => void;
  duplicateExperiment: (id: string) => void;
  deleteExperiment: (id: string) => void;
  setEnsembleWeight: (model: string, weight: number) => void;
  addOverride: (row: OverrideRow) => void;
  updateOverride: (id: string, patch: Partial<OverrideRow>) => void;
  deleteOverride: (id: string) => void;
  createForecastTemplate: (input: {
    name: string;
    description: string;
    scope: TemplateScope;
    models: string[];
    priority: number;
  }) => void;
  runForecastTemplate: (id: string) => void;
  approveForecastTemplate: (id: string) => void;
  setTemplatePriority: (id: string, priority: number) => void;
  deleteForecastTemplate: (id: string) => void;
  assembleForecast: () => void;
  setTemplates: (a: string, b: string) => void;
  setCompareLog: (log: string[]) => void;
  setApprovalStatus: (status: ApprovalStatus) => void;
  approveForecast: (notes?: string) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
  setAssistantOpen: (open: boolean) => void;
  appendAssistantMessage: (message: Omit<AssistantMessage, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => void;
  clearAssistantMessages: () => void;
  resetDemo: () => void;
}

const initialData = {
  theme: 'system' as Theme,
  stageStatus: initialStages,
  files: demoFiles,
  demoLoaded: false,
  uploadState: 'idle' as UploadState,
  columnMappings: defaultColumnMappings.map((m) => ({ ...m })) as ColumnMapping[],
  qualityIssues: dataQualityIssues,
  decisions: Object.fromEntries(dataQualityIssues.map((i) => [i.id, 'pending'])) as Record<string, IssueDecision>,
  transformations: [] as Transformation[],
  preparedApproved: false,
  selectedModels: ['SARIMA', 'Holt-Winters', 'XGBoost'],
  trainingStatus: 'idle' as TrainingStatus,
  trainingLogs: [] as string[],
  trainingComplete: false,
  dashboardFilters: defaultFilters(),
  experiments: seedExperiments,
  ensembleWeights: { XGBoost: 45, SARIMA: 30, 'Holt-Winters': 25 },
  overrides: [] as OverrideRow[],
  forecastTemplates: seedForecastTemplates.map((t) => ({ ...t, scope: { ...t.scope } })),
  finalAssembly: null as FinalForecastAssembly | null,
  templateA: templates[0].id,
  templateB: templates[1].id,
  compareLog: [] as string[],
  approvalStatus: 'draft' as ApprovalStatus,
  versions: forecastVersions,
  activity: recentActivity,
  toasts: [] as ToastMessage[],
  assistantOpen: false,
  assistantMessages: [] as AssistantMessage[],
};

export const useAppStore = create<AppState>()(persist((set, get) => ({
  ...initialData,
  setTheme: (theme) => set({ theme }),
  setStageStatus: (id, status) => set((s) => ({ stageStatus: { ...s.stageStatus, [id]: status } })),
  completeStage: (id, next) => set((s) => ({ stageStatus: { ...s.stageStatus, [id]: 'complete', ...(next ? { [next]: 'ready' } : {}) } })),
  loadDemo: () => set((s) => ({ demoLoaded: true, uploadState: 'complete', stageStatus: { ...s.stageStatus, ingestion: 'complete', quality: 'ready' } })),
  setUploadState: (uploadState) => set({ uploadState }),
  setColumnMapping: (source, target) => set((s) => ({ columnMappings: s.columnMappings.map((m) => m.source === source ? { ...m, target } : m) })),
  decideIssue: (id, decision) => set((s) => ({ decisions: { ...s.decisions, [id]: decision } })),
  setTransformations: (transformations) => set({ transformations }),
  approvePrepared: () => set((s) => ({ preparedApproved: true, stageStatus: { ...s.stageStatus, standardization: 'complete', eda: 'ready' } })),
  toggleModel: (model) => set((s) => ({ selectedModels: s.selectedModels.includes(model) ? s.selectedModels.filter((m) => m !== model) : [...s.selectedModels, model] })),
  startTraining: () => set({ trainingStatus: 'running', trainingLogs: [], trainingComplete: false }),
  addTrainingLog: (line) => set((s) => ({ trainingLogs: [...s.trainingLogs, line] })),
  finishTraining: () => set((s) => ({ trainingStatus: 'complete', trainingComplete: true, stageStatus: { ...s.stageStatus, training: 'complete', dashboard: 'ready', 'segment-performance': 'ready', experiments: 'ready' } })),
  setDashboardFilter: (key, value) => set((s) => ({ dashboardFilters: applyFilterChange(s.dashboardFilters, key, value) })),
  resetDashboardFilters: () => set({ dashboardFilters: defaultFilters() }),
  createExperiment: (name) => set((s) => ({ experiments: [...s.experiments, { id: crypto.randomUUID(), name, models: s.selectedModels, horizon: 12, wape: 0, bias: 0, status: 'draft', createdAt: new Date().toLocaleDateString() }] })),
  duplicateExperiment: (id) => set((s) => ({ experiments: [...s.experiments, ...s.experiments.filter((e) => e.id === id).map((e) => ({ ...e, id: crypto.randomUUID(), name: `${e.name} copy`, status: 'draft' as const }))] })),
  deleteExperiment: (id) => set((s) => ({ experiments: s.experiments.filter((e) => e.id !== id && e.id !== 'default') })),
  setEnsembleWeight: (model, weight) => set((s) => ({ ensembleWeights: { ...s.ensembleWeights, [model]: Math.max(0, Math.min(100, weight)) } })),
  addOverride: (row) => set((s) => ({ overrides: [...s.overrides, row] })),
  updateOverride: (id, patch) => set((s) => ({ overrides: s.overrides.map((r) => r.id === id ? { ...r, ...patch } : r) })),
  deleteOverride: (id) => set((s) => ({ overrides: s.overrides.filter((r) => r.id !== id) })),

  createForecastTemplate: ({ name, description, scope, models, priority }) => set((s) => ({
    forecastTemplates: [
      ...s.forecastTemplates,
      {
        id: crypto.randomUUID(),
        name,
        description,
        isBaseline: false,
        scope,
        models,
        status: 'draft',
        accuracy: null,
        skuCount: countSkusInScope(scope),
        priority,
        createdAt: new Date().toLocaleDateString(),
      },
    ],
  })),

  runForecastTemplate: (id) => {
    set((s) => ({
      forecastTemplates: s.forecastTemplates.map((t) =>
        t.id === id ? { ...t, status: 'running' as const } : t,
      ),
    }));
    window.setTimeout(() => {
      set((s) => ({
        forecastTemplates: s.forecastTemplates.map((t) => {
          if (t.id !== id) return t;
          const accuracy = suggestedAccuracyForScope(t.scope, t.models);
          return {
            ...t,
            status: 'complete' as const,
            accuracy,
            skuCount: countSkusInScope(t.scope),
          };
        }),
      }));
    }, 900);
  },

  approveForecastTemplate: (id) => set((s) => ({
    forecastTemplates: s.forecastTemplates.map((t) =>
      t.id === id && (t.status === 'complete' || t.status === 'approved')
        ? { ...t, status: 'approved' as const }
        : t,
    ),
    finalAssembly: null,
  })),

  setTemplatePriority: (id, priority) => set((s) => ({
    forecastTemplates: s.forecastTemplates.map((t) =>
      t.id === id ? { ...t, priority: Math.max(0, priority) } : t,
    ),
    finalAssembly: null,
  })),

  deleteForecastTemplate: (id) => set((s) => ({
    forecastTemplates: s.forecastTemplates.filter((t) => t.id !== id && !t.isBaseline),
    finalAssembly: null,
  })),

  assembleForecast: () => {
    const assembly = assembleFinalForecast(get().forecastTemplates);
    set((s) => ({
      finalAssembly: assembly,
      stageStatus: {
        ...s.stageStatus,
        'forecast-assembly': 'complete',
        'template-compare': 'ready',
        approval: 'ready',
      },
    }));
  },

  setTemplates: (templateA, templateB) => set({ templateA, templateB }),
  setCompareLog: (compareLog) => set({ compareLog }),
  setApprovalStatus: (approvalStatus) => set({ approvalStatus }),
  approveForecast: (notes = 'Approved assembled Olist forecast') => set((s) => {
    const wape = s.finalAssembly ? Number((100 - s.finalAssembly.blendedAccuracy).toFixed(1)) : 10.9;
    const version: ForecastVersion = {
      id: crypto.randomUUID(),
      name: `FY26 V${s.versions.filter((v) => v.name.startsWith('FY26')).length + 1}`,
      status: 'approved',
      createdAt: new Date().toLocaleDateString(),
      owner: 'Forecast Ops',
      wape,
      notes,
    };
    return {
      approvalStatus: 'approved',
      versions: [version, ...s.versions],
      stageStatus: { ...s.stageStatus, approval: 'complete', versions: 'ready' },
    };
  }),
  addToast: (toast) => set((s) => ({ toasts: [...s.toasts, { ...toast, id: crypto.randomUUID() }] })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  setAssistantOpen: (assistantOpen) => set({ assistantOpen }),
  appendAssistantMessage: (message) => set((s) => ({
    assistantMessages: [
      ...s.assistantMessages,
      {
        id: message.id ?? crypto.randomUUID(),
        createdAt: message.createdAt ?? new Date().toISOString(),
        role: message.role,
        content: message.content,
        stageId: message.stageId,
      },
    ],
  })),
  clearAssistantMessages: () => set({ assistantMessages: [] }),
  resetDemo: () => set({
    ...initialData,
    stageStatus: { ...initialStages },
    decisions: { ...initialData.decisions },
    forecastTemplates: seedForecastTemplates.map((t) => ({ ...t, scope: { ...t.scope } })),
    finalAssembly: null,
    assistantOpen: false,
    assistantMessages: [],
  }),
}), {
  name: 'forecast-control-room-demo-v2',
  partialize: (s) => {
    const { assistantOpen: _a, assistantMessages: _m, toasts: _t, ...rest } = s;
    return rest;
  },
}));
