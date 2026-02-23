# Roadmap de Implementación: Home Tanian - Catálogo de Aplicaciones Exclusivo

Este documento detalla el plan de acción para construir `home.tanian.net`, el portal central de nuestro ecosistema digital. No se trata solo de un índice de enlaces, sino de una **declaración de intenciones técnica y visual**: un escaparate de nuestras capacidades en IA y Blockchain.

## 1. Visión y Objetivos

El objetivo es crear una "Landing Page Experiencial" que cumpla tres funciones críticas:
1.  **Brand Authority**: Demostrar expertise técnico mediante un diseño de vanguardia y alto rendimiento.
2.  **Centralized Access**: Punto de entrada único para todas las aplicaciones del ecosistema.
3.  **Seamless Authentication**: Integración fluida con Keycloak (`auth.tanian.net`) para una experiencia de usuario sin fricción.

## 2. Arquitectura "Speed Stack" (Standard Vercel Native)

Seguiremos estrictamente la arquitectura de alto rendimiento definida para el proyecto, garantizando velocidad, robustez y mantenibilidad.

### Frontend
*   **Runtime**: `Bun` (Velocidad de instalación y ejecución superior).
*   **Framework**: `React` + `Vite` + `TypeScript` (SPA moderna y tipada).
*   **Styling**: `Tailwind CSS` + `Shadcn/UI` (Componentes accesibles y elegantes) + `Framer Motion` (Animaciones complejas).
*   **State Management**: `Zustand` (Para gestionar el estado de autenticación y datos de las apps de forma ligera).
*   **Routing**: `React Router` (Aunque sea una sola página principal, preparamos la estructura para escalabilidad).

### Backend (API Layer)
*   **Language**: `Python` + `FastAPI` (Asíncrono y robusto).
*   **Función**: Servir metadatos dinámicos de las aplicaciones y realizar "Health Checks" en tiempo real para mostrar el estado de los servicios (Online/Offline).
*   **Validation**: `Pydantic` (Esquemas de datos estrictos).

### Infraestructura y Seguridad
*   **Auth**: Integración directa con **Keycloak** vía OIDC (OpenID Connect) usando la librería `keycloak-js`.
*   **Puerto**: Configuración de Vite/Server para exponer el servicio en el puerto `5200`.

## 3. Estrategia de Diseño y UX (Mejoras Propuestas)

Para cumplir con el requerimiento de "excepcional, profesional y elegante", propongo las siguientes mejoras sobre la idea original:

### A. Concepto Visual: "Tech Glass & Neon"
En lugar de una web plana, utilizaremos profundidad y luz.
*   **Fondo Dinámico**: Un background sutilmente animado (partículas conectadas o mallas 3D abstractas usando `Three.js` o `tsparticles`) que reaccione al movimiento del ratón, simbolizando la red neuronal (IA) y la descentralización (Blockchain).
*   **Glassmorphism**: Las tarjetas de las apps tendrán fondos translúcidos con "blur" (efecto cristal esmerilado), bordes sutiles y sobras de colores neón que indiquen su categoría (IA = Azul/Cian, Blockchain = Violeta/Oro).

### B. Estructura de la Página (Scroll Experience)
La navegación será una experiencia narrativa vertical:

1.  **Hero Section (Impacto Inmediato)**:
    *   Título tipográfico grande y moderno: "Building the Future of Intelligence".
    *   Subtítulo rotativo: "AI Solutions • Blockchain Architecture • Custom Software".
    *   Call to Action (CTA) principal que invita a descubrir el ecosistema.

2.  **Services Showcase (Lo que hacemos)**:
    *   Sección intermedia con iconos animados que explica brevemente nuestras áreas de expertise antes de llegar a las apps.

3.  **The App Catalog (El Core)**:
    *   **Interactive Cards**: Tarjetas de gran formato (como solicitaste).
    *   **Estado en Tiempo Real**: Un pequeño indicador (punto verde/rojo) en la esquina de la tarjeta que muestra si la app está operativa (haciendo ping al backend).
    *   **Video Preview on Hover**: Al pasar el ratón, la imagen estática de la app cobra vida o muestra un breve video loop de la interfaz.
    *   **Smart Actions**:
        *   *Usuario Anónimo*: Botón "Log in to Access" con un candado sutil.
        *   *Usuario Autenticado*: Botón "Launch App" brillante y pulsante.

4.  **Footer Institucional**: Enlaces a contacto, status page y copyright.

## 4. Roadmap de Ejecución

### Fase 1: Scaffolding y Configuración Base
1.  Inicializar proyecto con `Bun` + `Vite` (React TS).
2.  Configurar `Tailwind CSS` y `Shadcn/UI`.
3.  Configurar Proxy en `vite.config.ts` para conectar con el backend FastAPI.
4.  Establecer el puerto de desarrollo y producción en `5200`.

### Fase 2: Backend de Metadatos (FastAPI)
1.  Crear estructura `/api`.
2.  Definir modelo `AppSchema` con Pydantic (Nombre, Descripción, URL, Icono, Estado).
3.  Crear endpoint `GET /api/apps` que devuelva el listado de aplicaciones (inicialmente mockeado, luego base de datos o config file).
4.  (Opcional) Endpoint de Health Check real.

### Fase 3: Frontend Core & Keycloak
1.  Implementar `AuthProvider` usando `keycloak-js`.
    *   Configurar cliente `home-client` apuntando a `auth.tanian.net`.
    *   Manejar redirecciones de login/logout.
2.  Crear componentes base: `Hero`, `AppCard`, `ServiceBadge`.
3.  Conectar Frontend con Backend para obtener la lista de apps.

### Fase 4: Polish & "Wow Factors"
1.  Implementar animaciones de entrada con `Framer Motion` (las tarjetas aparecen suavemente al hacer scroll).
2.  Añadir efectos de hover y glassmorphism.
3.  Optimización de assets y SEO (meta tags y títulos dinámicos).

## 5. Datos Mockeados Iniciales (Para las Cards)

**App 1: Tanian AI Suite**
*   **Desc**: Plataforma de generación de contenido y análisis predictivo potenciada por LLMs de última generación.
*   **Tech**: Python, PyTorch, React.
*   **Url**: `ai.tanian.net`

**App 2: BlockLedger Explorer**
*   **Desc**: Explorador de bloques y auditoría de Smart Contracts en tiempo real para redes EVM compatibles.
*   **Tech**: Solidity, Node.js, Web3.js.
*   **Url**: `ledger.tanian.net`

**App 3: Omni CRM**
*   **Desc**: Gestión de clientes y automatización de flujos de trabajo adaptativa para grandes empresas.
*   **Tech**: Docker, Postgres, FastAPI.
*   **Url**: `crm.tanian.net`

---

### Siguientes Pasos
Una vez aprobado este roadmap, procederé a ejecutar la **Fase 1** (Instalación y Configuración del entorno en el puerto 5200).
