import type { Experiment } from '../types/app';

export const experiments: Experiment[] = [
  { id: 'default', name: 'Default', models: ['SARIMA','Holt-Winters','XGBoost'], horizon: 12, wape: 12.4, bias: 1.8, status: 'complete', createdAt: 'Sep 15, 2026' },
  { id: 'exp-a', name: 'Exp A · Longer history', models: ['SARIMA','XGBoost'], horizon: 12, wape: 11.8, bias: 1.1, status: 'complete', createdAt: 'Sep 16, 2026' },
  { id: 'exp-b', name: 'Exp B · Promo features', models: ['XGBoost','Random Forest'], horizon: 12, wape: 10.9, bias: -0.4, status: 'complete', createdAt: 'Sep 17, 2026' },
  { id: 'exp-c', name: 'Exp C · Robust baseline', models: ['Holt-Winters','Seasonal Naive'], horizon: 8, wape: 13.2, bias: 0.8, status: 'complete', createdAt: 'Sep 17, 2026' },
];
