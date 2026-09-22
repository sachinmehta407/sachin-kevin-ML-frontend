import { useMemo, useState } from 'react';
import { forecastRecords, modelPerformanceRecords } from '../../data/forecastRecords';
import {
  applyFilterChange,
  defaultFilters,
  filterForecastRecords,
  filterModelPerformance,
} from '../../lib/filters';
import {
  actualVsForecastSeries,
  aggregateModelPerformance,
  bubbleActualVsForecast,
  deriveKpis,
  errorTrendSeries,
  forecastBySku,
  forecastDirection,
  formatNumber,
  formatPct,
  generateInsights,
  modelRadarSeries,
  pieShareByCategory,
  polarVolumeByRegion,
  productsRequiringAttention,
  recommendedQuantities,
  topOverForecast,
  topUnderForecast,
  volumeByRegion,
  forecastFunnelStages,
} from '../../lib/metrics';
import { ForecastDashboardFilters } from '../../types/forecast';
import {
  AreaChartView,
  BarChartView,
  BubbleChartView,
  DoughnutChartView,
  FunnelChartView,
  LineChartView,
  MixedChartView,
  PieChartView,
  PolarAreaChartView,
  RadarChartView,
} from './Charts';
import { FilterBar } from './FilterBar';
import { KpiCards } from './KpiCards';
import {
  AttentionTable,
  ForecastBySkuTable,
  ModelPerformanceTable,
  OverForecastTable,
  RecommendedTable,
  UnderForecastTable,
} from './Tables';

export function ForecastDashboard() {
  const [filters, setFilters] = useState<ForecastDashboardFilters>(defaultFilters);

  const filtered = useMemo(
    () => filterForecastRecords(forecastRecords, filters),
    [filters],
  );

  const filteredModels = useMemo(
    () => filterModelPerformance(modelPerformanceRecords, filters),
    [filters],
  );

  const kpis = useMemo(() => deriveKpis(filtered), [filtered]);
  const avf = useMemo(() => actualVsForecastSeries(filtered), [filtered]);
  const errorTrend = useMemo(() => errorTrendSeries(filtered), [filtered]);
  const direction = useMemo(() => forecastDirection(filtered), [filtered]);
  const regionVol = useMemo(() => volumeByRegion(filtered), [filtered]);
  const pieShare = useMemo(() => pieShareByCategory(filtered), [filtered]);
  const polar = useMemo(() => polarVolumeByRegion(filtered), [filtered]);
  const bubbles = useMemo(() => bubbleActualVsForecast(filtered, 40), [filtered]);
  const funnel = useMemo(() => forecastFunnelStages(filtered), [filtered]);
  const modelRows = useMemo(() => aggregateModelPerformance(filteredModels), [filteredModels]);
  const radar = useMemo(() => modelRadarSeries(modelRows), [modelRows]);
  const mixedData = useMemo(
    () => (errorTrend.length ? errorTrend : avf),
    [errorTrend, avf],
  );

  const attention = useMemo(() => productsRequiringAttention(filtered), [filtered]);
  const overRows = useMemo(() => topOverForecast(filtered, 10), [filtered]);
  const underRows = useMemo(() => topUnderForecast(filtered, 10), [filtered]);
  const skuRows = useMemo(() => forecastBySku(filtered), [filtered]);
  const recommended = useMemo(() => recommendedQuantities(filtered), [filtered]);
  const insights = useMemo(() => generateInsights(filtered), [filtered]);

  const onChange = (key: keyof ForecastDashboardFilters, value: string) => {
    setFilters((prev) => applyFilterChange(prev, key, value));
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="mesh-card panel relative overflow-hidden p-5 md:p-6">
        <div className="hero-grid absolute inset-0 opacity-60" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">
              Forecast Dashboard
            </p>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
              Intelligent AutoML Sales Forecasting
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Area, Bar, Bubble, Doughnut, Pie, Line, Mixed, Polar Area, Radar and Funnel — driven by
              filtered Olist mock data.
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-surface/80 px-3.5 py-2.5 text-xs text-muted shadow-soft backdrop-blur">
            Corpus:{' '}
            <span className="font-mono font-semibold text-ink">
              {forecastRecords.length.toLocaleString()}
            </span>{' '}
            records
          </div>
        </div>
      </header>

      <FilterBar
        filters={filters}
        onChange={onChange}
        onReset={() => setFilters(defaultFilters())}
        matchCount={filtered.length}
      />

      <KpiCards kpis={kpis} />

      <div>
        <h2 className="font-display mb-3 text-lg font-bold text-ink">Charts</h2>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <AreaChartView data={avf} />
          <BarChartView data={regionVol} />
          <BubbleChartView data={bubbles} />
          <DoughnutChartView data={direction} />
          <PieChartView data={pieShare} />
          <LineChartView data={avf} />
          <MixedChartView data={mixedData} />
          <PolarAreaChartView data={polar} />
          <RadarChartView data={radar} models={modelRows.map((m) => m.model)} />
          <FunnelChartView data={funnel} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <h3 className="font-display text-base font-bold text-ink">Forecast Summary</h3>
          <p className="mb-3 text-xs text-muted">Derived from current filtered records</p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-canvas/70 p-3">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-muted">Actual</dt>
              <dd className="mt-1 font-mono font-bold text-ink">{formatNumber(kpis.actualSales)}</dd>
            </div>
            <div className="rounded-xl bg-canvas/70 p-3">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-muted">Forecast</dt>
              <dd className="mt-1 font-mono font-bold text-ink">{formatNumber(kpis.forecastSales)}</dd>
            </div>
            <div className="rounded-xl bg-canvas/70 p-3">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-muted">Accuracy</dt>
              <dd className="mt-1 font-mono font-bold text-ink">{formatPct(kpis.accuracy)}</dd>
            </div>
            <div className="rounded-xl bg-canvas/70 p-3">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-muted">Bias</dt>
              <dd className="mt-1 font-mono font-bold text-ink">{formatPct(kpis.bias)}</dd>
            </div>
          </dl>
        </div>
        <div className="panel p-5">
          <h3 className="font-display text-base font-bold text-ink">Forecast Insights</h3>
          <ul className="mt-2 space-y-2">
            {insights.map((line) => (
              <li
                key={line}
                className="flex gap-2 rounded-xl border border-border/50 bg-canvas/60 px-3 py-2.5 text-sm text-ink"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <AttentionTable rows={attention} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <OverForecastTable rows={overRows} />
        <UnderForecastTable rows={underRows} />
      </div>
      <ForecastBySkuTable rows={skuRows} />
      <RecommendedTable rows={recommended} />
      <ModelPerformanceTable rows={modelRows} />

      <p className="pb-4 text-center text-xs text-muted">
        Demo mode — all figures are simulated mock data filtered entirely in the browser.
      </p>
    </div>
  );
}
