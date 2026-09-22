export type OlistCustomer = {
  customer_id: string;
  customer_unique_id: string;
  customer_zip_code_prefix: string;
  customer_city: string;
  customer_state: string;
};

export type OlistOrder = {
  order_id: string;
  customer_id: string;
  order_status: string;
  order_purchase_timestamp: string;
  order_approved_at: string | null;
  order_delivered_carrier_date: string | null;
  order_delivered_customer_date: string | null;
  order_estimated_delivery_date: string;
};

export type OlistOrderItem = {
  order_id: string;
  order_item_id: number;
  product_id: string;
  seller_id: string;
  shipping_limit_date: string;
  price: number;
  freight_value: number;
};

export type OlistProduct = {
  product_id: string;
  product_category_name: string | null;
  product_name_lenght: number | null;
  product_description_lenght: number | null;
  product_photos_qty: number | null;
  product_weight_g: number | null;
  product_length_cm: number | null;
  product_height_cm: number | null;
  product_width_cm: number | null;
};

export type OlistCategoryTranslation = {
  product_category_name: string;
  product_category_name_english: string;
};

export type OlistSeller = {
  seller_id: string;
  seller_zip_code_prefix: string;
  seller_city: string;
  seller_state: string;
};

export type OlistPayment = {
  order_id: string;
  payment_sequential: number;
  payment_type: string;
  payment_installments: number;
  payment_value: number;
};

export type OlistReview = {
  review_id: string;
  order_id: string;
  review_score: number;
  review_comment_title: string | null;
  review_comment_message: string | null;
  review_creation_date: string;
  review_answer_timestamp: string;
};

export type OlistGeolocation = {
  geolocation_zip_code_prefix: string;
  geolocation_lat: number;
  geolocation_lng: number;
  geolocation_city: string;
  geolocation_state: string;
};

/** Joined order-item fact used across ML mock layers */
export type OlistSalesFact = {
  orderId: string;
  productId: string;
  sku: string;
  sellerId: string;
  price: number;
  freight: number;
  category: string;
  categoryPt: string | null;
  state: string;
  region: string;
  city: string;
  status: string;
  purchaseAt: string | null;
};
