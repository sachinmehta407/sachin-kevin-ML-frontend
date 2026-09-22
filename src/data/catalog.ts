import { olistProductCatalogSeed } from './olist';

export interface ProductDef {
  category: string;
  product: string;
  skus: string[];
}

/** Product catalog derived from Olist products + EN category translation */
export const PRODUCT_CATALOG: ProductDef[] = olistProductCatalogSeed.map(
  ({ category, product, skus }) => ({ category, product, skus }),
);

export const CATEGORIES = [...new Set(PRODUCT_CATALOG.map((p) => p.category))].sort();

export function productsForCategory(category: string): string[] {
  if (category === 'All Categories') {
    return PRODUCT_CATALOG.map((p) => p.product);
  }
  return PRODUCT_CATALOG.filter((p) => p.category === category).map((p) => p.product);
}

export function skusForProduct(category: string, product: string): string[] {
  if (product === 'All Products') {
    const products = productsForCategory(category);
    return PRODUCT_CATALOG.filter((p) => products.includes(p.product)).flatMap((p) => p.skus);
  }
  const found = PRODUCT_CATALOG.find((p) => p.product === product);
  return found ? found.skus : [];
}

export function categoryForProduct(product: string): string | undefined {
  return PRODUCT_CATALOG.find((p) => p.product === product)?.category;
}
