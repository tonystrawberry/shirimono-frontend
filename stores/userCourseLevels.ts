import { defineStore } from 'pinia'
import { useUserCourseLevelsV1, type UserCourseLevel, type CourseLevelStatus } from '~/composables/api/v1/useUserCourseLevelsV1'

interface UserCourseLevelsState {
  userCourseLevels: UserCourseLevel[]
  loading: boolean
  error: Error | null
}

export const useUserCourseLevelsStore = defineStore('userCourseLevels', {
  state: (): UserCourseLevelsState => ({
    userCourseLevels: [],
    loading: false,
    error: null
  }),

  getters: {
    getLevelStatus: (state) => (levelId: number): CourseLevelStatus | null => {
      const userLevel = state.userCourseLevels.find(
        level => level.course_level.id === levelId
      )
      return userLevel?.status || null
    }
  },

  actions: {
    async fetchUserCourseLevels() {
      this.loading = true
      this.error = null

      try {
        const { fetchUserCourseLevels } = useUserCourseLevelsV1()
        const response = await fetchUserCourseLevels()
        this.userCourseLevels = response.user_course_levels
      } catch (err) {
        this.error = err as Error
        this.userCourseLevels = []
      } finally {
        this.loading = false
      }
    }
  }
})