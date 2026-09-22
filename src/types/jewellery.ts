/** Template overlay scopes — backed by Olist Brazilian e-commerce mock data */

export type JewelleryCategory =
  | 'Health Beauty'
  | 'Housewares'
  | 'Furniture Decor'
  | 'Stationery'
  | 'Bed Bath Table'
  | 'Computers Accessories'
  | 'Sports Leisure'
  | 'Garden Tools';

export type JewelleryRegion =
  | 'Southeast'
  | 'South'
  | 'Northeast'
  | 'North'
  | 'Central-West';

export type JewelleryCity =
  | 'Sao Paulo'
  | 'Rio De Janeiro'
  | 'Curitiba'
  | 'Belo Horizonte'
  | 'Brasilia'
  | 'Niteroi';

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
