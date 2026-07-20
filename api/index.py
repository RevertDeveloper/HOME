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


MOCK_APPS: list[AppSchema] = [
    AppSchema(
        id="clark",
        name="CLARK",
        short_description="Plataforma B2B de catálogo, comparación y venta asistida de maquinaria de elevación.",
        description=(
            "Desarrollé **CLARK** como un producto comercial completo para maquinaria de alto valor, donde una compra convencional no resuelve la necesidad del cliente. "
            "La experiencia integra catálogo, filtros, fichas técnicas, comparador responsive, carrito y solicitudes de presupuesto.\n\n"
            "El asistente incorpora **RAG y búsqueda semántica** para entender las necesidades del usuario, recomendar productos y navegar de forma contextual hacia fichas y comparativas. "
            "Así, la IA no aparece como un añadido: forma parte del proceso de descubrimiento y captación comercial.\n\n"
            "Este proyecto demuestra cómo convierto especificaciones complejas en una **experiencia accesible**, conectando frontend, backend, datos e IA local en un único producto preparado para evolucionar."
        ),
        tech=["Next.js", "TypeScript", "PostgreSQL", "pgvector", "RAG", "LLM local"],
        url="https://clark.carlosrevert.es/",
        category=AppCategory.enterprise,
        status=AppStatus.online,
        image_url="/assets/clark.png",
    ),
    AppSchema(
        id="asistente-juridico",
        name="Asistente Jurídico",
        short_description="Sistema RAG para consultar normativa española con respuestas fundamentadas y fuentes verificables.",
        description=(
            "Construí **Asistente Jurídico** para convertir un corpus jurídico masivo en respuestas útiles sin perder la trazabilidad. "
            "El sistema trabaja con más de **12.000 disposiciones**, **600.000 artículos** y cerca de **700.000 vectores indexados**.\n\n"
            "La arquitectura combina PostgreSQL como fuente documental, Qdrant para recuperación vectorial y un pipeline que normaliza, enriquece y expande cada consulta antes de recuperar los artículos completos. "
            "Cada respuesta enlaza a la fuente oficial del **BOE**.\n\n"
            "Es una muestra de cómo diseño sistemas RAG especializados donde la calidad depende del contexto, el chunking y la estrategia de recuperación, no solo del modelo utilizado."
        ),
        tech=["Python", "React", "PostgreSQL", "Qdrant", "RAG", "Docker"],
        url="https://juridia.carlosrevert.es/",
        category=AppCategory.ai,
        status=AppStatus.online,
        image_url="/assets/rag-juridico.png",
    ),
    AppSchema(
        id="transcriptor",
        name="Transcriptor con IA",
        short_description="Aplicación que convierte audio en transcripciones e informes estructurados sobre infraestructura propia.",
        description=(
            "Desarrollé este producto para transformar grabaciones y archivos de audio en **información lista para utilizar**. "
            "Permite grabar desde el navegador, subir archivos, controlar trabajos largos y generar informes adaptados a distintos contextos.\n\n"
            "La solución desacopla React, FastAPI, PostgreSQL y una cola de procesamiento. **Whisper** realiza la transcripción y un LLM estructura, resume o transforma el contenido, "
            "con persistencia por usuario y retención temporal controlada de los audios.\n\n"
            "El resultado demuestra mi capacidad para integrar interfaz, API, tareas asíncronas, modelos de IA y despliegue self-hosted en escenarios donde la **privacidad y el control del dato** son parte del producto."
        ),
        tech=["FastAPI", "React", "PostgreSQL", "Whisper", "LLM", "Docker"],
        url="https://transcriptor.carlosrevert.es/",
        category=AppCategory.ai,
        status=AppStatus.online,
        image_url="/assets/transcriptor.png",
    ),
    AppSchema(
        id="chat-ia-local",
        name="Chat IA Privada",
        short_description="Actualmente offline. Chat privado con OpenUI para usar modelos de IA locales de forma similar a ChatGPT.",
        description=(
            "Esta aplicación está **actualmente offline**, pero muestra una forma sencilla de acercar la IA local a los equipos mediante **OpenUI**. "
            "Su interfaz de chat permite utilizar modelos de IA alojados en infraestructura propia con una experiencia familiar, similar a ChatGPT.\n\n"
            "Al ejecutar los modelos de forma local, las conversaciones y los datos sensibles permanecen bajo el control de la organización. "
            "Es una alternativa práctica para incorporar IA en el día a día sin renunciar a la **privacidad**, la soberanía del dato y la flexibilidad de elegir los modelos que mejor encajen en cada caso.\n\n"
            "La solución puede ampliarse con herramientas personalizadas, acceso a bases de datos internas, generación de documentos, análisis de datos y automatizaciones."
        ),
        tech=["OpenUI", "IA local", "LLM", "Docker", "Infraestructura privada"],
        url="https://chat.dev.tanian.net/auth?redirect=%2F",
        category=AppCategory.ai,
        status=AppStatus.offline,
        image_url="/assets/chat-ia-local.png",
    ),
]


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
