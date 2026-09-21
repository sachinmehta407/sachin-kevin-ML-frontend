import { Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { ApprovalPage } from '../features/approval/ApprovalPage';
import { ForecastDashboardPage } from '../features/dashboard/ForecastDashboardPage';
import { DataQualityPage } from '../features/data-quality/DataQualityPage';
import { EnsemblePage } from '../features/ensemble/EnsemblePage';
import { ExperimentsPage } from '../features/experiments/ExperimentsPage';
import { ForecastAssemblyPage } from '../features/forecast-assembly/ForecastAssemblyPage';
import { ForecastEdaPage } from '../features/forecast-eda/ForecastEdaPage';
import { IngestionPage } from '../features/ingestion/IngestionPage';
import { ModelSelectionPage } from '../features/model-selection/ModelSelectionPage';
import { OverviewPage } from '../features/overview/OverviewPage';
import { OverridesPage } from '../features/overrides/OverridesPage';
import { SegmentBiasPage } from '../features/segment-performance/SegmentBiasPage';
import { StandardizationPage } from '../features/standardization/StandardizationPage';
import { TemplateComparePage } from '../features/template-compare/TemplateComparePage';
import { TemplateLabPage } from '../features/template-lab/TemplateLabPage';
import { TrainingPage } from '../features/training/TrainingPage';
import { VersionsPage } from '../features/versions/VersionsPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<OverviewPage />} />
        <Route path="ingestion" element={<IngestionPage />} />
        <Route path="data-quality" element={<DataQualityPage />} />
        <Route path="standardization" element={<StandardizationPage />} />
        <Route path="forecast-eda" element={<ForecastEdaPage />} />
        <Route path="model-selection" element={<ModelSelectionPage />} />
        <Route path="training" element={<TrainingPage />} />
        <Route path="dashboard" element={<ForecastDashboardPage />} />
        <Route path="segment-performance" element={<SegmentBiasPage />} />
        <Route path="experiments" element={<ExperimentsPage />} />
        <Route path="ensemble" element={<EnsemblePage />} />
        <Route path="overrides" element={<OverridesPage />} />
        <Route path="template-lab" element={<TemplateLabPage />} />
        <Route path="forecast-assembly" element={<ForecastAssemblyPage />} />
        <Route path="template-compare" element={<TemplateComparePage />} />
        <Route path="approval" element={<ApprovalPage />} />
        <Route path="versions" element={<VersionsPage />} />
      </Route>
    </Routes>
  );
}
