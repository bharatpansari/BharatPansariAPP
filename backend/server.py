from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# WordPress API proxy config
WP_BASE_URL = "https://bharatpansari.com"
WP_API_NAMESPACE = "/wp-json/bp-app/v1"

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# ═══════════════════════════════════════════════
# WordPress API Proxy - bypasses CORS
# ═══════════════════════════════════════════════

async def proxy_wp_request(endpoint: str, params: dict = None):
    """Proxy requests to WordPress REST API, bypassing CORS."""
    url = f"{WP_BASE_URL}{WP_API_NAMESPACE}{endpoint}"
    try:
        async with httpx.AsyncClient(timeout=20.0) as http_client:
            response = await http_client.get(url, params=params)
            return JSONResponse(content=response.json(), status_code=response.status_code)
    except httpx.TimeoutException:
        return JSONResponse(
            content={"success": False, "error": {"code": "timeout", "message": "WordPress API request timed out"}},
            status_code=504
        )
    except Exception as e:
        logger.error(f"WordPress proxy error: {e}")
        return JSONResponse(
            content={"success": False, "error": {"code": "proxy_error", "message": "Failed to reach WordPress API"}},
            status_code=502
        )

@api_router.get("/wp/home")
async def wp_home():
    return await proxy_wp_request("/home")

@api_router.get("/wp/categories")
async def wp_categories():
    return await proxy_wp_request("/categories")

@api_router.get("/wp/products")
async def wp_products(category: str = None, page: int = 1, per_page: int = 50):
    params = {"page": page, "per_page": per_page}
    if category:
        params["category"] = category
    return await proxy_wp_request("/products", params)

@api_router.get("/wp/products/{product_id}")
async def wp_product_detail(product_id: int):
    return await proxy_wp_request(f"/products/{product_id}")

@api_router.get("/wp/search")
async def wp_search(q: str = ""):
    return await proxy_wp_request("/search", {"q": q})

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
