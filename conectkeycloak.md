# Guía de Conexión Keycloak (Ecosistema Tanian)

Esta guía detalla cómo integrar cualquier aplicación web en el sistema de autenticación centralizada de Tanian utilizando Keycloak. Esto permite que una sola cuenta de usuario sirva para todos los proyectos (**SSO - Single Sign-On**).

## 1. Configuración en el Panel de Keycloak

Para cada nueva aplicación, debes crear un "Client" en el panel de administración de Keycloak (`https://auth.tanian.net`).

### Pasos Generales:
1.  **Realm**: Asegúrate de estar en el Realm `EmpresaProd`.
2.  **Create Client**:
    *   **Client ID**: El nombre identificativo de tu app (ej: `mi-proyecto`).
    *   **Client Protocol**: `openid-connect`.
3.  **Client Settings**:
    *   **Access Type**: `public` (para apps frontend tipo React/Vite).
    *   **Standard Flow Enabled**: `On`.
    *   **Direct Access Grants Enabled**: `On` (opcional).

### URLs Críticas (Configuración de Redirección):
Estas opciones son vitales para que Keycloak sepa a dónde devolver al usuario con seguridad.
*   **Valid Redirect URIs**: 
    *   Local: `http://localhost:XXXX/*` (donde XXXX es tu puerto de desarrollo).
    *   Producción: `https://app.tanian.net/*`.
*   **Web Origins**: 
    *   Pon `+` (esto permite que los orígenes coincidan con las Redirect URIs para CORS).
*   **Valid Post Logout Redirect URIs**:
    *   Siempre incluye: `https://carlosrevert.es/*`.
    *   Esto permite que al cerrar sesión, Keycloak acepte devolver al usuario al portal principal.

---

## 2. Configuración de Entorno (.env)

Toda aplicación debe tener estas variables configuradas para conectar con el servidor central:

```env
# Conexión con el servidor de autenticación
VITE_KEYCLOAK_URL=https://auth.tanian.net
VITE_KEYCLOAK_REALM=EmpresaProd
VITE_KEYCLOAK_CLIENT_ID=tu-client-id-aqui

# Rutas de redirección
VITE_AUTH_REDIRECT_URI=https://tu-app.tanian.net
VITE_AUTH_LOGOUT_REDIRECT_URL=https://carlosrevert.es
```

---

## 3. Implementación en Código (React + Vite)

### Dependencias
Instala el adapter oficial (asegúrate de que coincida con la versión del servidor, actualmente v26):
```bash
bun add keycloak-js
```

### Lógica de Inicialización (`lib/auth.ts`)
Configura Keycloak para que el login sea obligatorio al entrar en la web:

```typescript
import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
})

export const initializeAuth = async () => {
  return await keycloak.init({
    onLoad: 'login-required', // Forza redirección al login si no hay sesión
    pkceMethod: 'S256',       // Obligatorio para seguridad moderna
    checkLoginIframe: false,
  })
}
```

### Flujo de Logout Robusto
Utiliza este patrón para asegurar que la sesión se cierre tanto en la app como en Keycloak:

```typescript
export const logout = async () => {
  const redirectUri = "https://carlosrevert.es";
  
  try {
    // Intento oficial
    await keycloak.logout({ redirectUri });
  } catch (err) {
    // Fallback manual si el adapter falla
    const logoutUrl = keycloak.createLogoutUrl({ redirectUri });
    window.location.assign(logoutUrl);
  }
}
```

---

## 4. Consideraciones Técnicas

### Firewall y Red
*   **Puerto 443**: El servidor de Keycloak (`auth.tanian.net`) debe ser accesible vía HTTPS desde el navegador del cliente.
*   **Puertos Locales**: Si desarrollas en local, asegúrate de que el puerto (ej: 5173 o 5215) esté en la lista blanca de "Valid Redirect URIs" en el panel de Keycloak.

### Single Sign-On (SSO)
Debido a que todas las apps usan el mismo Realm (`EmpresaProd`) y la misma URL de base, Keycloak detectará automáticamente la sesión. Si el usuario se logea en una app y luego visita otra, el método `init` de Keycloak detectará la cookie de sesión y entrará automáticamente sin pedir credenciales de nuevo.

### Seguridad
*   Utiliza siempre **PKCE**.
*   No guardes secretos del cliente en el frontend (usa `Access Type: public`).
