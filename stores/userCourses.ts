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

        // Use userReviewsStore to get the number of completed kanji, vocabulary, and grammar reviews
        const userReviewsStore = useUserReviewsStore()

        const kanjiReviews = userReviewsStore.reviews.filter(review => review.course_point.type === 'CourseLevelKanji' && review.course.id === course.id)
        const vocabularyReviews = userReviewsStore.reviews.filter(review => review.course_point.type === 'CourseLevelVocabulary' && review.course.id === course.id)
        const grammarReviews = userReviewsStore.reviews.filter(review => review.course_point.type === 'CourseLevelGrammar' && review.course.id === course.id)

        // Get unique number of reviews.course_point.id by type
        const uniqueKanjiReviews = new Set(kanjiReviews.map(review => review.course_point.id))
        const uniqueVocabularyReviews = new Set(vocabularyReviews.map(review => review.course_point.id))
        const uniqueGrammarReviews = new Set(grammarReviews.map(review => review.course_point.id))

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          progress: {
            kanji: {
              completed: uniqueKanjiReviews.size,
              total: courseTotals.kanjis_count
            },
            vocabulary: {
              completed: uniqueVocabularyReviews.size,
              total: courseTotals.vocabularies_count
            },
            grammar: {
              completed: uniqueGrammarReviews.size,
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