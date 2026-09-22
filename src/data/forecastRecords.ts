import { PRODUCT_CATALOG } from './catalog';
import { olistSalesFacts } from './olist';
import {
  ForecastRecord,
  MODELS,
  ModelPerformanceRecord,
  REGIONS,
  TEMPLATES,
} from '../types/forecast';

const MONTHS = [
  { date: '2017-07-01', month: 'Jul 17', future: false },
  { date: '2017-08-01', month: 'Aug 17', future: false },
  { date: '2017-09-01', month: 'Sep 17', future: false },
  { date: '2017-10-01', month: 'Oct 17', future: false },
  { date: '2017-11-01', month: 'Nov 17', future: false },
  { date: '2017-12-01', month: 'Dec 17', future: false },
  { date: '2018-01-01', month: 'Jan 18', future: false },
  { date: '2018-02-01', month: 'Feb 18', future: false },
  { date: '2018-03-01', month: 'Mar 18', future: false },
  { date: '2018-04-01', month: 'Apr 18', future: false },
  { date: '2018-05-01', month: 'May 18', future: false },
  { date: '2018-06-01', month: 'Jun 18', future: false },
  { date: '2018-07-01', month: 'Jul 18', future: false },
  { date: '2018-08-01', month: 'Aug 18', future: false },
  { date: '2018-09-01', month: 'Sep 18', future: true },
  { date: '2018-10-01', month: 'Oct 18', future: true },
  { date: '2018-11-01', month: 'Nov 18', future: true },
];

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function unit(seed: string): number {
  return (hash(seed) % 10000) / 10000;
}

/** Average Olist item price by category — anchors mock demand */
const categoryAvgPrice = (() => {
  const sums = new Map<string, { total: number; n: number }>();
  for (const fact of olistSalesFacts) {
    const cur = sums.get(fact.category) ?? { total: 0, n: 0 };
    cur.total += fact.price;
    cur.n += 1;
    sums.set(fact.category, cur);
  }
  const out: Record<string, number> = {};
  for (const [cat, { total, n }] of sums) out[cat] = total / Math.max(1, n);
  return out;
})();

function baseDemand(category: string, sku: string): number {
  const avg = categoryAvgPrice[category] ?? 120;
  // Convert BRL ticket size into a monthly unit demand scale
  return Math.max(8, Math.round(avg / 8 + (hash(sku) % 40)));
}

function seasonalFactor(monthIndex: number): number {
  // Brazil retail: soft mid-year, stronger Nov (Black Friday) / Dec / Mother's Day (May)
  const curve = [
    0.92, 0.95, 0.98, 1.05, 1.18, 1.35, 0.95, 0.98, 1.02, 1.08, 1.14, 1.1, 0.96, 0.98, 1.04, 1.12,
    1.22,
  ];
  return curve[monthIndex] ?? 1;
}

function modelBias(model: string): number {
  const map: Record<string, number> = {
    SARIMA: 0.02,
    'Holt-Winters': -0.01,
    XGBoost: 0.005,
    'Random Forest': 0.03,
    'Seasonal Naive': -0.04,
  };
  return map[model] ?? 0;
}

function templateBias(template: string, region: string, category: string): number {
  if (template === 'Southeast Focus' && region === 'Southeast') return -0.02;
  if (
    template === 'High Value Products' &&
    (category.includes('Watch') || category.includes('Computer') || category.includes('Health'))
  ) {
    return 0.01;
  }
  if (template === 'Seasonal Products') return 0.015;
  return 0;
}

function preferredTemplate(region: string, category: string, sku: string): string {
  const n = hash(`${sku}-${region}`) % 10;
  if (region === 'Southeast' && n < 3) return 'Southeast Focus';
  if (
    (category.includes('Watch') || category.includes('Computer') || category.includes('Health')) &&
    n < 5
  ) {
    return 'High Value Products';
  }
  if (n < 7) return 'Default Forecast';
  return 'Seasonal Products';
}

function preferredModel(category: string, sku: string): string {
  const n = hash(`${category}-${sku}`) % MODELS.length;
  return MODELS[n];
}

export function generateForecastRecords(): ForecastRecord[] {
  const records: ForecastRecord[] = [];
  const regionMul: Record<string, number> = {
    Southeast: 1.18,
    South: 0.95,
    Northeast: 0.88,
    North: 0.72,
    'Central-West': 0.8,
  };

  // Prefer SKUs that appear in Olist order_items; fall back to full catalog
  const activeSkus = new Set(olistSalesFacts.map((f) => f.sku));
  const catalog =
    activeSkus.size > 0
      ? PRODUCT_CATALOG.filter((p) => p.skus.some((s) => activeSkus.has(s)))
      : PRODUCT_CATALOG;

  for (const item of catalog) {
    for (const sku of item.skus) {
      for (const region of REGIONS) {
        const model = preferredModel(item.category, sku);
        const template = preferredTemplate(region, item.category, sku);
        const base = baseDemand(item.category, sku);

        MONTHS.forEach((m, mi) => {
          const noise = (unit(`${sku}-${region}-${m.date}-a`) - 0.5) * 0.12;
          const actualRaw = Math.round(
            base * (regionMul[region] ?? 1) * seasonalFactor(mi) * (1 + noise),
          );
          const bias =
            modelBias(model) +
            templateBias(template, region, item.category) +
            (unit(`${sku}-${region}-${m.date}-b`) - 0.5) * 0.08;
          const forecast = Math.max(1, Math.round(actualRaw * (1 + bias) * (m.future ? 1.03 : 1)));
          const actual = m.future ? null : actualRaw;
          const band = Math.round(forecast * 0.08);

          records.push({
            date: m.date,
            month: m.month,
            category: item.category,
            product: item.product,
            sku,
            region,
            model,
            template,
            actual,
            forecast,
            lowerBound: forecast - band,
            upperBound: forecast + band,
            recommendedQuantity: Math.round(forecast * 0.98),
            forecastSource: template === 'Default Forecast' ? 'Default Template' : template,
            status: m.future
              ? 'Draft'
              : unit(`${sku}-${m.date}`) > 0.7
                ? 'Pending Review'
                : 'Approved',
          });
        });
      }
    }
  }

  return records;
}

export const forecastRecords: ForecastRecord[] = generateForecastRecords();

export const DEFAULT_DATE_FROM = '2017-07-01';
export const DEFAULT_DATE_TO = '2018-11-01';

export const modelPerformanceRecords: ModelPerformanceRecord[] = (() => {
  const rows: ModelPerformanceRecord[] = [];
  const categories = [...new Set(PRODUCT_CATALOG.map((p) => p.category))];
  for (const model of MODELS) {
    for (const category of categories) {
      for (const region of REGIONS) {
        for (const template of TEMPLATES) {
          const seed = `${model}-${category}-${region}-${template}`;
          const wape =
            6 +
            unit(seed) * 12 +
            (model === 'Seasonal Naive' ? 4 : 0) -
            (model === 'XGBoost' ? 2 : 0);
          const mape = wape + 0.8 + unit(seed + 'm') * 2;
          const rmse = 18 + unit(seed + 'r') * 40;
          const bias = (unit(seed + 'b') - 0.5) * 8 + modelBias(model) * 100;
          rows.push({
            model,
            category,
            region,
            template,
            wape: Number(wape.toFixed(1)),
            mape: Number(mape.toFixed(1)),
            rmse: Number(rmse.toFixed(1)),
            bias: Number(bias.toFixed(1)),
          });
        }
      }
    }
  }
  return rows;
})();
