import { useCookie, useRuntimeConfig } from '#app'

export interface AuthTokens {
  accessToken: string
  client: string
  uid: string
  expiry: string
}

export const useAuth = () => {
  const config = useRuntimeConfig()
  const isDev = config.public.environment === 'development'

  // Common cookie options
  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    // Only use secure in production
    secure: !isDev,
    // Allow JavaScript access in development for debugging
    httpOnly: !isDev,
    sameSite: 'lax' as const // Less strict for local development
  }

  const accessTokenCookie = useCookie('access-token', cookieOptions)
  const clientCookie = useCookie('client', cookieOptions)
  const uidCookie = useCookie('uid', cookieOptions)
  const expiryCookie = useCookie('expiry', cookieOptions)

  const setAuthTokens = (tokens: AuthTokens) => {
    console.log("setting auth tokens", tokens)
    accessTokenCookie.value = tokens.accessToken
    clientCookie.value = tokens.client
    uidCookie.value = tokens.uid
    expiryCookie.value = tokens.expiry
  }

  const getAuthTokens = (): AuthTokens | null => {
    if (!accessTokenCookie.value || !clientCookie.value || !uidCookie.value || !expiryCookie.value) {
      return null
    }

    return {
      accessToken: accessTokenCookie.value,
      client: clientCookie.value,
      uid: uidCookie.value,
      expiry: expiryCookie.value
    }
  }

  const clearAuthTokens = () => {
    accessTokenCookie.value = null
    clientCookie.value = null
    uidCookie.value = null
    expiryCookie.value = null
  }

  return {
    setAuthTokens,
    getAuthTokens,
    clearAuthTokens
  }
}