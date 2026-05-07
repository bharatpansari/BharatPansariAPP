# Bharat Pansari - API Contract & Integration Guide

> **For**: WordPress REST API Plugin Developer  
> **Namespace**: `https://bharatpansari.com/wp-json/bp-app/v1/`  
> **Version**: 1.0.0  
> **Last Updated**: February 2026  
> **App Framework**: Expo (React Native) with Zustand state management

---

## Table of Contents

1. [Overview & Architecture](#1-overview--architecture)
2. [Response Format Standard](#2-response-format-standard)
3. [API Endpoints](#3-api-endpoints)
4. [TypeScript Models](#4-typescript-models)
5. [Screen-to-Endpoint Mapping](#5-screen-to-endpoint-mapping)
6. [Mock Data Structure](#6-mock-data-structure)
7. [Switching from Mock to Real API](#7-switching-from-mock-to-real-api)
8. [Assumptions Made in the App](#8-assumptions-made-in-the-app)
9. [Missing Backend Features for Future Phases](#9-missing-backend-features-for-future-phases)

---

## 1. Overview & Architecture

```
┌─────────────────────┐
│  Bharat Pansari App │  (Expo / React Native)
│  (Mobile Client)    │
└────────┬────────────┘
         │ HTTPS only
         ▼
┌─────────────────────────────────────┐
│  Custom WordPress REST API Plugin   │
│  Namespace: /wp-json/bp-app/v1/     │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  WordPress + WooCommerce Database   │
│  (Products, Categories, Users,      │
│   Orders, Coupons, etc.)            │
└─────────────────────────────────────┘
```

### Security Rules
- **DO NOT** expose WooCommerce consumer keys/secrets to the mobile app
- **DO NOT** allow direct database access from the app
- All sensitive operations (order creation, payment, user data modification) happen server-side
- Use WordPress nonce or JWT for authenticated endpoints
- All API URLs must be HTTPS
- Rate limiting recommended for public endpoints

### Config File Location in App
```
/app/frontend/src/constants/config.ts
```

```typescript
export const Config = {
  API_BASE_URL: process.env.EXPO_PUBLIC_BACKEND_URL || '',
  WP_API_NAMESPACE: '/wp-json/bp-app/v1',
  USE_MOCK: true, // ← Set to false when real API is ready
  APP_NAME: 'Bharat Pansari',
  APP_TAGLINE: 'Natural & Herbal Products',
  CURRENCY_SYMBOL: '₹',
  ITEMS_PER_PAGE: 20,
};
```

---

## 2. Response Format Standard

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "OK"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "error_code",
    "message": "Human readable error message"
  }
}
```

### Standard Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `not_found` | 404 | Resource not found |
| `invalid_credentials` | 401 | Login failed |
| `unauthorized` | 401 | Token missing/expired |
| `validation_error` | 422 | Request body validation failed |
| `network_error` | 500 | Server error |
| `rate_limited` | 429 | Too many requests |
| `out_of_stock` | 400 | Product unavailable |

---

## 3. API Endpoints

---

### 3.1 GET `/home`

**Purpose**: Fetch all data needed for the Home screen in a single request.  
**Authentication**: None (public)  
**Consumed by**: Home Screen (`/(tabs)/index.tsx`)

#### Request
```
GET /wp-json/bp-app/v1/home
```

No parameters required.

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "banners": [
      {
        "id": 1,
        "image": "https://bharatpansari.com/wp-content/uploads/banners/ayurveda.jpg",
        "title": "Pure & Natural",
        "subtitle": "Discover Ayurvedic wellness products",
        "link": "/category/ayurvedic"
      },
      {
        "id": 2,
        "image": "https://bharatpansari.com/wp-content/uploads/banners/organic.jpg",
        "title": "Fresh Arrivals",
        "subtitle": "Organic herbs & spices collection",
        "link": "/category/herbs-spices"
      }
    ],
    "categories": [
      {
        "id": 1,
        "name": "Herbs & Spices",
        "slug": "herbs-spices",
        "description": "Pure natural herbs and spices",
        "image": "https://bharatpansari.com/wp-content/uploads/categories/spices.jpg",
        "parent_id": 0,
        "count": 24
      }
    ],
    "featured_products": [
      {
        "id": 1,
        "name": "Organic Turmeric Powder",
        "slug": "organic-turmeric-powder",
        "description": "Premium quality organic turmeric...",
        "short_description": "Pure organic turmeric powder with high curcumin content",
        "price": "199",
        "regular_price": "249",
        "sale_price": "199",
        "currency": "INR",
        "images": [
          {
            "id": 1,
            "src": "https://bharatpansari.com/wp-content/uploads/products/turmeric.jpg",
            "alt": "Organic Turmeric Powder"
          }
        ],
        "category_ids": [1, 7],
        "category_slugs": ["herbs-spices", "powders"],
        "stock_status": "instock",
        "average_rating": "4.5",
        "rating_count": 128,
        "attributes": [
          { "name": "Weight", "options": ["100g", "250g", "500g"] }
        ],
        "related_products": [2, 5, 8]
      }
    ],
    "new_arrivals": [ /* Same Product structure */ ],
    "popular_products": [ /* Same Product structure */ ]
  },
  "message": "OK"
}
```

#### Error Response (500)
```json
{
  "success": false,
  "error": {
    "code": "network_error",
    "message": "Unable to fetch home data"
  }
}
```

#### Notes for Plugin Developer
- `banners`: Source from a custom post type or ACF/meta fields. Minimum 2-3 banners recommended.
- `categories`: Top-level WooCommerce product categories (parent_id = 0). Limit to 6-8 for the chip row.
- `featured_products`: WooCommerce products marked as "featured". Limit to 6.
- `new_arrivals`: Most recently published products. Limit to 6.
- `popular_products`: Products sorted by total_sales or rating_count. Limit to 6.

---

### 3.2 GET `/categories`

**Purpose**: Fetch all product categories.  
**Authentication**: None (public)  
**Consumed by**: Categories Screen (`/(tabs)/categories.tsx`)

#### Request
```
GET /wp-json/bp-app/v1/categories
```

No parameters required.

#### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Herbs & Spices",
      "slug": "herbs-spices",
      "description": "Pure natural herbs and spices",
      "image": "https://bharatpansari.com/wp-content/uploads/categories/spices.jpg",
      "parent_id": 0,
      "count": 24
    },
    {
      "id": 2,
      "name": "Ayurvedic",
      "slug": "ayurvedic",
      "description": "Traditional Ayurvedic preparations",
      "image": "https://bharatpansari.com/wp-content/uploads/categories/ayurvedic.jpg",
      "parent_id": 0,
      "count": 18
    }
  ],
  "message": "OK"
}
```

#### Field Details
| Field | Type | Required | Source |
|-------|------|----------|--------|
| id | number | ✅ | WooCommerce category ID |
| name | string | ✅ | Category name |
| slug | string | ✅ | Category slug (URL-safe) |
| description | string | ✅ | Category description |
| image | string | ✅ | Category thumbnail URL (full URL) |
| parent_id | number | ✅ | Parent category ID (0 = top-level) |
| count | number | ✅ | Number of products in category |

---

### 3.3 GET `/products`

**Purpose**: Fetch all products or filter by category.  
**Authentication**: None (public)  
**Consumed by**: Category Products Screen (`/category/[slug].tsx`), Home Screen

#### Request
```
GET /wp-json/bp-app/v1/products
GET /wp-json/bp-app/v1/products?category=herbs-spices
GET /wp-json/bp-app/v1/products?category=ayurvedic&page=1&per_page=20
```

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| category | string | ❌ | - | Category slug to filter by |
| page | number | ❌ | 1 | Pagination page number |
| per_page | number | ❌ | 20 | Items per page (max 100) |
| orderby | string | ❌ | "date" | Sort: "date", "price", "rating", "popularity" |
| order | string | ❌ | "desc" | "asc" or "desc" |

#### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Organic Turmeric Powder",
      "slug": "organic-turmeric-powder",
      "description": "Premium quality organic turmeric powder sourced from the farms of Erode, Tamil Nadu. Known for its high curcumin content and vibrant golden color.",
      "short_description": "Pure organic turmeric powder with high curcumin content",
      "price": "199",
      "regular_price": "249",
      "sale_price": "199",
      "currency": "INR",
      "images": [
        {
          "id": 1,
          "src": "https://bharatpansari.com/wp-content/uploads/products/turmeric-1.jpg",
          "alt": "Organic Turmeric Powder"
        },
        {
          "id": 2,
          "src": "https://bharatpansari.com/wp-content/uploads/products/turmeric-2.jpg",
          "alt": "Organic Turmeric Powder - Back"
        }
      ],
      "category_ids": [1, 7],
      "category_slugs": ["herbs-spices", "powders"],
      "stock_status": "instock",
      "average_rating": "4.5",
      "rating_count": 128,
      "attributes": [
        { "name": "Weight", "options": ["100g", "250g", "500g"] },
        { "name": "Origin", "options": ["Erode, Tamil Nadu"] }
      ],
      "related_products": [2, 5, 8]
    }
  ],
  "message": "OK"
}
```

#### Empty Response (200)
```json
{
  "success": true,
  "data": [],
  "message": "OK"
}
```

---

### 3.4 GET `/products/{id}`

**Purpose**: Fetch single product details.  
**Authentication**: None (public)  
**Consumed by**: Product Detail Screen (`/product/[id].tsx`)

#### Request
```
GET /wp-json/bp-app/v1/products/1
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | ✅ | WooCommerce product ID |

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Organic Turmeric Powder",
    "slug": "organic-turmeric-powder",
    "description": "Premium quality organic turmeric powder sourced from the farms of Erode, Tamil Nadu. Known for its high curcumin content and vibrant golden color. Traditionally used in Indian cuisine and wellness practices.",
    "short_description": "Pure organic turmeric powder with high curcumin content",
    "price": "199",
    "regular_price": "249",
    "sale_price": "199",
    "currency": "INR",
    "images": [
      { "id": 1, "src": "https://bharatpansari.com/wp-content/uploads/products/turmeric-1.jpg", "alt": "Organic Turmeric Powder" },
      { "id": 2, "src": "https://bharatpansari.com/wp-content/uploads/products/turmeric-2.jpg", "alt": "Turmeric powder close-up" }
    ],
    "category_ids": [1, 7],
    "category_slugs": ["herbs-spices", "powders"],
    "stock_status": "instock",
    "average_rating": "4.5",
    "rating_count": 128,
    "attributes": [
      { "name": "Weight", "options": ["100g", "250g", "500g"] },
      { "name": "Origin", "options": ["Erode, Tamil Nadu"] }
    ],
    "related_products": [2, 5, 8]
  },
  "message": "OK"
}
```

#### Error Response (404)
```json
{
  "success": false,
  "error": {
    "code": "not_found",
    "message": "Product not found"
  }
}
```

---

### 3.5 GET `/search?q={query}`

**Purpose**: Search products by name, description, or tags.  
**Authentication**: None (public)  
**Consumed by**: Search Screen (`/(tabs)/search.tsx`)

#### Request
```
GET /wp-json/bp-app/v1/search?q=turmeric
GET /wp-json/bp-app/v1/search?q=green+tea&page=1&per_page=20
```

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| q | string | ✅ | - | Search query (min 2 characters) |
| page | number | ❌ | 1 | Pagination page |
| per_page | number | ❌ | 20 | Results per page |

#### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Organic Turmeric Powder",
      "slug": "organic-turmeric-powder",
      "short_description": "Pure organic turmeric powder with high curcumin content",
      "price": "199",
      "regular_price": "249",
      "sale_price": "199",
      "currency": "INR",
      "images": [{ "id": 1, "src": "...", "alt": "..." }],
      "category_ids": [1, 7],
      "category_slugs": ["herbs-spices", "powders"],
      "stock_status": "instock",
      "average_rating": "4.5",
      "rating_count": 128,
      "attributes": [],
      "related_products": [2, 5, 8]
    }
  ],
  "message": "OK"
}
```

#### No Results (200)
```json
{
  "success": true,
  "data": [],
  "message": "OK"
}
```

#### Search Logic (Recommended)
- Search in: product name, short_description, description, tags, SKU
- Case-insensitive
- Partial match (LIKE %query%)
- Order by relevance (name match > description match)

---

### 3.6 POST `/login`

**Purpose**: Authenticate user and return token.  
**Authentication**: None (public endpoint)  
**Consumed by**: Login Screen (`/login.tsx`)

#### Request
```
POST /wp-json/bp-app/v1/login
Content-Type: application/json
```

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | ✅ | Valid email format |
| password | string | ✅ | Non-empty |

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "Rahul",
      "last_name": "Sharma",
      "avatar_url": "https://bharatpansari.com/wp-content/uploads/avatars/user1.jpg"
    }
  },
  "message": "Login successful"
}
```

#### Error Response (401)
```json
{
  "success": false,
  "error": {
    "code": "invalid_credentials",
    "message": "Invalid email or password"
  }
}
```

#### Notes
- Use WordPress user authentication (wp_authenticate)
- Return a JWT or custom token for subsequent authenticated requests
- Token should have a reasonable expiry (7-30 days)
- Currently the app only uses `token` from response. `user` object is constructed from email in mock mode but should come from server in real mode.

---

### 3.7 POST `/register`

**Purpose**: Create new user account.  
**Authentication**: None (public endpoint)  
**Consumed by**: Register Screen (`/register.tsx`)

#### Request
```
POST /wp-json/bp-app/v1/register
Content-Type: application/json
```

#### Request Body
```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "first_name": "Priya",
  "last_name": "Gupta"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | ✅ | Valid email, must be unique |
| password | string | ✅ | Min 6 characters |
| first_name | string | ✅ | Non-empty |
| last_name | string | ❌ | - |

#### Success Response (201)
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "email": "newuser@example.com",
      "first_name": "Priya",
      "last_name": "Gupta",
      "avatar_url": ""
    }
  },
  "message": "Registration successful"
}
```

#### Error Response (422)
```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "An account with this email already exists"
  }
}
```

---

### 3.8 GET `/cart` (Future - Phase 2)

**Purpose**: Fetch user's server-side cart.  
**Authentication**: Required (Bearer token)  
**Consumed by**: Cart Screen (`/(tabs)/cart.tsx`)

> **Current Status**: Cart is managed client-side with Zustand. Server-side cart sync is Phase 2.

#### Request
```
GET /wp-json/bp-app/v1/cart
Authorization: Bearer <token>
```

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "product": { /* Full Product object */ }
      }
    ],
    "subtotal": "398",
    "total": "398",
    "currency": "INR"
  },
  "message": "OK"
}
```

---

### 3.9 POST `/cart/add` (Future - Phase 2)

**Purpose**: Add item to server-side cart.  
**Authentication**: Required  

#### Request Body
```json
{
  "product_id": 1,
  "quantity": 2
}
```

---

### 3.10 POST `/cart/update` (Future - Phase 2)

**Purpose**: Update item quantity in cart.  
**Authentication**: Required  

#### Request Body
```json
{
  "product_id": 1,
  "quantity": 3
}
```

---

### 3.11 POST `/cart/remove` (Future - Phase 2)

**Purpose**: Remove item from cart.  
**Authentication**: Required  

#### Request Body
```json
{
  "product_id": 1
}
```

---

### 3.12 GET `/wishlist` (Future - Phase 2)

**Purpose**: Fetch user's wishlist.  
**Authentication**: Required  
**Consumed by**: Wishlist Screen (`/(tabs)/wishlist.tsx`)

> **Current Status**: Wishlist is managed client-side with Zustand.

---

### 3.13 POST `/wishlist/add` (Future - Phase 2)

#### Request Body
```json
{
  "product_id": 1
}
```

---

### 3.14 POST `/wishlist/remove` (Future - Phase 2)

#### Request Body
```json
{
  "product_id": 1
}
```

---

### 3.15 GET `/orders` (Future - Phase 2)

**Purpose**: Fetch user's order history.  
**Authentication**: Required  
**Consumed by**: Orders Screen (`/orders.tsx`)

#### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 1001,
      "status": "completed",
      "total": "897",
      "currency": "INR",
      "date_created": "2026-01-15T10:30:00Z",
      "items": [
        {
          "product_id": 1,
          "name": "Organic Turmeric Powder",
          "quantity": 2,
          "price": "199",
          "image": "https://bharatpansari.com/wp-content/uploads/products/turmeric.jpg"
        }
      ]
    }
  ],
  "message": "OK"
}
```

---

## 4. TypeScript Models

These are the exact models used in the app at `/app/frontend/src/models/types.ts`:

```typescript
// ═══════════════════════════════════════════
// PRODUCT & CATEGORY MODELS
// ═══════════════════════════════════════════

export interface ProductImage {
  id: number;          // Required - Image attachment ID
  src: string;         // Required - Full URL to image
  alt: string;         // Required - Alt text for accessibility
}

export interface Product {
  id: number;                        // Required - WooCommerce product ID
  name: string;                      // Required - Product title
  slug: string;                      // Required - URL-safe slug
  description: string;               // Required - Full HTML/text description
  short_description: string;         // Required - Brief description (1-2 lines)
  price: string;                     // Required - Current selling price (string for precision)
  regular_price: string;             // Required - Original price before discount
  sale_price: string;                // Required - Discounted price (same as regular_price if no sale)
  currency: string;                  // Required - "INR"
  images: ProductImage[];            // Required - At least 1 image
  category_ids: number[];            // Required - Array of category IDs
  category_slugs: string[];          // Required - Array of category slugs
  stock_status: 'instock' | 'outofstock' | 'onbackorder'; // Required
  average_rating: string;            // Required - "0" to "5" (string)
  rating_count: number;              // Required - Total number of ratings
  attributes: ProductAttribute[];    // Required - Can be empty array []
  related_products: number[];        // Required - Array of related product IDs
}

export interface ProductAttribute {
  name: string;          // Required - e.g., "Weight", "Size", "Origin"
  options: string[];     // Required - e.g., ["100g", "250g", "500g"]
}

export interface Category {
  id: number;            // Required - WooCommerce category ID
  name: string;          // Required - Category name
  slug: string;          // Required - URL-safe slug
  description: string;   // Required - Category description
  image: string;         // Required - Full URL to category image
  parent_id: number;     // Required - Parent category ID (0 = top level)
  count: number;         // Required - Number of products
}

// ═══════════════════════════════════════════
// CART & WISHLIST MODELS
// ═══════════════════════════════════════════

export interface CartItem {
  product_id: number;    // Required
  product: Product;      // Required - Full product object
  quantity: number;      // Required - Min 1
}

export interface WishlistItem {
  product_id: number;    // Required
  product: Product;      // Required - Full product object
  added_at: string;      // Required - ISO 8601 date string
}

// ═══════════════════════════════════════════
// USER & AUTH MODELS
// ═══════════════════════════════════════════

export interface User {
  id: number;            // Required
  email: string;         // Required
  first_name: string;    // Required
  last_name: string;     // Required (can be "")
  avatar_url: string;    // Required (can be "")
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
  country: string;       // "IN" for India
  phone: string;
}

// ═══════════════════════════════════════════
// ORDER MODELS
// ═══════════════════════════════════════════

export interface Order {
  id: number;
  status: string;        // "pending", "processing", "completed", "cancelled", "refunded"
  total: string;
  currency: string;
  date_created: string;  // ISO 8601
  items: OrderItem[];
}

export interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  price: string;
  image: string;         // Product image URL
}

// ═══════════════════════════════════════════
// API & PAGE DATA MODELS
// ═══════════════════════════════════════════

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
  categories: Category[];        // Top 6-8 categories
  featured_products: Product[];  // 4-6 featured products
  new_arrivals: Product[];       // 4-6 newest products
  popular_products: Product[];   // 4-6 most popular
}

export interface Banner {
  id: number;
  image: string;         // Full URL
  title: string;
  subtitle: string;
  link?: string;         // Optional deep link (e.g., "/category/ayurvedic")
}
```

---

## 5. Screen-to-Endpoint Mapping

| Screen | Route | Endpoint(s) | Auth Required |
|--------|-------|-------------|---------------|
| Home | `/(tabs)/index.tsx` | `GET /home` | ❌ |
| Categories | `/(tabs)/categories.tsx` | `GET /categories` | ❌ |
| Category Products | `/category/[slug].tsx` | `GET /products?category={slug}` | ❌ |
| Product Detail | `/product/[id].tsx` | `GET /products/{id}` | ❌ |
| Search | `/(tabs)/search.tsx` | `GET /search?q={query}` | ❌ |
| Cart | `/(tabs)/cart.tsx` | Client-side (Zustand) | ❌ |
| Wishlist | `/(tabs)/wishlist.tsx` | Client-side (Zustand) | ❌ |
| Account | `/(tabs)/account.tsx` | None (static UI) | ❌ |
| Login | `/login.tsx` | `POST /login` | ❌ |
| Register | `/register.tsx` | `POST /register` | ❌ |
| Orders | `/orders.tsx` | `GET /orders` (future) | ✅ |
| Privacy Policy | `/privacy-policy.tsx` | None (static content) | ❌ |
| Terms | `/terms.tsx` | None (static content) | ❌ |
| Delete Account | `/delete-account.tsx` | `POST /account/delete` (future) | ✅ |

---

## 6. Mock Data Structure

The mock data is located at: `/app/frontend/src/constants/mockData.ts`

### Categories (8 total)
| ID | Name | Slug | Count |
|----|------|------|-------|
| 1 | Herbs & Spices | herbs-spices | 24 |
| 2 | Ayurvedic | ayurvedic | 18 |
| 3 | Honey & Ghee | honey-ghee | 12 |
| 4 | Herbal Tea | herbal-tea | 15 |
| 5 | Oils | oils | 10 |
| 6 | Seeds & Nuts | seeds-nuts | 20 |
| 7 | Powders | powders | 14 |
| 8 | Wellness | wellness | 16 |

### Products (12 total)
| ID | Name | Price | Regular | Categories |
|----|------|-------|---------|------------|
| 1 | Organic Turmeric Powder | ₹199 | ₹249 | herbs-spices, powders |
| 2 | Ashwagandha Root Powder | ₹349 | ₹449 | ayurvedic, powders |
| 3 | Raw Forest Honey | ₹499 | ₹599 | honey-ghee |
| 4 | A2 Desi Cow Ghee | ₹699 | ₹799 | honey-ghee |
| 5 | Tulsi Green Tea | ₹249 | ₹299 | herbal-tea |
| 6 | Chamomile Herbal Tea | ₹299 | ₹349 | herbal-tea |
| 7 | Cold Pressed Coconut Oil | ₹399 | ₹499 | oils |
| 8 | Triphala Churna | ₹179 | ₹229 | ayurvedic, powders |
| 9 | Chia Seeds Premium | ₹299 | ₹399 | seeds-nuts |
| 10 | Mixed Dry Fruits Pack | ₹599 | ₹749 | seeds-nuts |
| 11 | Moringa Leaf Powder | ₹249 | ₹329 | powders, wellness |
| 12 | Kashmiri Saffron | ₹899 | ₹1099 | herbs-spices |

### Banners (3 total)
| ID | Title | Subtitle |
|----|-------|----------|
| 1 | Pure & Natural | Discover Ayurvedic wellness products |
| 2 | Fresh Arrivals | Organic herbs & spices collection |
| 3 | Special Offers | Up to 30% off on selected items |

### Home Page Data Distribution
- `featured_products`: Products 1-6
- `new_arrivals`: Products 7-12
- `popular_products`: Products 3, 10, 1, 4, 12, 2

---

## 7. Switching from Mock to Real API

### Step-by-Step Checklist

#### Step 1: Deploy WordPress Plugin
- Register REST API routes under namespace `bp-app/v1`
- Implement all endpoints from Section 3
- Test each endpoint independently (Postman/cURL)

#### Step 2: Update App Config
Edit `/app/frontend/src/constants/config.ts`:
```typescript
export const Config = {
  API_BASE_URL: 'https://bharatpansari.com',  // ← Your domain
  WP_API_NAMESPACE: '/wp-json/bp-app/v1',
  USE_MOCK: false,  // ← Change to false
  ...
};
```

#### Step 3: Update Environment Variable
Edit `/app/frontend/.env`:
```
EXPO_PUBLIC_BACKEND_URL=https://bharatpansari.com
```

#### Step 4: Verify API Client
The API client at `/app/frontend/src/services/api.ts` already handles both modes:
```typescript
// When USE_MOCK is false, it calls:
// https://bharatpansari.com/wp-json/bp-app/v1/{endpoint}
```

#### Step 5: Test Each Screen
- Home → Verify banners, categories, products load
- Categories → Verify all categories display
- Category Products → Verify filtering works
- Product Detail → Verify single product loads
- Search → Verify search returns relevant results
- Login/Register → Verify authentication works

#### Step 6: Handle Authentication Token
After login, store the token and pass it in subsequent authenticated requests:
```
Authorization: Bearer <token>
```

The app currently stores the token in Zustand (in-memory). For persistence, consider adding AsyncStorage.

---

## 8. Assumptions Made in the App

| # | Assumption | Impact if Wrong |
|---|-----------|-----------------|
| 1 | All prices are in INR (string format, no decimals needed for Indian market) | Update `CURRENCY_SYMBOL` and parsing logic |
| 2 | Product images are full URLs (not relative paths) | Images won't load if relative |
| 3 | Categories have images (category thumbnails set in WooCommerce) | Empty images show placeholder |
| 4 | `sale_price` equals `regular_price` when product is not on sale | Sale badge may show incorrectly |
| 5 | `stock_status` is one of: "instock", "outofstock", "onbackorder" | Unknown statuses won't display correctly |
| 6 | `average_rating` is a string "0" to "5" (can have decimals like "4.5") | Star display may break |
| 7 | `related_products` contains valid product IDs | Related section may show errors |
| 8 | All product attributes are simple key-value pairs (not variations) | Variation logic not implemented |
| 9 | Cart and Wishlist are client-side only (no server sync in Phase 1) | Data lost on app reinstall |
| 10 | No pagination is implemented yet (all products loaded at once) | Performance issue with large catalogs |
| 11 | Search is performed on the server side (not client-side filter) | Need server implementation |
| 12 | Banners are manually managed (not auto-generated) | Need admin panel for banner management |

---

## 9. Missing Backend Features for Future Phases

### Phase 2 (Next Priority)
| Feature | Endpoint Needed | Description |
|---------|----------------|-------------|
| Server-side Cart | `GET/POST /cart/*` | Sync cart across devices |
| Server-side Wishlist | `GET/POST /wishlist/*` | Sync wishlist across devices |
| Order Placement | `POST /orders` | Create order from cart |
| Order History | `GET /orders` | User's past orders |
| Payment Integration | `POST /checkout` | WooCommerce payment gateways |
| Address Management | `GET/POST/PUT/DELETE /addresses` | Saved delivery addresses |
| Account Deletion | `POST /account/delete` | GDPR/compliance |

### Phase 3 (Future)
| Feature | Endpoint Needed | Description |
|---------|----------------|-------------|
| Product Reviews | `GET/POST /products/{id}/reviews` | User reviews & ratings |
| Coupon Validation | `POST /cart/apply-coupon` | Validate & apply coupon codes |
| Push Notifications | Token registration endpoint | FCM/APNs token storage |
| Product Variations | Extended product model | Size/weight selection |
| Pagination | `?page=&per_page=` params | Handle large product catalogs |
| Sort & Filter | `?orderby=&min_price=&max_price=` | Product listing filters |
| Forgot Password | `POST /forgot-password` | Password reset flow |
| Profile Update | `PUT /profile` | Update name, avatar, etc. |
| Order Tracking | `GET /orders/{id}/tracking` | Shipment tracking info |
| Product Stock Qty | `stock_quantity` field | Show "Only X left" |

### WordPress Plugin Structure (Recommended)
```
bharat-pansari-api/
├── bharat-pansari-api.php          (Plugin main file)
├── includes/
│   ├── class-bp-api.php            (Main API class)
│   ├── class-bp-auth.php           (Authentication handler)
│   ├── class-bp-products.php       (Product endpoints)
│   ├── class-bp-categories.php     (Category endpoints)
│   ├── class-bp-search.php         (Search endpoint)
│   ├── class-bp-cart.php           (Cart endpoints - Phase 2)
│   ├── class-bp-orders.php         (Order endpoints - Phase 2)
│   └── class-bp-home.php           (Home aggregation endpoint)
├── helpers/
│   ├── response-helper.php         (Standardize API responses)
│   └── auth-helper.php             (JWT token generation/validation)
└── readme.txt
```

### Example WordPress Plugin Endpoint Registration
```php
<?php
// In class-bp-products.php
add_action('rest_api_init', function() {
    register_rest_route('bp-app/v1', '/products', [
        'methods'  => 'GET',
        'callback' => 'bp_get_products',
        'permission_callback' => '__return_true', // Public
    ]);
    
    register_rest_route('bp-app/v1', '/products/(?P<id>\d+)', [
        'methods'  => 'GET',
        'callback' => 'bp_get_single_product',
        'permission_callback' => '__return_true',
    ]);
});

function bp_get_products($request) {
    $category = $request->get_param('category');
    $args = ['post_type' => 'product', 'posts_per_page' => 20];
    
    if ($category) {
        $args['tax_query'] = [[
            'taxonomy' => 'product_cat',
            'field'    => 'slug',
            'terms'    => $category,
        ]];
    }
    
    // ... fetch and format products ...
    
    return new WP_REST_Response([
        'success' => true,
        'data'    => $formatted_products,
        'message' => 'OK'
    ], 200);
}
```

---

## Quick Reference Card

| What | Where |
|------|-------|
| App config (USE_MOCK, API_BASE_URL) | `/app/frontend/src/constants/config.ts` |
| API client (all fetch logic) | `/app/frontend/src/services/api.ts` |
| TypeScript models | `/app/frontend/src/models/types.ts` |
| Mock data | `/app/frontend/src/constants/mockData.ts` |
| Cart state | `/app/frontend/src/stores/useCartStore.ts` |
| Wishlist state | `/app/frontend/src/stores/useWishlistStore.ts` |
| Auth state | `/app/frontend/src/stores/useAuthStore.ts` |
| Environment variables | `/app/frontend/.env` |

---

*Document generated for Bharat Pansari WordPress plugin development team.*
