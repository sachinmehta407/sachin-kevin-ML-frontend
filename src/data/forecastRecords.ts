import { PRODUCT_CATALOG } from './catalog';
import {
  ForecastRecord,
  MODELS,
  ModelPerformanceRecord,
  REGIONS,
  TEMPLATES,
} from '../types/forecast';

const MONTHS = [
  { date: '2025-07-01', month: 'Jul 25', future: false },
  { date: '2025-08-01', month: 'Aug 25', future: false },
  { date: '2025-09-01', month: 'Sep 25', future: false },
  { date: '2025-10-01', month: 'Oct 25', future: false },
  { date: '2025-11-01', month: 'Nov 25', future: false },
  { date: '2025-12-01', month: 'Dec 25', future: false },
  { date: '2026-01-01', month: 'Jan 26', future: false },
  { date: '2026-02-01', month: 'Feb 26', future: false },
  { date: '2026-03-01', month: 'Mar 26', future: false },
  { date: '2026-04-01', month: 'Apr 26', future: false },
  { date: '2026-05-01', month: 'May 26', future: false },
  { date: '2026-06-01', month: 'Jun 26', future: false },
  { date: '2026-07-01', month: 'Jul 26', future: true },
  { date: '2026-08-01', month: 'Aug 26', future: true },
  { date: '2026-09-01', month: 'Sep 26', future: true },
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

function baseDemand(category: string, sku: string): number {
  const catBase: Record<string, number> = {
    Rings: 420,
    Necklaces: 310,
    Earrings: 260,
    Bracelets: 230,
    Watches: 180,
  };
  return (catBase[category] ?? 250) + (hash(sku) % 90);
}

function seasonalFactor(monthIndex: number): number {
  // Peak Nov/Dec, soft mid-year
  const curve = [0.92, 0.95, 0.98, 1.02, 1.15, 1.28, 0.9, 0.93, 0.97, 1.05, 1.12, 1.08, 0.94, 0.96, 1.0];
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
  if (template === 'West Region' && region === 'West') return -0.02;
  if (template === 'High Value Products' && (category === 'Rings' || category === 'Watches')) return 0.01;
  if (template === 'Seasonal Products') return 0.015;
  return 0;
}

function preferredTemplate(region: string, category: string, sku: string): string {
  const n = hash(`${sku}-${region}`) % 10;
  if (region === 'West' && n < 3) return 'West Region';
  if ((category === 'Rings' || category === 'Watches') && n < 5) return 'High Value Products';
  if (n < 7) return 'Default Forecast';
  return 'Seasonal Products';
}

function preferredModel(category: string, sku: string): string {
  const n = hash(`${category}-${sku}`) % MODELS.length;
  return MODELS[n];
}

export function generateForecastRecords(): ForecastRecord[] {
  const records: ForecastRecord[] = [];

  for (const item of PRODUCT_CATALOG) {
    for (const sku of item.skus) {
      for (const region of REGIONS) {
        const model = preferredModel(item.category, sku);
        const template = preferredTemplate(region, item.category, sku);
        const base = baseDemand(item.category, sku);
        const regionMul: Record<string, number> = {
          North: 1.05,
          South: 0.92,
          East: 0.98,
          West: 1.12,
        };

        MONTHS.forEach((m, mi) => {
          const noise = (unit(`${sku}-${region}-${m.date}-a`) - 0.5) * 0.12;
          const actualRaw = Math.round(base * (regionMul[region] ?? 1) * seasonalFactor(mi) * (1 + noise));
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
            status: m.future ? 'Draft' : unit(`${sku}-${m.date}`) > 0.7 ? 'Pending Review' : 'Approved',
          });
        });
      }
    }
  }

  return records;
}

export const forecastRecords: ForecastRecord[] = generateForecastRecords();

export const DEFAULT_DATE_FROM = '2025-07-01';
export const DEFAULT_DATE_TO = '2026-09-01';

export const modelPerformanceRecords: ModelPerformanceRecord[] = (() => {
  const rows: ModelPerformanceRecord[] = [];
  for (const model of MODELS) {
    for (const category of [...new Set(PRODUCT_CATALOG.map((p) => p.category))]) {
      for (const region of REGIONS) {
        for (const template of TEMPLATES) {
          const seed = `${model}-${category}-${region}-${template}`;
          const wape = 6 + unit(seed) * 12 + (model === 'Seasonal Naive' ? 4 : 0) - (model === 'XGBoost' ? 2 : 0);
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
