import { ref } from 'vue'
import { API_BASE_URL } from '../config'
import { useAuth } from '~/composables/useAuth'
import { useUsersStore } from '~/stores/users'

export interface AuthResponse {
  data: {
    email: string
    uid: string
    id: string
  }
}

export const useAuthV1 = () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const { setAuthTokens } = useAuth()
  const usersStore = useUsersStore()

  const signIn = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<AuthResponse>(`${API_BASE_URL}/api/v1/auth/sign_in`, {
        method: 'POST',
        body: { email, password },
        onResponse({ response }) {
          const headers = response.headers
          const accessToken = headers.get('access-token')
          const client = headers.get('client')
          const uid = headers.get('uid')
          const expiry = headers.get('expiry')

          if (accessToken && client && uid && expiry) {
            setAuthTokens({
              accessToken,
              client,
              uid,
              expiry
            })
          }
        }
      })

      // Set the user in the store
      if (response?.data) {
        await usersStore.getUser() // This will fetch the full user profile
      }

      return response
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  const signUp = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<AuthResponse>(`${API_BASE_URL}/api/v1/auth`, {
        method: 'POST',
        body: { email, password },
        onResponse({ response }) {
          const headers = response.headers
          const accessToken = headers.get('access-token')
          const client = headers.get('client')
          const uid = headers.get('uid')
          const expiry = headers.get('expiry')

          if (accessToken && client && uid && expiry) {
            setAuthTokens({
              accessToken,
              client,
              uid,
              expiry
            })
          }
        }
      })

      // Set the user in the store
      if (response?.data) {
        await usersStore.getUser() // This will fetch the full user profile
      }

      return response
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    signIn,
    signUp
  }
}