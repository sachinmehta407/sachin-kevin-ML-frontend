import { ForecastRecord, ModelPerformanceRecord, TOLERANCE_PCT } from '../types/forecast';

export interface DashboardKpis {
  actualSales: number;
  forecastSales: number;
  accuracy: number | null;
  bias: number | null;
  overForecastPct: number | null;
  underForecastPct: number | null;
  evaluatedCount: number;
  withinTolerance: number;
  overCount: number;
  underCount: number;
  wape: number | null;
}

export interface MonthSeriesPoint {
  month: string;
  date: string;
  actual: number | null;
  forecast: number;
  errorPct: number | null;
  wape: number | null;
}

export interface NamedAccuracy {
  name: string;
  wape: number;
  accuracy: number;
  actual: number;
  forecast: number;
}

export interface DirectionSlice {
  name: string;
  value: number;
}

export interface SkuRow {
  sku: string;
  product: string;
  category: string;
  region: string;
  actual: number;
  forecast: number;
  variance: number;
  errorPct: number | null;
  recommendedQuantity: number;
  model: string;
  template: string;
  status: string;
}

export interface AttentionRow extends SkuRow {
  biasDirection: 'Over' | 'Under' | 'Within';
}

function safeDiv(num: number, den: number): number | null {
  if (!den || !Number.isFinite(den)) return null;
  return num / den;
}

export function evaluatedRecords(records: ForecastRecord[]): ForecastRecord[] {
  return records.filter((r) => r.actual !== null && r.actual !== undefined);
}

export function futureRecords(records: ForecastRecord[]): ForecastRecord[] {
  return records.filter((r) => r.actual === null);
}

export function deriveKpis(records: ForecastRecord[]): DashboardKpis {
  const evaluated = evaluatedRecords(records);
  const actualSales = evaluated.reduce((s, r) => s + (r.actual ?? 0), 0);
  const forecastSalesEval = evaluated.reduce((s, r) => s + r.forecast, 0);
  const forecastSalesAll = records.reduce((s, r) => s + r.forecast, 0);

  const absErr = evaluated.reduce((s, r) => s + Math.abs((r.actual ?? 0) - r.forecast), 0);
  const absActual = evaluated.reduce((s, r) => s + Math.abs(r.actual ?? 0), 0);
  const wapeRatio = safeDiv(absErr, absActual);
  const wape = wapeRatio === null ? null : wapeRatio * 100;
  const accuracy = wape === null ? null : 100 - wape;

  const biasRatio = safeDiv(
    evaluated.reduce((s, r) => s + (r.forecast - (r.actual ?? 0)), 0),
    actualSales,
  );
  const bias = biasRatio === null ? null : biasRatio * 100;

  let overCount = 0;
  let underCount = 0;
  let withinTolerance = 0;

  for (const r of evaluated) {
    const actual = r.actual ?? 0;
    if (actual === 0) {
      if (r.forecast > 0) overCount++;
      else withinTolerance++;
      continue;
    }
    const errPct = (Math.abs(r.forecast - actual) / Math.abs(actual)) * 100;
    if (errPct <= TOLERANCE_PCT) withinTolerance++;
    else if (r.forecast > actual) overCount++;
    else underCount++;
  }

  const n = evaluated.length;
  return {
    actualSales,
    forecastSales: forecastSalesEval || forecastSalesAll,
    accuracy,
    bias,
    overForecastPct: n ? (overCount / n) * 100 : null,
    underForecastPct: n ? (underCount / n) * 100 : null,
    evaluatedCount: n,
    withinTolerance,
    overCount,
    underCount,
    wape,
  };
}

function groupByMonth(records: ForecastRecord[]): Map<string, ForecastRecord[]> {
  const map = new Map<string, ForecastRecord[]>();
  for (const r of records) {
    const key = `${r.date}|${r.month}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export function actualVsForecastSeries(records: ForecastRecord[]): MonthSeriesPoint[] {
  const points: MonthSeriesPoint[] = [];
  for (const [key, rows] of groupByMonth(records)) {
    const [date, month] = key.split('|');
    const evaluated = evaluatedRecords(rows);
    const actualSum = evaluated.length
      ? evaluated.reduce((s, r) => s + (r.actual ?? 0), 0)
      : null;
    const forecast = rows.reduce((s, r) => s + r.forecast, 0);
    let wape: number | null = null;
    let errorPct: number | null = null;
    if (evaluated.length) {
      const absErr = evaluated.reduce((s, r) => s + Math.abs((r.actual ?? 0) - r.forecast), 0);
      const absAct = evaluated.reduce((s, r) => s + Math.abs(r.actual ?? 0), 0);
      const ratio = safeDiv(absErr, absAct);
      wape = ratio === null ? null : ratio * 100;
      errorPct = wape;
    }
    points.push({ month, date, actual: actualSum, forecast, errorPct, wape });
  }
  return points;
}

export function futureForecastSeries(records: ForecastRecord[]): MonthSeriesPoint[] {
  return actualVsForecastSeries(futureRecords(records)).map((p) => ({
    ...p,
    actual: null,
  }));
}

export function accuracyByDimension(
  records: ForecastRecord[],
  dim: 'category' | 'region',
): NamedAccuracy[] {
  const map = new Map<string, ForecastRecord[]>();
  for (const r of evaluatedRecords(records)) {
    const key = r[dim];
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  const out: NamedAccuracy[] = [];
  for (const [name, rows] of map) {
    const actual = rows.reduce((s, r) => s + (r.actual ?? 0), 0);
    const forecast = rows.reduce((s, r) => s + r.forecast, 0);
    const absErr = rows.reduce((s, r) => s + Math.abs((r.actual ?? 0) - r.forecast), 0);
    const absAct = rows.reduce((s, r) => s + Math.abs(r.actual ?? 0), 0);
    const ratio = safeDiv(absErr, absAct);
    const wape = ratio === null ? 0 : ratio * 100;
    out.push({
      name,
      wape: Number(wape.toFixed(1)),
      accuracy: Number((100 - wape).toFixed(1)),
      actual,
      forecast,
    });
  }
  return out.sort((a, b) => b.accuracy - a.accuracy);
}

export function forecastDirection(records: ForecastRecord[]): DirectionSlice[] {
  const k = deriveKpis(records);
  return [
    { name: 'Within Tolerance', value: k.withinTolerance },
    { name: 'Over Forecast', value: k.overCount },
    { name: 'Under Forecast', value: k.underCount },
  ];
}

export function errorTrendSeries(records: ForecastRecord[]): MonthSeriesPoint[] {
  return actualVsForecastSeries(evaluatedRecords(records)).filter((p) => p.wape !== null);
}

function aggregateSkuRows(records: ForecastRecord[]): SkuRow[] {
  const map = new Map<string, ForecastRecord[]>();
  for (const r of evaluatedRecords(records)) {
    const key = `${r.sku}|${r.region}|${r.model}|${r.template}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  const rows: SkuRow[] = [];
  for (const [, group] of map) {
    const sample = group[0];
    const actual = group.reduce((s, r) => s + (r.actual ?? 0), 0);
    const forecast = group.reduce((s, r) => s + r.forecast, 0);
    const variance = forecast - actual;
    const errorPct = actual === 0 ? null : (Math.abs(variance) / Math.abs(actual)) * 100;
    const recommendedQuantity = Math.round(
      group.reduce((s, r) => s + (r.recommendedQuantity ?? r.forecast), 0) / group.length,
    );
    rows.push({
      sku: sample.sku,
      product: sample.product,
      category: sample.category,
      region: sample.region,
      actual,
      forecast,
      variance,
      errorPct,
      recommendedQuantity,
      model: sample.model,
      template: sample.template,
      status: sample.status,
    });
  }
  return rows;
}

export function productsRequiringAttention(records: ForecastRecord[], limit = 8): AttentionRow[] {
  return aggregateSkuRows(records)
    .map((r) => {
      let biasDirection: AttentionRow['biasDirection'] = 'Within';
      if (r.errorPct !== null && r.errorPct > TOLERANCE_PCT) {
        biasDirection = r.variance > 0 ? 'Over' : 'Under';
      }
      return { ...r, biasDirection };
    })
    .sort((a, b) => (b.errorPct ?? 0) - (a.errorPct ?? 0))
    .slice(0, limit);
}

export function topOverForecast(records: ForecastRecord[], limit = 5): SkuRow[] {
  return aggregateSkuRows(records)
    .filter((r) => r.variance > 0)
    .sort((a, b) => b.variance - a.variance)
    .slice(0, limit);
}

export function topUnderForecast(records: ForecastRecord[], limit = 5): SkuRow[] {
  return aggregateSkuRows(records)
    .filter((r) => r.variance < 0)
    .sort((a, b) => a.variance - b.variance)
    .slice(0, limit);
}

export function forecastBySku(records: ForecastRecord[], limit = 20): SkuRow[] {
  return aggregateSkuRows(records)
    .sort((a, b) => b.forecast - a.forecast)
    .slice(0, limit);
}

export function topSkusByForecast(
  records: ForecastRecord[],
  limit = 10,
): Array<{ name: string; forecast: number; actual: number }> {
  return forecastBySku(records, limit).map((r) => ({
    name: r.sku,
    forecast: Math.round(r.forecast),
    actual: Math.round(r.actual),
  }));
}

export function topProductsByActual(
  records: ForecastRecord[],
  limit = 10,
): Array<{ name: string; actual: number; forecast: number }> {
  const map = new Map<string, { actual: number; forecast: number }>();
  for (const r of evaluatedRecords(records)) {
    const cur = map.get(r.product) ?? { actual: 0, forecast: 0 };
    cur.actual += r.actual ?? 0;
    cur.forecast += r.forecast;
    map.set(r.product, cur);
  }
  return [...map.entries()]
    .map(([name, v]) => ({
      name: name.length > 18 ? `${name.slice(0, 16)}…` : name,
      actual: Math.round(v.actual),
      forecast: Math.round(v.forecast),
    }))
    .sort((a, b) => b.actual - a.actual)
    .slice(0, limit);
}

export function volumeByRegion(
  records: ForecastRecord[],
): Array<{ name: string; actual: number; forecast: number }> {
  const map = new Map<string, { actual: number; forecast: number }>();
  for (const r of records) {
    const cur = map.get(r.region) ?? { actual: 0, forecast: 0 };
    if (r.actual != null) cur.actual += r.actual;
    cur.forecast += r.forecast;
    map.set(r.region, cur);
  }
  return [...map.entries()]
    .map(([name, v]) => ({
      name,
      actual: Math.round(v.actual),
      forecast: Math.round(v.forecast),
    }))
    .sort((a, b) => b.forecast - a.forecast);
}

export function volumeByCategory(
  records: ForecastRecord[],
): Array<{ name: string; actual: number; forecast: number; gap: number }> {
  const map = new Map<string, { actual: number; forecast: number }>();
  for (const r of records) {
    const cur = map.get(r.category) ?? { actual: 0, forecast: 0 };
    if (r.actual != null) cur.actual += r.actual;
    cur.forecast += r.forecast;
    map.set(r.category, cur);
  }
  return [...map.entries()]
    .map(([name, v]) => ({
      name,
      actual: Math.round(v.actual),
      forecast: Math.round(v.forecast),
      gap: Math.round(v.forecast - v.actual),
    }))
    .sort((a, b) => b.forecast - a.forecast);
}

export function scatterActualVsForecast(
  records: ForecastRecord[],
  limit = 80,
): Array<{ actual: number; forecast: number; sku: string }> {
  return evaluatedRecords(records)
    .map((r) => ({
      actual: Math.round(r.actual ?? 0),
      forecast: Math.round(r.forecast),
      sku: r.sku,
    }))
    .sort((a, b) => b.actual - a.actual)
    .slice(0, limit);
}

export function bubbleActualVsForecast(
  records: ForecastRecord[],
  limit = 40,
): Array<{ actual: number; forecast: number; size: number; sku: string; product: string }> {
  return evaluatedRecords(records)
    .map((r) => {
      const actual = r.actual ?? 0;
      const err = actual === 0 ? Math.abs(r.forecast) : Math.abs(r.forecast - actual);
      return {
        actual: Math.round(actual),
        forecast: Math.round(r.forecast),
        size: Math.max(80, Math.round(err + actual * 0.05)),
        sku: r.sku,
        product: r.product,
      };
    })
    .sort((a, b) => b.size - a.size)
    .slice(0, limit);
}

export function pieShareByCategory(
  records: ForecastRecord[],
): Array<{ name: string; value: number }> {
  const map = new Map<string, number>();
  for (const r of records) {
    map.set(r.category, (map.get(r.category) ?? 0) + r.forecast);
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);
}

export function polarVolumeByRegion(
  records: ForecastRecord[],
): Array<{ name: string; value: number; fill: string }> {
  const fills = ['#5346D3', '#2563EB', '#0B8F82', '#B86E08', '#D44545', '#C23A8A'];
  return volumeByRegion(records).map((r, i) => ({
    name: r.name,
    value: r.forecast,
    fill: fills[i % fills.length],
  }));
}

export function forecastFunnelStages(
  records: ForecastRecord[],
): Array<{ name: string; value: number; fill: string }> {
  const kpis = deriveKpis(records);
  const totalForecast = Math.round(records.reduce((s, r) => s + r.forecast, 0));
  const evaluated = Math.round(kpis.forecastSales);
  const within = Math.round(
    evaluatedRecords(records)
      .filter((r) => {
        const a = r.actual ?? 0;
        if (!a) return r.forecast === 0;
        return (Math.abs(r.forecast - a) / Math.abs(a)) * 100 <= TOLERANCE_PCT;
      })
      .reduce((s, r) => s + r.forecast, 0),
  );
  const recommended = Math.round(
    recommendedQuantities(records, 50).reduce((s, r) => s + r.recommendedQuantity, 0),
  );
  return [
    { name: 'Total forecast', value: Math.max(totalForecast, 1), fill: '#5346D3' },
    { name: 'Evaluated periods', value: Math.max(evaluated, 1), fill: '#2563EB' },
    { name: 'Within ±10%', value: Math.max(within, 1), fill: '#0B8F82' },
    { name: 'Recommended qty', value: Math.max(recommended, 1), fill: '#B86E08' },
  ];
}

export function modelRadarSeries(
  models: Array<{ model: string; wape: number; mape: number; rmse: number; bias: number }>,
): Array<Record<string, string | number>> {
  if (!models.length) return [];
  const maxRmse = Math.max(...models.map((m) => m.rmse), 1);
  return [
    {
      metric: 'Accuracy',
      ...Object.fromEntries(models.map((m) => [m.model, Math.max(0, 100 - m.wape)])),
    },
    {
      metric: 'Low WAPE',
      ...Object.fromEntries(models.map((m) => [m.model, Math.max(0, 100 - m.wape)])),
    },
    {
      metric: 'Low MAPE',
      ...Object.fromEntries(models.map((m) => [m.model, Math.max(0, 100 - m.mape)])),
    },
    {
      metric: 'Low RMSE',
      ...Object.fromEntries(
        models.map((m) => [m.model, Math.max(0, 100 - (m.rmse / maxRmse) * 100)]),
      ),
    },
    {
      metric: 'Bias control',
      ...Object.fromEntries(models.map((m) => [m.model, Math.max(0, 100 - Math.abs(m.bias) * 8)])),
    },
  ];
}

export function topErrorSkus(
  records: ForecastRecord[],
  limit = 10,
): Array<{ name: string; errorPct: number; variance: number }> {
  return aggregateSkuRows(records)
    .filter((r) => r.errorPct != null)
    .sort((a, b) => (b.errorPct ?? 0) - (a.errorPct ?? 0))
    .slice(0, limit)
    .map((r) => ({
      name: r.sku,
      errorPct: Number((r.errorPct ?? 0).toFixed(1)),
      variance: Math.round(r.variance),
    }));
}

export function biasByCategory(
  records: ForecastRecord[],
): Array<{ name: string; bias: number }> {
  const map = new Map<string, { err: number; actual: number }>();
  for (const r of evaluatedRecords(records)) {
    const cur = map.get(r.category) ?? { err: 0, actual: 0 };
    cur.err += r.forecast - (r.actual ?? 0);
    cur.actual += Math.abs(r.actual ?? 0);
    map.set(r.category, cur);
  }
  return [...map.entries()]
    .map(([name, v]) => ({
      name,
      bias: v.actual ? Number(((v.err / v.actual) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => Math.abs(b.bias) - Math.abs(a.bias));
}

export function recommendedQuantities(records: ForecastRecord[], limit = 12): SkuRow[] {
  const map = new Map<string, ForecastRecord[]>();
  for (const r of records) {
    const key = `${r.sku}|${r.region}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  const rows: SkuRow[] = [];
  for (const [, group] of map) {
    const latest = [...group].sort((a, b) => b.date.localeCompare(a.date))[0];
    const evaluated = evaluatedRecords(group);
    const actual = evaluated.reduce((s, r) => s + (r.actual ?? 0), 0);
    const forecast = group.reduce((s, r) => s + r.forecast, 0);
    rows.push({
      sku: latest.sku,
      product: latest.product,
      category: latest.category,
      region: latest.region,
      actual,
      forecast,
      variance: forecast - actual,
      errorPct: actual === 0 ? null : (Math.abs(forecast - actual) / Math.abs(actual)) * 100,
      recommendedQuantity: latest.recommendedQuantity ?? latest.forecast,
      model: latest.model,
      template: latest.template,
      status: latest.status,
    });
  }
  return rows.sort((a, b) => b.recommendedQuantity - a.recommendedQuantity).slice(0, limit);
}

export function aggregateModelPerformance(
  records: ModelPerformanceRecord[],
): Array<{ model: string; wape: number; mape: number; rmse: number; bias: number }> {
  const map = new Map<string, ModelPerformanceRecord[]>();
  for (const r of records) {
    if (!map.has(r.model)) map.set(r.model, []);
    map.get(r.model)!.push(r);
  }
  return [...map.entries()]
    .map(([model, rows]) => {
      const n = rows.length || 1;
      return {
        model,
        wape: Number((rows.reduce((s, r) => s + r.wape, 0) / n).toFixed(1)),
        mape: Number((rows.reduce((s, r) => s + r.mape, 0) / n).toFixed(1)),
        rmse: Number((rows.reduce((s, r) => s + r.rmse, 0) / n).toFixed(1)),
        bias: Number((rows.reduce((s, r) => s + r.bias, 0) / n).toFixed(1)),
      };
    })
    .sort((a, b) => a.wape - b.wape);
}

export function generateInsights(records: ForecastRecord[]): string[] {
  const insights: string[] = [];
  const kpis = deriveKpis(records);
  if (kpis.accuracy !== null) {
    insights.push(`Filtered view accuracy is ${kpis.accuracy.toFixed(1)}% (100 − WAPE).`);
  }

  const byCat = accuracyByDimension(records, 'category');
  if (byCat.length) {
    insights.push(`${byCat[0].name} leads categories at ${byCat[0].accuracy.toFixed(1)}% accuracy.`);
  }

  const byRegion = accuracyByDimension(records, 'region');
  if (byRegion.length) {
    insights.push(`${byRegion[0].name} is the strongest region in this filtered view (${byRegion[0].accuracy.toFixed(1)}%).`);
  }

  if (kpis.overCount) {
    insights.push(`${kpis.overCount} evaluated series are over forecast beyond ±${TOLERANCE_PCT}% tolerance.`);
  }

  const attention = productsRequiringAttention(records, 1);
  if (attention[0]?.errorPct != null) {
    insights.push(
      `${attention[0].sku} has the highest forecast error (${attention[0].errorPct.toFixed(1)}%).`,
    );
  }

  if (!insights.length) {
    insights.push('No evaluated records in the current filter selection.');
  }
  return insights.slice(0, 5);
}

export function formatNumber(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function formatPct(n: number | null, digits = 1): string {
  if (n === null || Number.isNaN(n)) return '—';
  return `${n.toFixed(digits)}%`;
}
