import { defineStore } from 'pinia'
import { useUserCoursesV1, type UserCourse } from '~/composables/api/v1/useUserCoursesV1'
import { useCoursesStore } from '~/stores/courses'

interface CourseProgress {
  id: string
  title: string
  slug: string
  progress: {
    kanji: {
      completed: number
      total: number
    }
    vocabulary: {
      completed: number
      total: number
    }
    grammar: {
      completed: number
      total: number
    }
  }
}

export const useUserCoursesStore = defineStore('userCourses', {
  state: () => ({
    userCourses: [] as UserCourse[],
    loading: false,
    error: null as Error | null
  }),

  getters: {
    courseProgress: (state): CourseProgress[] => {
      const coursesStore = useCoursesStore()

      return coursesStore.courses.map(course => {
        const userCourse = state.userCourses.find(uc => uc.course.id === course.id)
        const courseTotals = coursesStore.courses.find(c => c.id === course.id)

        if (!courseTotals) {
          return {
            id: course.id,
            title: course.title,
            slug: course.slug,
            progress: {
              kanji: { completed: 0, total: 0 },
              vocabulary: { completed: 0, total: 0 },
              grammar: { completed: 0, total: 0 }
            }
          }
        }

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          progress: {
            kanji: {
              completed: userCourse?.kanji_user_reviews_count || 0,
              total: courseTotals.kanjis_count
            },
            vocabulary: {
              completed: userCourse?.vocabulary_user_reviews_count || 0,
              total: courseTotals.vocabularies_count
            },
            grammar: {
              completed: userCourse?.grammar_user_reviews_count || 0,
              total: courseTotals.grammars_count
            }
          }
        }
      })
    }
  },

  actions: {
    async fetchUserCourses() {
      this.loading = true
      this.error = null

      try {
        const { fetchUserCourses } = useUserCoursesV1()
        this.userCourses = await fetchUserCourses()
      } catch (err) {
        this.error = err as Error
        this.userCourses = []
      } finally {
        this.loading = false
      }
    }
  }
})