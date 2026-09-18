import type { Transformation } from '../types/app';

export const transformations: Transformation[] = [
  { id: 't1', name: 'Date normalization', field: 'Order Date', rule: 'Parse ISO date and align to week start', affectedRows: 354130, status: 'applied' },
  { id: 't2', name: 'Region standardization', field: 'Sales Territory', rule: 'Map aliases to canonical region', affectedRows: 1842, status: 'applied' },
  { id: 't3', name: 'Return netting', field: 'Net Sales', rule: 'Aggregate returns into weekly net sales', affectedRows: 291, status: 'applied' },
  { id: 't4', name: 'Missing value imputation', field: 'Net Sales', rule: 'SKU × weekday median', affectedRows: 418, status: 'proposed' },
  { id: 't5', name: 'Partial period exclusion', field: 'Order Date', rule: 'Drop incomplete latest week', affectedRows: 3120, status: 'proposed' },
];
