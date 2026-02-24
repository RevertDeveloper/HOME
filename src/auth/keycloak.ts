import Keycloak from 'keycloak-js'

let keycloak: Keycloak | null = null

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
    initPromise = instance.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      redirectUri: window.location.origin,
    }).then((isAuthenticated) => ({ instance, isAuthenticated }))
  }

  return initPromise
}
