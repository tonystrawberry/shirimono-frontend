import { defineStore } from 'pinia'
import { useUsersV1, type User } from '~/composables/api/v1/useUsersV1'

export const useUsersStore = defineStore('users', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as Error | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user
  },

  actions: {
    async getUser() {
      this.loading = true
      this.error = null

      try {
        const { fetchUser } = useUsersV1()
        const userData = await fetchUser()

        this.user = userData
        return userData
      } catch (err) {
        this.error = err as Error
        this.user = null
        throw err
      } finally {
        this.loading = false
      }
    },

    setUser(user: User | null) {
      this.user = user
    },

    clearUser() {
      this.user = null
      this.error = null
    }
  }
})