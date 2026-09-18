import type { AppStateSnapshot } from './contextTypes';
import { stageFromPath } from './stageMap';
import type { AssistantContext } from './types';

export function buildAssistantContext(
  pathname: string,
  state: AppStateSnapshot,
): AssistantContext {
  const { id, label } = stageFromPath(pathname);
  const decisions = state.decisions;
  const pending = Object.values(decisions).filter((d) => d === 'pending').length;
  const accepted = Object.values(decisions).filter((d) => d === 'accept' || d === 'modify').length;
  const rejected = Object.values(decisions).filter((d) => d === 'reject').length;
  const weightTotal = Object.values(state.ensembleWeights).reduce((a, b) => a + b, 0);

  const insights: string[] = [];
  if (!state.demoLoaded) insights.push('Demo dataset is not loaded yet.');
  if (pending > 0) insights.push(`${pending} data-quality issues still need a decision.`);
  if (state.demoLoaded && !state.preparedApproved) insights.push('Standardized dataset is not approved yet.');
  if (state.preparedApproved && !state.trainingComplete) insights.push('Training has not completed for this run.');
  if (state.trainingComplete) insights.push(`Selected models: ${state.selectedModels.join(', ') || 'none'}.`);
  if (weightTotal !== 100) insights.push(`Ensemble weights currently total ${weightTotal}% (need 100%).`);
  if (state.overrideCount > 0) insights.push(`${state.overrideCount} SKU override(s) applied.`);
  if (state.approvalStatus !== 'approved') insights.push(`Forecast approval status: ${state.approvalStatus}.`);

  return {
    pathname,
    stageId: id,
    stageLabel: label,
    stageStatus: state.stageStatus[id] ?? 'locked',
    demoLoaded: state.demoLoaded,
    preparedApproved: state.preparedApproved,
    trainingComplete: state.trainingComplete,
    trainingStatus: state.trainingStatus,
    selectedModels: state.selectedModels,
    pendingQualityIssues: pending,
    acceptedQualityIssues: accepted,
    rejectedQualityIssues: rejected,
    experimentCount: state.experimentCount,
    ensembleValid: weightTotal === 100,
    ensembleWeights: state.ensembleWeights,
    overrideCount: state.overrideCount,
    templateA: state.templateA,
    templateB: state.templateB,
    approvalStatus: state.approvalStatus,
    versionCount: state.versionCount,
    dashboardFilters: state.dashboardFilters,
    insights,
  };
}
