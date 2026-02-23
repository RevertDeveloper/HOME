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

export async function initKeycloak() {
  const instance = getKeycloak()
  const isAuthenticated = await instance.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false,
    redirectUri: window.location.origin,
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
  })

  return { instance, isAuthenticated }
}
