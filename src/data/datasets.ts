import type { DemoFile } from '../types/app';

export const demoFiles: DemoFile[] = [
  { id: 'f23', name: 'Sales_2023.csv', size: '8.4 MB', rows: 124680, period: 'Jan–Dec 2023', status: 'validated' },
  { id: 'f24', name: 'Sales_2024.csv', size: '9.1 MB', rows: 131240, period: 'Jan–Dec 2024', status: 'validated' },
  { id: 'f25', name: 'Sales_2025.csv', size: '6.8 MB', rows: 98210, period: 'Jan–Sep 2025', status: 'warning' },
];

export const defaultColumnMappings = [
  { source: 'Order Date', target: 'date', confidence: 99 },
  { source: 'Net Sales', target: 'sales', confidence: 98 },
  { source: 'Item Code', target: 'sku', confidence: 96 },
  { source: 'Product Name', target: 'product', confidence: 95 },
  { source: 'Division', target: 'category', confidence: 91 },
  { source: 'Sales Territory', target: 'region', confidence: 94 },
] as const;
