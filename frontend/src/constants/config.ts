// API Configuration
// In Phase 1, we use mock data. When real API is ready,
// change USE_MOCK to false and ensure API_BASE_URL points to the WordPress REST API.
export const Config = {
  API_BASE_URL: process.env.EXPO_PUBLIC_BACKEND_URL || '',
  WP_API_NAMESPACE: '/wp-json/bp-app/v1',
  USE_MOCK: true, // Set to false when real WordPress API is ready
  APP_NAME: 'Bharat Pansari',
  APP_TAGLINE: 'Natural & Herbal Products',
  CURRENCY_SYMBOL: '₹',
  ITEMS_PER_PAGE: 20,
};
