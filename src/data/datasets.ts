import type { DemoFile } from '../types/app';
import { OLIST_SOURCE_FILES } from './olist';

/** Olist Brazilian e-commerce mock extracts (from olist_json_mock_data_file_wise.txt) */
export const demoFiles: DemoFile[] = OLIST_SOURCE_FILES.map((f, i) => ({
  id: f.id,
  name: f.name,
  size: `${Math.max(12, Math.round(f.rows * 0.9))} KB`,
  rows: f.rows,
  period: i < 3 ? 'Sep 2016 – Aug 2018' : 'Olist reference',
  status: f.id === 'olist-reviews' ? 'warning' : 'validated',
}));

export const defaultColumnMappings = [
  { source: 'order_purchase_timestamp', target: 'date', confidence: 99 },
  { source: 'price', target: 'sales', confidence: 98 },
  { source: 'product_id', target: 'sku', confidence: 97 },
  { source: 'product_category_name_english', target: 'category', confidence: 95 },
  { source: 'customer_state', target: 'region', confidence: 94 },
  { source: 'seller_id', target: 'ignore', confidence: 88 },
  { source: 'freight_value', target: 'ignore', confidence: 82 },
] as const;
