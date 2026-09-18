import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { buildAssistantContext } from '../services/assistant';
import type { AppStateSnapshot } from '../services/assistant/contextTypes';

export function useAssistantContext() {
  const { pathname } = useLocation();
  const stageStatus = useAppStore((s) => s.stageStatus);
  const demoLoaded = useAppStore((s) => s.demoLoaded);
  const preparedApproved = useAppStore((s) => s.preparedApproved);
  const trainingComplete = useAppStore((s) => s.trainingComplete);
  const trainingStatus = useAppStore((s) => s.trainingStatus);
  const selectedModels = useAppStore((s) => s.selectedModels);
  const decisions = useAppStore((s) => s.decisions);
  const experiments = useAppStore((s) => s.experiments);
  const ensembleWeights = useAppStore((s) => s.ensembleWeights);
  const overrides = useAppStore((s) => s.overrides);
  const templateA = useAppStore((s) => s.templateA);
  const templateB = useAppStore((s) => s.templateB);
  const approvalStatus = useAppStore((s) => s.approvalStatus);
  const versions = useAppStore((s) => s.versions);
  const dashboardFilters = useAppStore((s) => s.dashboardFilters);

  return useMemo(() => {
    const snapshot: AppStateSnapshot = {
      stageStatus,
      demoLoaded,
      preparedApproved,
      trainingComplete,
      trainingStatus,
      selectedModels,
      decisions,
      experimentCount: experiments.length,
      ensembleWeights,
      overrideCount: overrides.length,
      templateA,
      templateB,
      approvalStatus,
      versionCount: versions.length,
      dashboardFilters: {
        category: dashboardFilters.category,
        product: dashboardFilters.product,
        sku: dashboardFilters.sku,
        region: dashboardFilters.region,
        model: dashboardFilters.model,
        template: dashboardFilters.template,
      },
    };
    return buildAssistantContext(pathname, snapshot);
  }, [
    pathname,
    stageStatus,
    demoLoaded,
    preparedApproved,
    trainingComplete,
    trainingStatus,
    selectedModels,
    decisions,
    experiments.length,
    ensembleWeights,
    overrides.length,
    templateA,
    templateB,
    approvalStatus,
    versions.length,
    dashboardFilters,
  ]);
}
