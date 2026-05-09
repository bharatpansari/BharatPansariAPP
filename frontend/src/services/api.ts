import { Config } from '../constants/config';
import { ApiResponse, HomePageData, Product, Category } from '../models/types';
import { mockHomeData, mockProducts, mockCategories } from '../constants/mockData';

// ═══════════════════════════════════════════════════════════
// Bharat Pansari — API Client
// ═══════════════════════════════════════════════════════════
//
// Config.API_BASE_URL auto-resolves:
//   Web preview → /api/wp (Emergent proxy, bypasses CORS)
//   Native mobile → https://bharatpansari.com/wp-json/bp-app/v1 (direct)
//
// No secrets stored. All endpoints are public read-only.
// Auth endpoints (login/register) are mock stubs for Phase 1.
// ═══════════════════════════════════════════════════════════

class ApiClient {
  private get baseUrl(): string {
    return Config.API_BASE_URL;
  }

  private sanitizeProduct(p: any): Product {
    return {
      id: p.id ?? 0,
      name: p.name ?? 'Unnamed Product',
      slug: p.slug ?? '',
      description: p.description ?? '',
      short_description: p.short_description ?? '',
      price: p.price ?? '',
      regular_price: p.regular_price ?? '',
      sale_price: p.sale_price ?? '',
      currency: p.currency ?? 'INR',
      images: Array.isArray(p.images) && p.images.length > 0
        ? p.images.map((img: any) => ({ id: img.id ?? 0, src: img.src ?? '', alt: img.alt ?? p.name ?? '' }))
        : [{ id: 0, src: '', alt: p.name ?? '' }],
      category_ids: Array.isArray(p.category_ids) ? p.category_ids : [],
      category_slugs: Array.isArray(p.category_slugs) ? p.category_slugs : [],
      stock_status: p.stock_status ?? 'instock',
      average_rating: p.average_rating ?? '0',
      rating_count: p.rating_count ?? 0,
      attributes: Array.isArray(p.attributes) ? p.attributes : [],
      related_products: Array.isArray(p.related_products) ? p.related_products : [],
    };
  }

  private sanitizeCategory(c: any): Category {
    return {
      id: c.id ?? 0,
      name: c.name ?? 'Category',
      slug: c.slug ?? '',
      description: c.description ?? '',
      image: c.image ?? '',
      parent_id: c.parent_id ?? 0,
      count: c.count ?? 0,
    };
  }

  private async apiFetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
        ...options,
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (data.success === false) {
        return { success: false, error: data.error || { code: 'unknown', message: 'Request failed' } };
      }
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return { success: false, error: { code: 'timeout', message: 'Request timed out. Please check your connection.' } };
      }
      return { success: false, error: { code: 'network_error', message: 'Unable to connect. Please check your internet connection.' } };
    }
  }

  // ── Public endpoints (real WordPress API) ──────────────

  async getHome(): Promise<ApiResponse<HomePageData>> {
    if (Config.USE_MOCK) return { success: true, data: mockHomeData, message: 'OK' };
    const res = await this.apiFetch<any>('/home');
    if (res.success && res.data) {
      const d = res.data;
      return {
        success: true,
        data: {
          banners: Array.isArray(d.banners) ? d.banners.map((b: any) => ({
            id: b.id ?? 0, image: b.image ?? '', title: b.title ?? '', subtitle: b.subtitle ?? '', link: b.link,
          })) : [],
          categories: Array.isArray(d.categories) ? d.categories.map((c: any) => this.sanitizeCategory(c)) : [],
          featured_products: Array.isArray(d.featured_products) ? d.featured_products.map((p: any) => this.sanitizeProduct(p)) : [],
          new_arrivals: Array.isArray(d.new_arrivals) ? d.new_arrivals.map((p: any) => this.sanitizeProduct(p)) : [],
          popular_products: Array.isArray(d.popular_products) ? d.popular_products.map((p: any) => this.sanitizeProduct(p)) : [],
        },
        message: 'OK',
      };
    }
    return res as ApiResponse<HomePageData>;
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    if (Config.USE_MOCK) return { success: true, data: mockCategories, message: 'OK' };
    const res = await this.apiFetch<any>('/categories');
    if (res.success && Array.isArray(res.data)) {
      return { success: true, data: res.data.map((c: any) => this.sanitizeCategory(c)), message: 'OK' };
    }
    return res as ApiResponse<Category[]>;
  }

  async getProducts(categorySlug?: string): Promise<ApiResponse<Product[]>> {
    if (Config.USE_MOCK) {
      if (categorySlug) {
        const filtered = mockProducts.filter(p => p.category_slugs.includes(categorySlug));
        return { success: true, data: filtered, message: 'OK' };
      }
      return { success: true, data: mockProducts, message: 'OK' };
    }
    const endpoint = categorySlug
      ? `/products?category=${encodeURIComponent(categorySlug)}&page=1&per_page=50`
      : '/products?page=1&per_page=50';
    const res = await this.apiFetch<any>(endpoint);
    if (res.success && Array.isArray(res.data)) {
      return { success: true, data: res.data.map((p: any) => this.sanitizeProduct(p)), message: 'OK' };
    }
    return res as ApiResponse<Product[]>;
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    if (Config.USE_MOCK) {
      const product = mockProducts.find(p => p.id === id);
      if (product) return { success: true, data: product, message: 'OK' };
      return { success: false, error: { code: 'not_found', message: 'Product not found' } };
    }
    const res = await this.apiFetch<any>(`/products/${id}`);
    if (res.success && res.data) {
      return { success: true, data: this.sanitizeProduct(res.data), message: 'OK' };
    }
    return res as ApiResponse<Product>;
  }

  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    if (Config.USE_MOCK) {
      const q = query.toLowerCase();
      const results = mockProducts.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
      return { success: true, data: results, message: 'OK' };
    }
    const res = await this.apiFetch<any>(`/search?q=${encodeURIComponent(query)}`);
    if (res.success && Array.isArray(res.data)) {
      return { success: true, data: res.data.map((p: any) => this.sanitizeProduct(p)), message: 'OK' };
    }
    return res as ApiResponse<Product[]>;
  }

  // ── Auth stubs (mock for Phase 1) ─────────────────────
  // TODO: Replace with real WordPress JWT auth endpoints

  async login(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    if (email && password) {
      return { success: true, data: { token: 'mock_token_123' }, message: 'Login successful (mock)' };
    }
    return { success: false, error: { code: 'invalid_credentials', message: 'Invalid email or password' } };
  }

  async register(email: string, password: string, firstName: string, lastName: string): Promise<ApiResponse<{ token: string }>> {
    return { success: true, data: { token: 'mock_token_456' }, message: 'Registration successful (mock)' };
  }
}

export const apiClient = new ApiClient();
