import type { AppStageId, ApprovalStatus, EnsembleWeights, IssueDecision, StageStatus } from '../../types/app';
import type { ForecastDashboardFilters } from '../../types/forecast';

/** Minimal store slice for assistant grounding (avoids circular imports). */
export interface AppStateSnapshot {
  stageStatus: Record<AppStageId, StageStatus>;
  demoLoaded: boolean;
  preparedApproved: boolean;
  trainingComplete: boolean;
  trainingStatus: string;
  selectedModels: string[];
  decisions: Record<string, IssueDecision>;
  experimentCount: number;
  ensembleWeights: EnsembleWeights;
  overrideCount: number;
  templateA: string;
  templateB: string;
  approvalStatus: ApprovalStatus;
  versionCount: number;
  dashboardFilters: Pick<
    ForecastDashboardFilters,
    'category' | 'product' | 'sku' | 'region' | 'model' | 'template'
  >;
}
