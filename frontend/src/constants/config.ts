// API Configuration
// In Phase 1, we use mock data. When real API is ready,
// change USE_MOCK to false and ensure API_BASE_URL points to the WordPress REST API.
// API Configuration
// In Phase 1, we use mock data. When real API is ready,
// change USE_MOCK to false and ensure API_BASE_URL points to the WordPress REST API.
export const Config = {
  API_BASE_URL: 'https://bharatpansari.com',
  WP_API_NAMESPACE: '/wp-json/bp-app/v1',
  // Proxy URL for web (CORS bypass) - uses same-origin backend
  PROXY_BASE_URL: process.env.EXPO_PUBLIC_BACKEND_URL || '',
  PROXY_PREFIX: '/api/wp',
  USE_MOCK: false,
  APP_NAME: 'Bharat Pansari',
  APP_TAGLINE: 'Natural & Herbal Products',
  CURRENCY_SYMBOL: '₹',
  ITEMS_PER_PAGE: 20,
  PLACEHOLDER_IMAGE: 'https://bharatpansari.com/wp-content/uploads/woocommerce-placeholder-300x300.png',
};
