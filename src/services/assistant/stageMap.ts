import type { AppStageId } from '../../types/app';

const PATH_TO_STAGE: Array<{ match: RegExp; id: AppStageId; label: string }> = [
  { match: /^\/$/, id: 'overview', label: 'Overview' },
  { match: /^\/ingestion/, id: 'ingestion', label: 'Ingestion & Discovery' },
  { match: /^\/data-quality/, id: 'quality', label: 'Data Quality & Cleaning' },
  { match: /^\/standardization/, id: 'standardization', label: 'Standardization & Audit' },
  { match: /^\/forecast-eda/, id: 'eda', label: 'Forecasting EDA' },
  { match: /^\/model-selection/, id: 'model-selection', label: 'Model Selection' },
  { match: /^\/training/, id: 'training', label: 'Training & Evaluation' },
  { match: /^\/dashboard/, id: 'dashboard', label: 'Forecast Dashboard' },
  { match: /^\/segment-performance/, id: 'segment-performance', label: 'Segment & Bias' },
  { match: /^\/experiments/, id: 'experiments', label: 'Experiments' },
  { match: /^\/ensemble/, id: 'ensemble', label: 'Ensemble Forecast' },
  { match: /^\/overrides/, id: 'overrides', label: 'Forecast Overrides' },
  { match: /^\/template-compare/, id: 'template-compare', label: 'Template Compare' },
  { match: /^\/approval/, id: 'approval', label: 'Approval' },
  { match: /^\/versions/, id: 'versions', label: 'Forecast Versions' },
];

export function stageFromPath(pathname: string): { id: AppStageId; label: string } {
  const hit = PATH_TO_STAGE.find((p) => p.match.test(pathname));
  return hit ? { id: hit.id, label: hit.label } : { id: 'overview', label: 'Overview' };
}
