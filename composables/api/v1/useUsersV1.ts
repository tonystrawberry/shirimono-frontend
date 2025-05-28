import { ref } from 'vue'
import { API_BASE_URL } from '../config'
import { useApiFetch } from '~/composables/useApiFetch'
import { useAuth } from '~/composables/useAuth'

export interface User {
  id: string
  email: string
  name: string
}

export const useUsersV1 = () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const { getAuthTokens } = useAuth()

  const fetchUser = async () => {
    // Don't fetch if we don't have auth tokens
    const tokens = getAuthTokens()
    if (!tokens) {
      return null
    }

    loading.value = true
    error.value = null

    console.log("calling fetchUser")

    try {
      const { data, error: fetchError } = await useApiFetch(`${API_BASE_URL}/api/v1/user`, {
        method: 'GET'
      }).execute()

      console.log("data", data.value)

      if (data.value) {
        return data.value as User
      }

      if (fetchError.value) {
        throw fetchError.value
      }

      return null
    } catch (e) {
      console.log("error", e)
      error.value = e as Error
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchUser
  }
}
