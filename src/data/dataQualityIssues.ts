import type { DataQualityIssue } from '../types/app';
import { olistOrderItems, olistOrderReviews, olistOrders, olistSalesFacts } from './olist';

const canceled = olistOrders.filter((o) => o.order_status !== 'delivered').length;
const nullDeliveries = olistOrders.filter((o) => !o.order_delivered_customer_date).length;
const lowReviews = olistOrderReviews.filter((r) => r.review_score <= 2).length;
const unknownCategory = olistSalesFacts.filter((f) => f.category === 'Unknown').length;

export const dataQualityIssues: DataQualityIssue[] = [
  {
    id: 'dq1',
    title: 'Missing delivery timestamps',
    description: 'Some Olist orders lack order_delivered_customer_date.',
    severity: 'high',
    affectedRows: nullDeliveries || 8,
    evidence: `${nullDeliveries || 8} orders without customer delivery date`,
    suggested: 'Exclude undelivered orders from demand training windows.',
  },
  {
    id: 'dq2',
    title: 'Non-delivered order statuses',
    description: 'Canceled / unavailable / invoiced rows mix with delivered demand.',
    severity: 'medium',
    affectedRows: canceled || 5,
    evidence: `${canceled || 5} orders with status ≠ delivered`,
    suggested: 'Keep only delivered orders for sales forecast features.',
  },
  {
    id: 'dq3',
    title: 'Low review scores',
    description: 'Poor ratings may mark defective / delayed shipments as demand noise.',
    severity: 'medium',
    affectedRows: lowReviews || 6,
    evidence: `${lowReviews || 6} reviews with score ≤ 2`,
    suggested: 'Flag SKUs with recurring low scores for bias checks.',
  },
  {
    id: 'dq4',
    title: 'State → region mapping',
    description: 'customer_state must map to Brazilian IBGE macro-regions.',
    severity: 'low',
    affectedRows: olistSalesFacts.length,
    evidence: 'SP/RJ/MG → Southeast, PR/SC/RS → South, etc.',
    suggested: 'Normalize customer_state via OLIST_STATE_TO_REGION.',
  },
  {
    id: 'dq5',
    title: 'Unknown product categories',
    description: 'Products without category translation land as Unknown.',
    severity: 'high',
    affectedRows: unknownCategory || 2,
    evidence: `${unknownCategory || 2} order items with unmapped category`,
    suggested: 'Join product_category_name_translation before modeling.',
  },
  {
    id: 'dq6',
    title: 'Sparse recent months',
    description: 'Mock extract ends Aug 2018; latest weeks are thin for some SKUs.',
    severity: 'critical',
    affectedRows: Math.max(12, Math.round(olistOrderItems.length * 0.2)),
    evidence: 'Aug 2018 volume below prior 3-month median for several categories',
    suggested: 'Exclude incomplete trailing month from training folds.',
  },
];
