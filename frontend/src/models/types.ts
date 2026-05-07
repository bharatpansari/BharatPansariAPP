export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  currency: string;
  images: ProductImage[];
  category_ids: number[];
  category_slugs: string[];
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  average_rating: string;
  rating_count: number;
  attributes: ProductAttribute[];
  related_products: number[];
}

export interface ProductAttribute {
  name: string;
  options: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  parent_id: number;
  count: number;
}

export interface CartItem {
  product_id: number;
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product_id: number;
  product: Product;
  added_at: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

export interface Address {
  id: number;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: number;
  status: string;
  total: string;
  currency: string;
  date_created: string;
  items: OrderItem[];
}

export interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  price: string;
  image: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface HomePageData {
  banners: Banner[];
  categories: Category[];
  featured_products: Product[];
  new_arrivals: Product[];
  popular_products: Product[];
}

export interface Banner {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  link?: string;
}
