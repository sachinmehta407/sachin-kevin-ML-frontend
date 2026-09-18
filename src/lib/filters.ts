import { categoryForProduct, productsForCategory, skusForProduct } from '../data/catalog';
import { DEFAULT_DATE_FROM, DEFAULT_DATE_TO } from '../data/forecastRecords';
import {
  ALL_CATEGORIES,
  ALL_MODELS,
  ALL_PRODUCTS,
  ALL_REGIONS,
  ALL_SKUS,
  ALL_TEMPLATES,
  ForecastDashboardFilters,
  ForecastRecord,
  ModelPerformanceRecord,
} from '../types/forecast';

export function defaultFilters(): ForecastDashboardFilters {
  return {
    dateFrom: DEFAULT_DATE_FROM,
    dateTo: DEFAULT_DATE_TO,
    category: ALL_CATEGORIES,
    product: ALL_PRODUCTS,
    sku: ALL_SKUS,
    region: ALL_REGIONS,
    model: ALL_MODELS,
    template: ALL_TEMPLATES,
  };
}

/** Apply parent→child resets when a filter changes. */
export function applyFilterChange(
  prev: ForecastDashboardFilters,
  key: keyof ForecastDashboardFilters,
  value: string,
): ForecastDashboardFilters {
  const next = { ...prev, [key]: value };

  if (key === 'category') {
    const products = productsForCategory(value);
    if (next.product !== ALL_PRODUCTS && !products.includes(next.product)) {
      next.product = ALL_PRODUCTS;
      next.sku = ALL_SKUS;
    } else if (next.sku !== ALL_SKUS) {
      const skus = skusForProduct(value, next.product);
      if (!skus.includes(next.sku)) next.sku = ALL_SKUS;
    }
  }

  if (key === 'product') {
    if (value !== ALL_PRODUCTS) {
      const cat = categoryForProduct(value);
      if (cat) next.category = cat;
    }
    const skus = skusForProduct(next.category, value);
    if (next.sku !== ALL_SKUS && !skus.includes(next.sku)) {
      next.sku = ALL_SKUS;
    }
  }

  return next;
}

export function filterForecastRecords(
  records: ForecastRecord[],
  filters: ForecastDashboardFilters,
): ForecastRecord[] {
  return records.filter((r) => {
    if (r.date < filters.dateFrom || r.date > filters.dateTo) return false;
    if (filters.category !== ALL_CATEGORIES && r.category !== filters.category) return false;
    if (filters.product !== ALL_PRODUCTS && r.product !== filters.product) return false;
    if (filters.sku !== ALL_SKUS && r.sku !== filters.sku) return false;
    if (filters.region !== ALL_REGIONS && r.region !== filters.region) return false;
    if (filters.model !== ALL_MODELS && r.model !== filters.model) return false;
    if (filters.template !== ALL_TEMPLATES && r.template !== filters.template) return false;
    return true;
  });
}

export function filterModelPerformance(
  records: ModelPerformanceRecord[],
  filters: ForecastDashboardFilters,
): ModelPerformanceRecord[] {
  return records.filter((r) => {
    if (filters.category !== ALL_CATEGORIES && r.category !== filters.category) return false;
    if (filters.region !== ALL_REGIONS && r.region !== filters.region) return false;
    if (filters.model !== ALL_MODELS && r.model !== filters.model) return false;
    if (filters.template !== ALL_TEMPLATES && r.template !== filters.template) return false;
    return true;
  });
}
