import { useAuth } from './useAuth'
import { useUsersStore } from '~/stores/users'

export const useApiFetch = (url: string, options: {
  method: "GET" | "HEAD" | "PATCH" | "POST" | "PUT" | "DELETE",
  headers?: object,
  body?: any,
  immediate?: boolean
} = { method: "GET", immediate: false }) => {

  const pending = ref(false)
  const error = ref<unknown>(null)
  const data = ref<unknown>(null)
  const { getAuthTokens, setAuthTokens, clearAuthTokens } = useAuth()
  const usersStore = useUsersStore()

  const execute = async () => {
    const tokens = getAuthTokens()

    pending.value = true
    error.value = null

    try {
      const result = await $fetch(url, {
        method: options.method,
        body: options.body,
        headers: {
          ...options.headers,
          'access-token': tokens?.accessToken || '',
          client: tokens?.client || '',
          expiry: tokens?.expiry || '',
          uid: tokens?.uid || '',
        },
        onResponse({ response }) {
          const headers = response.headers

          if (headers.get('access-token')) {
            setAuthTokens({
              accessToken: headers.get('access-token')!,
              client: headers.get('client')!,
              expiry: headers.get('expiry')!,
              uid: headers.get('uid')!
            })
          }
        },
        onResponseError({ response }) {
          if (response.status === 401) {
            // Clear both auth tokens and user state
            clearAuthTokens()
            usersStore.clearUser()
            navigateTo('/')
          }
        }
      })

      data.value = result
      return { data: ref(result), pending, error }
    } catch (err) {
      error.value = err
      throw err
    } finally {
      pending.value = false
    }
  }

  // Execute immediately if requested
  if (options.immediate) {
    execute()
  }

  return {
    data: readonly(data),
    pending: readonly(pending),
    error: readonly(error),
    execute
  }
}
