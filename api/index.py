from __future__ import annotations

import asyncio
import os
from datetime import UTC, datetime
from enum import Enum

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


MOCK_APPS: list[AppSchema] = [
    AppSchema(
        id="rag-juridico",
        name="Rag Jurídico",
        description=(
            "Plataforma avanzada de análisis de documentos y asistencia "
            "jurídica potenciada por inteligencia artificial."
        ),
        tech=["Python", "RAG", "FastAPI"],
        url="https://ia.tanian.net/",
        category=AppCategory.ai,
        status=AppStatus.offline,
        image_url="/assets/rag-juridico.png",
    ),
    AppSchema(
        id="transcriptor",
        name="Transcriptor",
        description=(
            "Servicio de transcripción de audio a texto de alta precisión "
            "con segmentación y análisis de locutores."
        ),
        tech=["Whisper", "Bun", "Reaction"],
        url="https://voice.home.tanian.net/",
        category=AppCategory.ai,
        status=AppStatus.offline,
        image_url="/assets/transcriptor.png",
    ),
    AppSchema(
        id="chat-ia-local",
        name="Chat IA Local",
        description=(
            "Chat privado y seguro ejecutando modelos de lenguaje localmente "
            "para garantizar la soberanía de los datos."
        ),
        tech=["Ollama", "React", "TypeScript"],
        url="https://chat.dev.tanian.net/auth?redirect=%2F",
        category=AppCategory.ai,
        status=AppStatus.offline,
        image_url="/assets/chat-ia-local.png",
    ),
]


app = FastAPI(title="Tanian Home API", version="1.0.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "BACKEND_ALLOWED_ORIGINS",
        "http://localhost:5200,http://127.0.0.1:5200,http://localhost:5202,http://127.0.0.1:5202,https://home.tanian.net",
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
        app_item.model_copy(update={"status": status})
        for app_item, status in zip(MOCK_APPS, checks, strict=True)
    ]
    return AppListResponse(apps=hydrated_apps, generated_at=datetime.now(UTC))
