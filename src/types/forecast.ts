export interface ForecastRecord {
  date: string;
  month: string;
  category: string;
  product: string;
  sku: string;
  region: string;
  model: string;
  template: string;
  actual: number | null;
  forecast: number;
  lowerBound?: number;
  upperBound?: number;
  recommendedQuantity?: number;
  forecastSource: string;
  status: string;
}

export interface ModelPerformanceRecord {
  model: string;
  category: string;
  region: string;
  template: string;
  wape: number;
  mape: number;
  rmse: number;
  bias: number;
}

export interface ForecastDashboardFilters {
  dateFrom: string;
  dateTo: string;
  category: string;
  product: string;
  sku: string;
  region: string;
  model: string;
  template: string;
}

export const ALL_CATEGORIES = 'All Categories';
export const ALL_PRODUCTS = 'All Products';
export const ALL_SKUS = 'All SKUs';
export const ALL_REGIONS = 'All Regions';
export const ALL_MODELS = 'All Models';
export const ALL_TEMPLATES = 'All Templates';

export const MODELS = [
  'SARIMA',
  'Holt-Winters',
  'XGBoost',
  'Random Forest',
  'Seasonal Naive',
] as const;

export const TEMPLATES = [
  'Default Forecast',
  'High Value Products',
  'West Region',
  'Seasonal Products',
] as const;

export const REGIONS = ['North', 'South', 'East', 'West'] as const;

export const TOLERANCE_PCT = 10;
