import type {
  ForecastTemplate,
  JewelleryCategory,
  JewelleryCity,
  JewelleryRegion,
  JewellerySku,
  TemplateScope,
} from '../types/jewellery';

const CATEGORY_PLAN: Array<{ category: JewelleryCategory; count: number; baselineAccuracy: number }> = [
  { category: 'Bridal', count: 200, baselineAccuracy: 78 },
  { category: 'Rings', count: 300, baselineAccuracy: 86 },
  { category: 'Earrings', count: 250, baselineAccuracy: 84 },
  { category: 'Necklaces', count: 250, baselineAccuracy: 82 },
];

const REGIONS: JewelleryRegion[] = ['North', 'South', 'East', 'West'];
const CITIES: JewelleryCity[] = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad'];

const PREFIX: Record<JewelleryCategory, string> = {
  Bridal: 'BR',
  Rings: 'RG',
  Earrings: 'ER',
  Necklaces: 'NK',
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Deterministic 1,000 jewellery SKUs across four categories */
export function buildJewelleryCorpus(): JewellerySku[] {
  const rows: JewellerySku[] = [];
  for (const plan of CATEGORY_PLAN) {
    for (let i = 1; i <= plan.count; i++) {
      const sku = `${PREFIX[plan.category]}-${String(i).padStart(3, '0')}`;
      const h = hash(sku);
      rows.push({
        sku,
        product: `${plan.category} Style ${i}`,
        category: plan.category,
        region: REGIONS[h % REGIONS.length],
        city: CITIES[h % CITIES.length],
      });
    }
  }
  return rows;
}

export const jewelleryCorpus = buildJewelleryCorpus();

export const jewelleryCategoryStats = CATEGORY_PLAN.map((p) => ({
  category: p.category,
  skus: p.count,
  baselineAccuracy: p.baselineAccuracy,
  template: 'Default Template',
}));

export function scopeLabel(scope: TemplateScope): string {
  const parts: string[] = [];
  if (scope.categories?.length) parts.push(`Category = ${scope.categories.join(', ')}`);
  if (scope.regions?.length) parts.push(`Region = ${scope.regions.join(', ')}`);
  if (scope.cities?.length) parts.push(`City = ${scope.cities.join(', ')}`);
  if (scope.skus?.length) parts.push(`SKU = ${scope.skus.slice(0, 4).join(', ')}${scope.skus.length > 4 ? '…' : ''}`);
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
  // If only skus listed, categories/regions/cities may be empty — already handled
  // AND logic across defined dimensions
  return true;
}

export function countSkusInScope(scope: TemplateScope, corpus = jewelleryCorpus): number {
  return corpus.filter((s) => matchScope(s, scope)).length;
}

export function baselineAccuracyForSku(sku: JewellerySku): number {
  return CATEGORY_PLAN.find((p) => p.category === sku.category)?.baselineAccuracy ?? 80;
}

export function forecastQtyForSku(sku: JewellerySku, accuracy: number): number {
  const base = 80 + (hash(sku.sku) % 420);
  return Math.round(base * (0.85 + accuracy / 500));
}

/** Seed templates matching the jewellery narrative */
export const seedForecastTemplates: ForecastTemplate[] = [
  {
    id: 'tpl-default',
    name: 'Template 1 — Default AutoML',
    description: 'Baseline AutoML on all 1,000 SKUs. Full workflow: Data → Processing → Features → Models → Train → Evaluate → Predict.',
    isBaseline: true,
    scope: {},
    models: ['XGBoost', 'LightGBM', 'SARIMA'],
    status: 'approved',
    accuracy: 83,
    skuCount: 1000,
    priority: 0,
    createdAt: '2026-09-01',
  },
  {
    id: 'tpl-bridal',
    name: 'Template 2 — Improve Bridal',
    description: 'Scoped experiment: Category = Bridal (200 SKUs). Different models/features to lift Bridal accuracy.',
    isBaseline: false,
    scope: { categories: ['Bridal'] },
    models: ['XGBoost', 'Prophet', 'TFT'],
    status: 'approved',
    accuracy: 88,
    skuCount: 200,
    priority: 20,
    createdAt: '2026-09-10',
  },
  {
    id: 'tpl-mumbai',
    name: 'Template 3 — Mumbai focus',
    description: 'Scoped experiment: City = Mumbai.',
    isBaseline: false,
    scope: { cities: ['Mumbai'] },
    models: ['LightGBM', 'XGBoost'],
    status: 'draft',
    accuracy: null,
    skuCount: countSkusInScope({ cities: ['Mumbai'] }),
    priority: 30,
    createdAt: '2026-09-12',
  },
  {
    id: 'tpl-bridal-skus',
    name: 'Template 4 — High-value Bridal SKUs',
    description: 'Scoped experiment: SKU = BR-001, BR-002, BR-003.',
    isBaseline: false,
    scope: { skus: ['BR-001', 'BR-002', 'BR-003'] },
    models: ['XGBoost'],
    status: 'draft',
    accuracy: null,
    skuCount: 3,
    priority: 40,
    createdAt: '2026-09-14',
  },
  {
    id: 'tpl-rings-delhi',
    name: 'Template 5 — Rings in Delhi',
    description: 'Scoped experiment: Category = Rings AND City = Delhi.',
    isBaseline: false,
    scope: { categories: ['Rings'], cities: ['Delhi'] },
    models: ['LightGBM', 'SARIMA'],
    status: 'draft',
    accuracy: null,
    skuCount: countSkusInScope({ categories: ['Rings'], cities: ['Delhi'] }),
    priority: 35,
    createdAt: '2026-09-15',
  },
  {
    id: 'tpl-south-necklaces',
    name: 'Template 6 — South Necklaces',
    description: 'Scoped experiment: Region = South AND Category = Necklaces.',
    isBaseline: false,
    scope: { regions: ['South'], categories: ['Necklaces'] },
    models: ['Prophet', 'Holt-Winters'],
    status: 'draft',
    accuracy: null,
    skuCount: countSkusInScope({ regions: ['South'], categories: ['Necklaces'] }),
    priority: 25,
    createdAt: '2026-09-16',
  },
];
