import type { TemplateMetadata } from '../types/app';

export const templates: TemplateMetadata[] = [
  { id: 'a', name: 'FY26 Candidate', description: 'Promo features with optimized ensemble', models: ['XGBoost','SARIMA','Holt-Winters'], wape: 10.9, bias: -0.4, coverage: 96.8 },
  { id: 'b', name: 'FY25 Production', description: 'Current approved production template', models: ['SARIMA','Holt-Winters'], wape: 12.6, bias: 1.6, coverage: 94.2 },
];
