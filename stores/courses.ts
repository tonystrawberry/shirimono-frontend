import { defineStore } from 'pinia'
import { useCoursesV1, type Course } from '~/composables/api/v1/useCoursesV1'

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [] as Course[],
    loading: false,
    error: null as Error | null
  }),

  actions: {
    async fetchCourses() {
      this.loading = true
      this.error = null

      try {
        const { fetchCourses } = useCoursesV1()
        this.courses = await fetchCourses()
      } catch (err) {
        this.error = err as Error
        this.courses = []
      } finally {
        this.loading = false
      }
    }
  }
})