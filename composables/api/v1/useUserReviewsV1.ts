import { API_BASE_URL } from '../config'
import { useApiFetch } from '~/composables/useApiFetch'

type CoursePointType = 'CourseLevelKanji' | 'CourseLevelVocabulary' | 'CourseLevelGrammar'

export interface CoursePoint {
  id: string
  type: CoursePointType
}

export interface Course {
  id: string
  title: string
}

export interface UserReviewKanji {
  id: string
  memorization_status: string
  number_of_total_reviews: number
  number_of_correct_reviews: number
  next_review_at: string
  kanji_id: number
}

export interface UserReviewVocabulary {
  id: string
  memorization_status: string
  number_of_total_reviews: number
  number_of_correct_reviews: number
  next_review_at: string
  vocabulary_id: number
}

export interface UserReviewGrammar {
  id: string
  memorization_status: string
  number_of_total_reviews: number
  number_of_correct_reviews: number
  next_review_at: string
  grammar_id: number
}

export interface UserReviewsResponse {
  user_review_kanjis: UserReviewKanji[]
  user_review_vocabularies: UserReviewVocabulary[]
  user_review_grammars: UserReviewGrammar[]
}

export function useUserReviewsV1() {
  async function fetchUserReviews(): Promise<UserReviewsResponse> {
    const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/user_reviews`, {
      method: 'GET'
    }).execute()

    const response = data.value as UserReviewsResponse
    return {
      user_review_kanjis: response?.user_review_kanjis || [],
      user_review_vocabularies: response?.user_review_vocabularies || [],
      user_review_grammars: response?.user_review_grammars || []
    }
  }

  async function submitCorrectReview(
    courseSlug: string,
    level: number,
    pointExerciseType: string,
    pointExerciseId: number
  ) {
    const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/user_reviews/correct_review`, {
      method: 'POST',
      body: {
        course_slug: courseSlug,
        level: level,
        point_exercise_type: pointExerciseType,
        point_exercise_id: pointExerciseId
      }
    }).execute()
    return data.value
  }

  async function submitIncorrectReview(
    courseSlug: string,
    coursePointType: string,
    coursePointId: number,
    pointExerciseType: string,
    pointExerciseId: number
  ) {
    const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/user_reviews/incorrect_review`, {
      method: 'POST',
      body: {
        course_slug: courseSlug,
        course_point_type: coursePointType,
        course_point_id: coursePointId,
        point_exercise_type: pointExerciseType,
        point_exercise_id: pointExerciseId
      }
    }).execute()
    return data.value
  }

  return {
    fetchUserReviews,
    submitCorrectReview,
    submitIncorrectReview
  }
}