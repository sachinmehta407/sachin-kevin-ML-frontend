import { PRODUCT_CATALOG } from './catalog';
import { olistSalesFacts } from './olist';
import type {
  ForecastTemplate,
  JewelleryCategory,
  JewelleryCity,
  JewelleryRegion,
  JewellerySku,
  TemplateScope,
} from '../types/jewellery';

const TEMPLATE_CATEGORIES: JewelleryCategory[] = [
  'Health Beauty',
  'Housewares',
  'Furniture Decor',
  'Stationery',
  'Bed Bath Table',
  'Computers Accessories',
  'Sports Leisure',
  'Garden Tools',
];

const REGIONS: JewelleryRegion[] = [
  'Southeast',
  'South',
  'Northeast',
  'North',
  'Central-West',
];

const CITIES: JewelleryCity[] = [
  'Sao Paulo',
  'Rio De Janeiro',
  'Curitiba',
  'Belo Horizonte',
  'Brasilia',
  'Niteroi',
];

const CATEGORY_PLAN: Array<{ category: JewelleryCategory; baselineAccuracy: number }> = [
  { category: 'Health Beauty', baselineAccuracy: 81 },
  { category: 'Housewares', baselineAccuracy: 84 },
  { category: 'Furniture Decor', baselineAccuracy: 79 },
  { category: 'Stationery', baselineAccuracy: 86 },
  { category: 'Bed Bath Table', baselineAccuracy: 82 },
  { category: 'Computers Accessories', baselineAccuracy: 77 },
  { category: 'Sports Leisure', baselineAccuracy: 80 },
  { category: 'Garden Tools', baselineAccuracy: 83 },
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function asTemplateCategory(category: string): JewelleryCategory | null {
  return TEMPLATE_CATEGORIES.includes(category as JewelleryCategory)
    ? (category as JewelleryCategory)
    : null;
}

/** SKU corpus from Olist products (template-lab categories only) */
export function buildJewelleryCorpus(): JewellerySku[] {
  const regionBySku = new Map<string, { region: JewelleryRegion; city: JewelleryCity }>();
  for (const fact of olistSalesFacts) {
    if (!regionBySku.has(fact.sku)) {
      regionBySku.set(fact.sku, {
        region: (REGIONS.includes(fact.region as JewelleryRegion)
          ? fact.region
          : 'Southeast') as JewelleryRegion,
        city: (CITIES.includes(fact.city as JewelleryCity)
          ? fact.city
          : CITIES[hash(fact.sku) % CITIES.length]) as JewelleryCity,
      });
    }
  }

  const rows: JewellerySku[] = [];
  for (const item of PRODUCT_CATALOG) {
    const category = asTemplateCategory(item.category);
    if (!category) continue;
    for (const sku of item.skus) {
      const geo = regionBySku.get(sku) ?? {
        region: REGIONS[hash(sku) % REGIONS.length],
        city: CITIES[hash(sku) % CITIES.length],
      };
      rows.push({
        sku,
        product: item.product,
        category,
        region: geo.region,
        city: geo.city,
      });
    }
  }

  // Guarantee coverage if Olist sample is thin for a category
  if (rows.length < 24) {
    for (const plan of CATEGORY_PLAN) {
      for (let i = 1; i <= 8; i++) {
        const sku = `${plan.category.slice(0, 2).toUpperCase()}-${String(i).padStart(3, '0')}`;
        rows.push({
          sku,
          product: `${plan.category} · ${sku}`,
          category: plan.category,
          region: REGIONS[hash(sku) % REGIONS.length],
          city: CITIES[hash(sku) % CITIES.length],
        });
      }
    }
  }

  return rows;
}

export const jewelleryCorpus = buildJewelleryCorpus();

export const jewelleryCategoryStats = CATEGORY_PLAN.map((p) => ({
  category: p.category,
  skus: jewelleryCorpus.filter((s) => s.category === p.category).length,
  baselineAccuracy: p.baselineAccuracy,
  template: 'Default Template',
}));

export function scopeLabel(scope: TemplateScope): string {
  const parts: string[] = [];
  if (scope.categories?.length) parts.push(`Category = ${scope.categories.join(', ')}`);
  if (scope.regions?.length) parts.push(`Region = ${scope.regions.join(', ')}`);
  if (scope.cities?.length) parts.push(`City = ${scope.cities.join(', ')}`);
  if (scope.skus?.length)
    parts.push(
      `SKU = ${scope.skus.slice(0, 4).join(', ')}${scope.skus.length > 4 ? '…' : ''}`,
    );
  return parts.length ? parts.join(' AND ') : 'All SKUs (full population)';
}

export function isFullPopulation(scope: TemplateScope): boolean {
  return (
    !scope.categories?.length &&
    !scope.regions?.length &&
    !scope.cities?.length &&
    !scope.skus?.length
  );
}

export function matchScope(sku: JewellerySku, scope: TemplateScope): boolean {
  if (isFullPopulation(scope)) return true;
  if (scope.skus?.length && !scope.skus.includes(sku.sku)) return false;
  if (scope.categories?.length && !scope.categories.includes(sku.category)) return false;
  if (scope.regions?.length && !scope.regions.includes(sku.region)) return false;
  if (scope.cities?.length && !scope.cities.includes(sku.city)) return false;
  return true;
}

export function countSkusInScope(scope: TemplateScope, corpus = jewelleryCorpus): number {
  return corpus.filter((s) => matchScope(s, scope)).length;
}

export function baselineAccuracyForSku(sku: JewellerySku): number {
  return CATEGORY_PLAN.find((p) => p.category === sku.category)?.baselineAccuracy ?? 80;
}

export function forecastQtyForSku(sku: JewellerySku, accuracy: number): number {
  const base = 40 + (hash(sku.sku) % 220);
  return Math.round(base * (0.85 + accuracy / 500));
}

const healthSkus = jewelleryCorpus
  .filter((s) => s.category === 'Health Beauty')
  .map((s) => s.sku)
  .slice(0, 3);

/** Seed templates matching the Olist Brazilian e-commerce narrative */
export const seedForecastTemplates: ForecastTemplate[] = [
  {
    id: 'tpl-default',
    name: 'Template 1 — Default AutoML',
    description: `Baseline AutoML on all ${jewelleryCorpus.length} Olist SKUs. Full workflow: Data → Processing → Features → Models → Train → Evaluate → Predict.`,
    isBaseline: true,
    scope: {},
    models: ['XGBoost', 'LightGBM', 'SARIMA'],
    status: 'approved',
    accuracy: 83,
    skuCount: jewelleryCorpus.length,
    priority: 0,
    createdAt: '2018-07-01',
  },
  {
    id: 'tpl-health',
    name: 'Template 2 — Improve Health Beauty',
    description: 'Scoped experiment: Category = Health Beauty. Lift accuracy on a volatile Olist category.',
    isBaseline: false,
    scope: { categories: ['Health Beauty'] },
    models: ['XGBoost', 'Prophet', 'TFT'],
    status: 'approved',
    accuracy: 88,
    skuCount: countSkusInScope({ categories: ['Health Beauty'] }),
    priority: 20,
    createdAt: '2018-07-10',
  },
  {
    id: 'tpl-sao-paulo',
    name: 'Template 3 — Sao Paulo focus',
    description: 'Scoped experiment: City = Sao Paulo (largest Olist demand pocket).',
    isBaseline: false,
    scope: { cities: ['Sao Paulo'] },
    models: ['LightGBM', 'XGBoost'],
    status: 'draft',
    accuracy: null,
    skuCount: countSkusInScope({ cities: ['Sao Paulo'] }),
    priority: 30,
    createdAt: '2018-07-12',
  },
  {
    id: 'tpl-health-skus',
    name: 'Template 4 — High-value Health Beauty SKUs',
    description: `Scoped experiment: SKU = ${healthSkus.join(', ') || 'top Health Beauty'}.`,
    isBaseline: false,
    scope: { skus: healthSkus.length ? healthSkus : ['HB-001', 'HB-002', 'HB-003'] },
    models: ['XGBoost'],
    status: 'draft',
    accuracy: null,
    skuCount: healthSkus.length || 3,
    priority: 40,
    createdAt: '2018-07-14',
  },
  {
    id: 'tpl-computers-sp',
    name: 'Template 5 — Computers Accessories in Sao Paulo',
    description: 'Scoped experiment: Category = Computers Accessories AND City = Sao Paulo.',
    isBaseline: false,
    scope: { categories: ['Computers Accessories'], cities: ['Sao Paulo'] },
    models: ['LightGBM', 'SARIMA'],
    status: 'draft',
    accuracy: null,
    skuCount: countSkusInScope({
      categories: ['Computers Accessories'],
      cities: ['Sao Paulo'],
    }),
    priority: 35,
    createdAt: '2018-07-15',
  },
  {
    id: 'tpl-south-houseware',
    name: 'Template 6 — South Housewares',
    description: 'Scoped experiment: Region = South AND Category = Housewares.',
    isBaseline: false,
    scope: { regions: ['South'], categories: ['Housewares'] },
    models: ['Prophet', 'Holt-Winters'],
    status: 'draft',
    accuracy: null,
    skuCount: countSkusInScope({ regions: ['South'], categories: ['Housewares'] }),
    priority: 25,
    createdAt: '2018-07-16',
  },
];
