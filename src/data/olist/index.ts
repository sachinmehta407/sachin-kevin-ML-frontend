import customersJson from './customers.json';
import geolocationJson from './geolocation.json';
import orderItemsJson from './order_items.json';
import orderReviewsJson from './order_reviews.json';
import categoryTranslationJson from './category_translation.json';
import productsJson from './products.json';
import orderPaymentsJson from './order_payments.json';
import ordersJson from './orders.json';
import sellersJson from './sellers.json';
import salesFactsJson from './salesFacts.json';
import productCatalogJson from './productCatalog.json';
import type {
  OlistCategoryTranslation,
  OlistCustomer,
  OlistGeolocation,
  OlistOrder,
  OlistOrderItem,
  OlistPayment,
  OlistProduct,
  OlistReview,
  OlistSalesFact,
  OlistSeller,
} from './types';

export type {
  OlistCategoryTranslation,
  OlistCustomer,
  OlistGeolocation,
  OlistOrder,
  OlistOrderItem,
  OlistPayment,
  OlistProduct,
  OlistReview,
  OlistSalesFact,
  OlistSeller,
} from './types';

export const olistCustomers = customersJson as OlistCustomer[];
export const olistGeolocation = geolocationJson as OlistGeolocation[];
export const olistOrderItems = orderItemsJson as OlistOrderItem[];
export const olistOrderReviews = orderReviewsJson as OlistReview[];
export const olistCategoryTranslation = categoryTranslationJson as OlistCategoryTranslation[];
export const olistProducts = productsJson as OlistProduct[];
export const olistOrderPayments = orderPaymentsJson as OlistPayment[];
export const olistOrders = ordersJson as OlistOrder[];
export const olistSellers = sellersJson as OlistSeller[];

/** Flattened order_items × orders × products × customers for ML mock usage */
export const olistSalesFacts = salesFactsJson as OlistSalesFact[];

export const olistProductCatalogSeed = productCatalogJson as Array<{
  category: string;
  product: string;
  skus: string[];
  productId: string;
}>;

/** Brazilian IBGE macro-regions used as forecasting regions */
export const OLIST_REGIONS = [
  'Southeast',
  'South',
  'Northeast',
  'North',
  'Central-West',
] as const;

export const OLIST_STATE_TO_REGION: Record<string, (typeof OLIST_REGIONS)[number]> = {
  SP: 'Southeast',
  RJ: 'Southeast',
  MG: 'Southeast',
  ES: 'Southeast',
  PR: 'South',
  SC: 'South',
  RS: 'South',
  BA: 'Northeast',
  CE: 'Northeast',
  PE: 'Northeast',
  PB: 'Northeast',
  MA: 'Northeast',
  PI: 'Northeast',
  SE: 'Northeast',
  AL: 'Northeast',
  RN: 'Northeast',
  PA: 'North',
  AM: 'North',
  RO: 'North',
  AC: 'North',
  RR: 'North',
  AP: 'North',
  TO: 'North',
  DF: 'Central-West',
  GO: 'Central-West',
  MT: 'Central-West',
  MS: 'Central-West',
};

export function olistCategories(): string[] {
  return [...new Set(olistProductCatalogSeed.map((p) => p.category))].sort();
}

export function olistCities(): string[] {
  return [...new Set(olistSalesFacts.map((f) => f.city))].sort();
}

/** Monthly GMV from Olist purchase timestamps (BRL) */
export function olistMonthlyGmv(): Array<{ monthKey: string; sales: number }> {
  const map = new Map<string, number>();
  for (const fact of olistSalesFacts) {
    if (!fact.purchaseAt) continue;
    const key = fact.purchaseAt.slice(0, 7);
    map.set(key, (map.get(key) ?? 0) + fact.price);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, sales]) => ({ monthKey, sales: Number(sales.toFixed(2)) }));
}

export const OLIST_SOURCE_FILES = [
  { id: 'olist-customers', name: 'olist_customers_dataset.json', rows: olistCustomers.length },
  { id: 'olist-orders', name: 'olist_orders_dataset.json', rows: olistOrders.length },
  { id: 'olist-order-items', name: 'olist_order_items_dataset.json', rows: olistOrderItems.length },
  { id: 'olist-products', name: 'olist_products_dataset.json', rows: olistProducts.length },
  { id: 'olist-payments', name: 'olist_order_payments_dataset.json', rows: olistOrderPayments.length },
  { id: 'olist-reviews', name: 'olist_order_reviews_dataset.json', rows: olistOrderReviews.length },
  { id: 'olist-sellers', name: 'olist_sellers_dataset.json', rows: olistSellers.length },
  { id: 'olist-geo', name: 'olist_geolocation_dataset.json', rows: olistGeolocation.length },
  {
    id: 'olist-cat-map',
    name: 'product_category_name_translation.json',
    rows: olistCategoryTranslation.length,
  },
] as const;
