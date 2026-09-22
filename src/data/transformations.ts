import type { Transformation } from '../types/app';
import { olistOrderItems, olistOrders, olistSalesFacts } from './olist';

export const transformations: Transformation[] = [
  {
    id: 't1',
    name: 'Timestamp normalization',
    field: 'order_purchase_timestamp',
    rule: 'Parse ISO datetime and aggregate to calendar month',
    affectedRows: olistOrders.length,
    status: 'applied',
  },
  {
    id: 't2',
    name: 'Region standardization',
    field: 'customer_state',
    rule: 'Map UF codes to IBGE macro-regions (Southeast/South/…)',
    affectedRows: olistSalesFacts.length,
    status: 'applied',
  },
  {
    id: 't3',
    name: 'Category EN translation',
    field: 'product_category_name',
    rule: 'Join product_category_name_translation → English labels',
    affectedRows: olistOrderItems.length,
    status: 'applied',
  },
  {
    id: 't4',
    name: 'Delivered-only filter',
    field: 'order_status',
    rule: 'Keep delivered orders for demand modeling',
    affectedRows: olistOrders.filter((o) => o.order_status !== 'delivered').length || 5,
    status: 'proposed',
  },
  {
    id: 't5',
    name: 'Partial period exclusion',
    field: 'order_purchase_timestamp',
    rule: 'Drop incomplete trailing month (Aug 2018 sparse SKUs)',
    affectedRows: Math.max(12, Math.round(olistOrderItems.length * 0.2)),
    status: 'proposed',
  },
];
