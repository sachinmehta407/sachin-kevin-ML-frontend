/** Jewellery template overlay — scopes, experiments, final assembly */

export type JewelleryCategory = 'Bridal' | 'Rings' | 'Earrings' | 'Necklaces';
export type JewelleryRegion = 'North' | 'South' | 'East' | 'West';
export type JewelleryCity = 'Mumbai' | 'Delhi' | 'Bengaluru' | 'Chennai' | 'Kolkata' | 'Hyderabad';

export type TemplateRunStatus = 'draft' | 'running' | 'complete' | 'approved';

/** Any supported slice of forecasting data */
export interface TemplateScope {
  /** empty / undefined = all SKUs */
  categories?: JewelleryCategory[];
  regions?: JewelleryRegion[];
  cities?: JewelleryCity[];
  skus?: string[];
}

export interface JewellerySku {
  sku: string;
  product: string;
  category: JewelleryCategory;
  region: JewelleryRegion;
  city: JewelleryCity;
}

export interface ForecastTemplate {
  id: string;
  name: string;
  description: string;
  /** true = baseline covering full population */
  isBaseline: boolean;
  scope: TemplateScope;
  models: string[];
  status: TemplateRunStatus;
  /** Accuracy % for the scoped / covered SKUs after training */
  accuracy: number | null;
  /** How many SKUs this template produces predictions for */
  skuCount: number;
  priority: number;
  createdAt: string;
}

export interface SkuPrediction {
  sku: string;
  category: JewelleryCategory;
  region: JewelleryRegion;
  city: JewelleryCity;
  product: string;
  forecastQty: number;
  accuracy: number;
  sourceTemplateId: string;
  sourceTemplateName: string;
}

export interface AssemblySummaryRow {
  label: string;
  skuCount: number;
  sourceTemplateId: string;
  sourceTemplateName: string;
  accuracy: number;
}

export interface FinalForecastAssembly {
  totalSkus: number;
  predictions: SkuPrediction[];
  summary: AssemblySummaryRow[];
  blendedAccuracy: number;
  assembledAt: string | null;
}
