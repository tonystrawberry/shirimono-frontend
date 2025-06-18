import { defineStore } from 'pinia'
import { useUserReviewsV1, type UserReviewGrammar, type UserReviewKanji, type UserReviewVocabulary } from '~/composables/api/v1/useUserReviewsV1'

interface UserReviewsByDate {
  [date: string]: {
    userReviewKanjis: UserReviewKanji[]
    userReviewVocabularies: UserReviewVocabulary[]
    userReviewGrammars: UserReviewGrammar[]
  }
}

interface CourseProgress {
  courseId: string
  courseTitle: string
  stats: {
    total: number
    correct: number
    byStatus: Record<string, number>
  }
}

export const useUserReviewsStore = defineStore('userReviews', {
  state: () => ({
    userReviewKanjis: [] as UserReviewKanji[],
    userReviewVocabularies: [] as UserReviewVocabulary[],
    userReviewGrammars: [] as UserReviewGrammar[],
    loading: false,
    error: null as Error | null
  }),

  getters: {
    upcomingReviews: (state): UserReviewsByDate => {
      const userReviewsByDate: UserReviewsByDate = {}

      state.userReviewKanjis.forEach(userReviewKanji => {
        const date = new Date(userReviewKanji.next_review_at).toISOString().split('T')[0]
        if (!userReviewsByDate[date]) {
          userReviewsByDate[date] = {
            userReviewKanjis: [],
            userReviewVocabularies: [],
            userReviewGrammars: []
          }
        }
        userReviewsByDate[date].userReviewKanjis.push(userReviewKanji)
      })

      state.userReviewVocabularies.forEach(userReviewVocabulary => {
        const date = new Date(userReviewVocabulary.next_review_at).toISOString().split('T')[0]
        if (!userReviewsByDate[date]) {
          userReviewsByDate[date] = {
            userReviewKanjis: [],
            userReviewVocabularies: [],
            userReviewGrammars: []
          }
        }
        userReviewsByDate[date].userReviewVocabularies.push(userReviewVocabulary)
      })

      state.userReviewGrammars.forEach(userReviewGrammar => {
        const date = new Date(userReviewGrammar.next_review_at).toISOString().split('T')[0]
        if (!userReviewsByDate[date]) {
          userReviewsByDate[date] = {
            userReviewKanjis: [],
            userReviewVocabularies: [],
            userReviewGrammars: []
          }
        }
        userReviewsByDate[date].userReviewGrammars.push(userReviewGrammar)
      })

      return userReviewsByDate
    },

    reviewProgress: (state): CourseProgress[] => {
      // Group reviews by course
      const courseReviews = state.userReviewKanjis.reduce((acc, review) => {
        const courseId = review.id
        if (!acc[courseId]) {
          acc[courseId] = {
            courseId,
            courseTitle: review.kanji_id.toString(),
            userReviewKanjis: []
          }
        }
        acc[courseId].userReviewKanjis.push(review)
        return acc
      }, {} as Record<string, { courseId: string; courseTitle: string; userReviewKanjis: UserReviewKanji[] }>)

      // Calculate stats for each course
      return Object.values(courseReviews).map(({ courseId, courseTitle, userReviewKanjis }) => ({
        courseId,
        courseTitle,
        stats: {
          total: userReviewKanjis.length,
          correct: userReviewKanjis.reduce((sum, review) => sum + review.number_of_correct_reviews, 0),
          byStatus: userReviewKanjis.reduce((acc, review) => {
            acc[review.memorization_status] = (acc[review.memorization_status] || 0) + 1
            return acc
          }, {} as Record<string, number>)
        }
      }))
    }
  },

  actions: {
    async fetchUserReviews() {
      this.loading = true
      this.error = null

      try {
        const { fetchUserReviews } = useUserReviewsV1()
        const reviews = await fetchUserReviews()

        this.userReviewKanjis = reviews.user_review_kanjis
        this.userReviewVocabularies = reviews.user_review_vocabularies
        this.userReviewGrammars = reviews.user_review_grammars
      } catch (err) {
        this.error = err as Error
      } finally {
        this.loading = false
      }
    }
  }
})