# CRITICAL BLOCKER: CORS Policy Blocking WordPress API

## Issue Summary
All API calls from the Expo frontend to the WordPress REST API at `https://bharatpansari.com` are being blocked by CORS (Cross-Origin Resource Sharing) policy.

## Error Message
```
Access to fetch at 'https://bharatpansari.com/wp-json/bp-app/v1/home' 
from origin 'https://admiring-wiles-10.preview.emergentagent.com' 
has been blocked by CORS policy: Response to preflight request doesn't 
pass access control check: It does not have HTTP ok status.
```

## Affected Endpoints
- ❌ GET /home - Home page data
- ❌ GET /categories - Categories list
- ❌ GET /search?q=guggal - Search results
- ❌ GET /products?category=agarbatti - Category products
- ❌ GET /products/1767 - Product details

## What's Working
- ✅ App UI loads correctly
- ✅ Onboarding flow works
- ✅ Tab navigation works
- ✅ Error handling shows user-friendly messages
- ✅ Cart/Wishlist (client-side Zustand) work
- ✅ Search UI works (but API calls fail)

## What's NOT Working
- ❌ Home screen shows blank content (no banners, categories, products)
- ❌ Categories tab shows error: "Unable to connect"
- ❌ Search returns "No results found" (API call failed)
- ❌ Cannot test any real product data
- ❌ Cannot verify Phase 1A requirements

## Root Cause
When the browser makes a fetch() request to a different origin (bharatpansari.com), it first sends a preflight OPTIONS request. The WordPress server is not configured to:
1. Accept OPTIONS requests
2. Return proper CORS headers
3. Allow cross-origin requests from the Expo preview domain

## Recommended Solution: Backend Proxy

Create proxy endpoints in `/app/backend/server.py` to handle WordPress API calls server-side:

### Implementation Steps:

1. **Add proxy routes to backend** (`/app/backend/server.py`):
```python
import httpx

@api_router.get("/wp-proxy/home")
async def proxy_home():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://bharatpansari.com/wp-json/bp-app/v1/home")
        return response.json()

@api_router.get("/wp-proxy/categories")
async def proxy_categories():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://bharatpansari.com/wp-json/bp-app/v1/categories")
        return response.json()

@api_router.get("/wp-proxy/products")
async def proxy_products(category: str = None):
    url = "https://bharatpansari.com/wp-json/bp-app/v1/products"
    if category:
        url += f"?category={category}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

@api_router.get("/wp-proxy/products/{product_id}")
async def proxy_product_detail(product_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://bharatpansari.com/wp-json/bp-app/v1/products/{product_id}")
        return response.json()

@api_router.get("/wp-proxy/search")
async def proxy_search(q: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://bharatpansari.com/wp-json/bp-app/v1/search?q={q}")
        return response.json()
```

2. **Add httpx to requirements.txt**:
```
httpx
```

3. **Update frontend config** (`/app/frontend/src/constants/config.ts`):
```typescript
export const Config = {
  API_BASE_URL: process.env.EXPO_PUBLIC_BACKEND_URL || 'https://admiring-wiles-10.preview.emergentagent.com',
  WP_API_NAMESPACE: '/api/wp-proxy',  // Changed from '/wp-json/bp-app/v1'
  USE_MOCK: false,
  // ... rest of config
};
```

4. **Update frontend .env** (`/app/frontend/.env`):
```
EXPO_PUBLIC_BACKEND_URL=https://admiring-wiles-10.preview.emergentagent.com
```

### Why This Works:
- Frontend calls: `https://admiring-wiles-10.preview.emergentagent.com/api/wp-proxy/home`
- Backend (server-side) calls: `https://bharatpansari.com/wp-json/bp-app/v1/home`
- No CORS issues because:
  - Frontend → Backend: Same origin (no CORS)
  - Backend → WordPress: Server-to-server (no CORS restrictions)

## Alternative Solutions

### Option 2: Configure WordPress CORS Headers
Requires WordPress admin access. Add to `.htaccess` or use a plugin:
```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type"
```

**Pros**: Simple if you have WordPress access
**Cons**: Requires WordPress admin access, security considerations

### Option 3: CORS Proxy Service
Use a third-party CORS proxy (NOT recommended for production)

## Testing After Fix
Once CORS is resolved, retest:
1. Home screen loads real banners (Agarbatti, Bhasams, Dhoop)
2. Categories tab shows real categories
3. Click Agarbatti → shows real products (Kuch Bhi, Sugandh Agarbatti, Rose Agarbatti)
4. Product detail ID 1767 → shows "Kuch Bhi" with price ₹2, regular price ₹10
5. Search "guggal" → returns Raw Guggal and Haridarshan Guggal Cup
6. Search "xyzabc123" → shows empty state
7. Products with empty price → show "Price on request"
8. Featured Products section hidden (0 products from API)

## Screenshots
- `/tmp/home_after_api_call.png` - Blank home screen due to CORS
- `/tmp/categories_tab_cors.png` - Categories error message
- `/tmp/search_guggal_result.png` - Search showing "No results found" (API failed)
- Console logs: `/root/.emergent/automation_output/20260508_065416/console_20260508_065416.log`

## Impact
**CRITICAL BLOCKER** - Cannot proceed with Phase 1A testing until CORS is resolved. All WordPress API integration is non-functional.
