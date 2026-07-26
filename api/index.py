from __future__ import annotations

import asyncio
import json
import os
from datetime import UTC, datetime
from enum import Enum
from pathlib import Path

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl


class AppCategory(str, Enum):
    ai = "ai"
    blockchain = "blockchain"
    enterprise = "enterprise"


class AppStatus(str, Enum):
    online = "online"
    offline = "offline"


class AppSchema(BaseModel):
    id: str
    name: str
    short_description: str | None = None
    description: str
    tech: list[str]
    url: HttpUrl
    category: AppCategory
    image_url: str | None = None
    status: AppStatus


class AppListResponse(BaseModel):
    apps: list[AppSchema]
    generated_at: datetime


class HealthResponse(BaseModel):
    status: str
    generated_at: datetime


def load_catalog() -> list[AppSchema]:
    catalog_candidates = (
        Path(__file__).with_name("apps.json"),
        Path(__file__).resolve().parent.parent / "data" / "apps.json",
    )
    catalog_path = next((path for path in catalog_candidates if path.is_file()), None)
    if catalog_path is None:
        raise FileNotFoundError("No app catalog found")

    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    return [AppSchema.model_validate(app) for app in catalog]


MOCK_APPS = load_catalog()


app = FastAPI(title="Carlos Revert Portfolio API", version="1.0.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "BACKEND_ALLOWED_ORIGINS",
        "https://carlosrevert.es,http://localhost:10000,http://127.0.0.1:10000",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


async def check_app_status(url: str) -> AppStatus:
    timeout = httpx.Timeout(3.0, connect=2.0)
    async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
        try:
            response = await client.get(url)
            if response.status_code < 500:
                return AppStatus.online
            return AppStatus.offline
        except httpx.HTTPError:
            return AppStatus.offline


@app.get("/api/health", response_model=HealthResponse)
async def get_health() -> HealthResponse:
    return HealthResponse(status="ok", generated_at=datetime.now(UTC))


@app.get("/api/apps", response_model=AppListResponse)
async def get_apps() -> AppListResponse:
    checks = await asyncio.gather(*(check_app_status(str(app_item.url)) for app_item in MOCK_APPS))
    hydrated_apps = [
        app_item.model_copy(update={"status": app_item.status if app_item.id == "clark" or app_item.status == AppStatus.offline else status})
        for app_item, status in zip(MOCK_APPS, checks, strict=True)
    ]
    return AppListResponse(apps=hydrated_apps, generated_at=datetime.now(UTC))
