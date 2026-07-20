import type { AppItem } from '../types/app.ts'

export const fallbackApps: AppItem[] = [
  {
    id: "nc-elevacion",
    name: "CLARK",
    short_description: "Plataforma B2B de catálogo, comparación y venta asistida de maquinaria de elevación.",
    description:
      "Desarrollé **CLARK** como un producto comercial completo para maquinaria de alto valor, donde una compra convencional no resuelve la necesidad del cliente. La experiencia integra catálogo, filtros, fichas técnicas, comparador responsive, carrito y solicitudes de presupuesto.\n\nEl asistente incorpora **RAG y búsqueda semántica** para entender las necesidades del usuario, recomendar productos y navegar de forma contextual hacia fichas y comparativas. Así, la IA no aparece como un añadido: forma parte del proceso de descubrimiento y captación comercial.\n\nEste proyecto demuestra cómo convierto especificaciones complejas en una **experiencia accesible**, conectando frontend, backend, datos e IA local en un único producto preparado para evolucionar.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "pgvector", "RAG", "LLM local"],
    url: "https://clark.carlosrevert.es/",
    category: "enterprise",
    image_url: "/assets/nc-elevacion.png",
    status: "online",
  },
  {
    id: "rag-juridico",
    name: "JURIDIA",
    short_description: "Sistema RAG para consultar normativa española con respuestas fundamentadas y fuentes verificables.",
    description:
      "Construí **JURIDIA** para convertir un corpus jurídico masivo en respuestas útiles sin perder la trazabilidad. El sistema trabaja con más de **12.000 disposiciones**, **600.000 artículos** y cerca de **700.000 vectores indexados**.\n\nLa arquitectura combina PostgreSQL como fuente documental, Qdrant para recuperación vectorial y un pipeline que normaliza, enriquece y expande cada consulta antes de recuperar los artículos completos. Cada respuesta enlaza a la fuente oficial del **BOE**.\n\nEs una muestra de cómo diseño sistemas RAG especializados donde la calidad depende del contexto, el chunking y la estrategia de recuperación, no solo del modelo utilizado.",
    tech: ["Python", "React", "PostgreSQL", "Qdrant", "RAG", "Docker"],
    url: "https://juridia.carlosrevert.es/",
    category: "ai",
    image_url: "/assets/rag-juridico.png",
    status: "online",
  },
  {
    id: "transcriptor",
    name: "Transcriptor con IA",
    short_description: "Aplicación que convierte audio en transcripciones e informes estructurados sobre infraestructura propia.",
    description:
      "Desarrollé este producto para transformar grabaciones y archivos de audio en **información lista para utilizar**. Permite grabar desde el navegador, subir archivos, controlar trabajos largos y generar informes adaptados a distintos contextos.\n\nLa solución desacopla React, FastAPI, PostgreSQL y una cola de procesamiento. **Whisper** realiza la transcripción y un LLM estructura, resume o transforma el contenido, con persistencia por usuario y retención temporal controlada de los audios.\n\nEl resultado demuestra mi capacidad para integrar interfaz, API, tareas asíncronas, modelos de IA y despliegue self-hosted en escenarios donde la **privacidad y el control del dato** son parte del producto.",
    tech: ["FastAPI", "React", "PostgreSQL", "Whisper", "LLM", "Docker"],
    url: "https://transcriptor.carlosrevert.es/",
    category: "ai",
    image_url: "/assets/transcriptor.png",
    status: "online",
  },
]
