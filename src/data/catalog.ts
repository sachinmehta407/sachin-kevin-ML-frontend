export interface ProductDef {
  category: string;
  product: string;
  skus: string[];
}

export const PRODUCT_CATALOG: ProductDef[] = [
  {
    category: 'Rings',
    product: 'Diamond Ring Classic',
    skus: ['SKU-1001', 'SKU-1002'],
  },
  {
    category: 'Rings',
    product: 'Gold Band Essential',
    skus: ['SKU-1003', 'SKU-1004'],
  },
  {
    category: 'Necklaces',
    product: 'Pearl Strand Aura',
    skus: ['SKU-2001', 'SKU-2002'],
  },
  {
    category: 'Necklaces',
    product: 'Silver Pendant Nova',
    skus: ['SKU-2003'],
  },
  {
    category: 'Earrings',
    product: 'Hoop Luxe Pair',
    skus: ['SKU-3001', 'SKU-3002'],
  },
  {
    category: 'Earrings',
    product: 'Stud Crystal Mini',
    skus: ['SKU-3003'],
  },
  {
    category: 'Bracelets',
    product: 'Tennis Link Bracelet',
    skus: ['SKU-4001', 'SKU-4002'],
  },
  {
    category: 'Watches',
    product: 'Chrono Steel Watch',
    skus: ['SKU-5001', 'SKU-5002'],
  },
];

export const CATEGORIES = [...new Set(PRODUCT_CATALOG.map((p) => p.category))];

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
