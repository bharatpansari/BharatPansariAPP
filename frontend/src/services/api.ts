import { Config } from '../constants/config';
import { ApiResponse, HomePageData, Product, Category } from '../models/types';
import { mockHomeData, mockProducts, mockCategories } from '../constants/mockData';

// Base API client - will connect to WordPress REST API in future
class ApiClient {
  private baseUrl: string;
  private useMock: boolean;

  constructor() {
    this.baseUrl = Config.API_BASE_URL + Config.WP_API_NAMESPACE;
    this.useMock = Config.USE_MOCK;
  }

  // Generic fetch method for future real API calls
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await globalThis.fetch(`${this.baseUrl}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: { code: 'network_error', message: 'Unable to connect. Please check your internet connection.' },
      };
    }
  }

  // Home page data
  async getHome(): Promise<ApiResponse<HomePageData>> {
    if (this.useMock) {
      return { success: true, data: mockHomeData, message: 'OK' };
    }
    return this.fetch<HomePageData>('/home');
  }

  // Categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    if (this.useMock) {
      return { success: true, data: mockCategories, message: 'OK' };
    }
    return this.fetch<Category[]>('/categories');
  }

  // All products or by category
  async getProducts(categorySlug?: string): Promise<ApiResponse<Product[]>> {
    if (this.useMock) {
      if (categorySlug) {
        const filtered = mockProducts.filter(p => p.category_slugs.includes(categorySlug));
        return { success: true, data: filtered, message: 'OK' };
      }
      return { success: true, data: mockProducts, message: 'OK' };
    }
    const endpoint = categorySlug ? `/products?category=${categorySlug}` : '/products';
    return this.fetch<Product[]>(endpoint);
  }

  // Single product
  async getProduct(id: number): Promise<ApiResponse<Product>> {
    if (this.useMock) {
      const product = mockProducts.find(p => p.id === id);
      if (product) return { success: true, data: product, message: 'OK' };
      return { success: false, error: { code: 'not_found', message: 'Product not found' } };
    }
    return this.fetch<Product>(`/products/${id}`);
  }

  // Search products
  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    if (this.useMock) {
      const q = query.toLowerCase();
      const results = mockProducts.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.short_description.toLowerCase().includes(q)
      );
      return { success: true, data: results, message: 'OK' };
    }
    return this.fetch<Product[]>(`/search?q=${encodeURIComponent(query)}`);
  }

  // Auth (mock for Phase 1)
  async login(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    if (this.useMock) {
      // Simulate login
      if (email && password) {
        return { success: true, data: { token: 'mock_token_123' }, message: 'Login successful' };
      }
      return { success: false, error: { code: 'invalid_credentials', message: 'Invalid email or password' } };
    }
    return this.fetch<{ token: string }>('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  }

  async register(email: string, password: string, firstName: string, lastName: string): Promise<ApiResponse<{ token: string }>> {
    if (this.useMock) {
      return { success: true, data: { token: 'mock_token_456' }, message: 'Registration successful' };
    }
    return this.fetch<{ token: string }>('/register', { method: 'POST', body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }) });
  }
}

export const apiClient = new ApiClient();
