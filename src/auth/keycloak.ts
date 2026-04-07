import Keycloak from 'keycloak-js'

let keycloak: Keycloak | null = null
const KEYCLOAK_INIT_TIMEOUT_MS = 8000

function buildConfig() {
  return {
    url: import.meta.env.VITE_KEYCLOAK_URL ?? 'https://auth.tanian.net',
    realm: import.meta.env.VITE_KEYCLOAK_REALM ?? 'EmpresaProd',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'home-client',
  }
}

export function getKeycloak() {
  if (!keycloak) {
    keycloak = new Keycloak(buildConfig())
  }

  return keycloak
}

let initPromise: Promise<{ instance: Keycloak; isAuthenticated: boolean }> | null = null

export async function initKeycloak() {
  const instance = getKeycloak()

  if (!initPromise) {
    const initRequest = instance
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      })
      .then((isAuthenticated) => ({ instance, isAuthenticated }))

    const timeoutRequest = new Promise<{ instance: Keycloak; isAuthenticated: boolean }>((_, reject) => {
      window.setTimeout(() => {
        reject(new Error('Keycloak initialization timed out'))
      }, KEYCLOAK_INIT_TIMEOUT_MS)
    })

    initPromise = Promise.race([initRequest, timeoutRequest])
  }

  return initPromise
}
