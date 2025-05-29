import { defineStore } from 'pinia'
import { useCourseLevelsV1, type CourseLevel } from '~/composables/api/v1/useCourseLevelsV1'

interface CourseLevelsState {
  currentLevel: CourseLevel | null
  loading: boolean
  error: string | null
}

export const useCourseLevelsStore = defineStore('courseLevels', {
  state: (): CourseLevelsState => ({
    currentLevel: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchCourseLevel(courseSlug: string, pointType: string, position: number) {
      this.loading = true
      this.error = null

      try {
        const courseLevelsV1 = useCourseLevelsV1()
        const courseLevel = await courseLevelsV1.fetchCourseLevel(courseSlug, pointType, position)

        if (!courseLevel) {
          throw new Error('Failed to fetch course level')
        }

        this.currentLevel = courseLevel
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch course level'
        console.error('Error fetching course level:', error)
      } finally {
        this.loading = false
      }
    }
  }
})