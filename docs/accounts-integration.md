# Integración de cuenta compartida

Home es completamente público y no ejecuta ni reserva interacciones de IA. La cabecera consulta en paralelo `auth/me` y `applications`; para una sesión activa también carga `usage/summary`.

Las peticiones usan cookies compartidas con `credentials: include`. No se guardan tokens en `localStorage`. El cierre de sesión usa CSRF y la navegación de acceso, registro y cuenta se realiza en `https://cuenta.carlosrevert.es`, preservando la URL de retorno.

Variable opcional de build: `VITE_ACCOUNTS_ORIGIN=https://cuenta.carlosrevert.es`.

No se encontró integración Keycloak activa. Los vestigios históricos, si se incorporan en el futuro, deben permanecer como legacy sin recuperación de datos.
