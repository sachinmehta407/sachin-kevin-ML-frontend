import type { ModelCandidate } from '../types/app';

export const modelCandidates: ModelCandidate[] = [
  { id: 'sarima', name: 'SARIMA', family: 'Statistical', reason: 'Strong annual seasonality and stable history', estimate: '4 min', selected: true },
  { id: 'holt', name: 'Holt-Winters', family: 'Statistical', reason: 'Fast, explainable trend-seasonality baseline', estimate: '2 min', selected: true },
  { id: 'xgb', name: 'XGBoost', family: 'Gradient boosted', reason: 'Captures promotions and nonlinear effects', estimate: '9 min', selected: true },
  { id: 'rf', name: 'Random Forest', family: 'Tree ensemble', reason: 'Robust comparison for sparse segments', estimate: '7 min', selected: true },
  { id: 'naive', name: 'Seasonal Naive', family: 'Baseline', reason: 'Transparent benchmark and fallback', estimate: '<1 min', selected: true },
  { id: 'lstm', name: 'LSTM', family: 'Deep learning', reason: 'Excluded: insufficient history per SKU for reliable tuning', estimate: '28 min', excluded: true },
];
