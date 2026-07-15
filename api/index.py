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
        id="nc-elevacion",
        name="NcElevación",
        short_description="Web avanzada de venta de carretillas elevadoras CLARK con navegación autónoma impulsada por IA.",
        description=(
            "**NcElevación** es una plataforma de venta online tecnológicamente diferencial, diseñada como distribuidor oficial de la prestigiosa marca **CLARK**.\n\n"
            "Más allá de ofrecer catálogos interactivos y comparadores avanzados de maquinaria, esta web integra un **asistente virtual (RAG)** de última generación "
            "que conoce en profundidad cada detalle de la empresa y las especificaciones técnicas de todos los productos del catálogo.\n\n"
            "El mayor salto tecnológico es su **sistema de navegación inteligente**: la IA no solo responde, sino que detecta la verdadera necesidad del cliente y "
            "tiene la capacidad de **navegar por la web en nombre del usuario**. Esto puede hacerse pidiendo permiso de forma interactiva (modo asistente) "
            "o ejecutando acciones completas hasta encontrar el producto ideal (modo autónomo).\n\n"
            "Un salto hacia el futuro del B2B y la venta industrial, donde la tecnología local se pone al completo servicio del usuario final."
        ),
        tech=["IA Autónoma", "RAG", "Catálogo Inteligente", "Asistente Virtual", "Agentes Reactivos"],
        url="https://ncelevacion.com/",
        category=AppCategory.enterprise,
        status=AppStatus.online,
        image_url="/assets/nc-elevacion.png",
    ),
    AppSchema(
        id="rag-juridico",
        name="Asistente Jurídico",
        short_description="Plataforma avanzada de análisis de documentos y asistencia jurídica potenciada por inteligencia artificial.",
        description=(
            "Un chat inteligente que responde preguntas sobre **legislación española** de **forma precisa y trazable**.\n\n"
            "Este sistema ejecuta un modelo de inteligencia artificial en nuestros **servidores locales** —**sin depender de servicios externos**— "
            "y tiene acceso a toda la legislación consolidada del **Boletín Oficial del Estado (BOE)**.\n\n"
            "Cuando realizas una consulta, el sistema busca automáticamente en una **base de datos vectorial** los artículos más relevantes, "
            "los analiza y genera una respuesta fundamentada exclusivamente en la **legislación vigente**. "
            "Además, proporciona **enlaces directos** a la página oficial del BOE para que puedas verificar y profundizar en cada fuente citada.\n\n"
            "Este sistema es **totalmente personalizable**: puede adaptarse a cualquier sector regulado "
            "(normativa fiscal, laboral, medioambiental, sanitaria…) y a cualquier empresa que necesite consultar legislación de forma rápida y fiable."
        ),
        tech=["IA Local", "RAG", "Base de Datos Vectorial", "Python", "FastAPI"],
        url="https://ia.tanian.net/",
        category=AppCategory.ai,
        status=AppStatus.offline,
        image_url="/assets/rag-juridico.png",
    ),
    AppSchema(
        id="transcriptor",
        name="Transcriptor Inteligente",
        short_description="Servicio de transcripción de audio a texto de alta precisión con segmentación y análisis de locutores.",
        description=(
            "Una herramienta que convierte **audio en texto** y lo transforma automáticamente en **informes útiles**.\n\n"
            "Seleccionas un modo según el tipo de audio —reuniones, lluvia de ideas, tareas, desarrollo de software o sesiones de terapia— "
            "y el sistema transcribe la grabación con **alta precisión**.\n\n"
            "Después, un modelo de IA procesa el texto según el modo elegido: "
            "genera **actas de reuniones**, **listas de tareas priorizadas**, **resúmenes de ideas** o **informes clínicos estructurados**. "
            "El verdadero poder está en no perder nunca la información valiosa de una conversación: "
            "cada palabra queda registrada, organizada y lista para compartir con personas ausentes o para futuras consultas.\n\n"
            "Este sistema es **adaptable a cualquier empresa**: desde equipos que necesitan documentar sus reuniones, "
            "hasta clínicas que requieren historiales de sesiones o departamentos creativos que quieren capturar cada idea."
        ),
        tech=["IA Local", "Speech-to-Text", "LLM", "React", "Whisper"],
        url="https://voice.home.tanian.net/",
        category=AppCategory.ai,
        status=AppStatus.offline,
        image_url="/assets/transcriptor.png",
    ),
    AppSchema(
        id="chat-ia-local",
        name="Chat IA Privada",
        short_description="Interfaz de chat potente impulsada por modelos de inteligencia artificial ejecutados en servidores privados.",
        description=(
            "Una interfaz de chat potente impulsada por modelos de inteligencia artificial que se ejecutan íntegramente en los **servidores de tu empresa**.\n\n"
            "A diferencia de otros servicios como ChatGPT o Gemini, toda la información se **procesa en local**: "
            "ningún dato sale de tus instalaciones, lo que garantiza la **privacidad total** y la **soberanía de tus datos**. "
            "Es la forma segura de impulsar la productividad de tus empleados con IA, sin el riesgo de filtrar información confidencial "
            "sobre clientes, proyectos o estrategias de negocio. **TODO SE QUEDA EN CASA**.\n\n"
            "Estos modelos se pueden equipar con herramientas personalizadas: acceso a **bases de datos internas**, "
            "generación de documentos, análisis de datos, **automatización de tareas** y mucho más.\n\n"
            "Es ideal para cualquier empresa que quiera usar inteligencia artificial avanzada con **total control** sobre su información."
        ),
        tech=["IA Local", "LLM", "React", "TypeScript", "API Privada"],
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
        app_item.model_copy(update={"status": status})
        for app_item, status in zip(MOCK_APPS, checks, strict=True)
    ]
    return AppListResponse(apps=hydrated_apps, generated_at=datetime.now(UTC))
