import { API_BASE_URL } from '../config'
import { useApiFetch } from '~/composables/useApiFetch'

type CoursePointType = 'CourseKanji' | 'CourseVocabulary' | 'CourseGrammar'

export interface CoursePoint {
  id: string
  type: CoursePointType
}

export interface Course {
  id: string
  title: string
}

export interface Review {
  id: string
  memorization_status: string
  number_of_total_reviews: number
  number_of_correct_reviews: number
  next_review_at: string
  course: Course
  course_point: CoursePoint
}

export interface UserReviewsResponse {
  user_reviews: Review[]
}

export function useUserReviewsV1() {
  async function fetchUserReviews() {
    const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/user_reviews`, {
      method: 'GET'
    }).execute()

    const response = data.value as UserReviewsResponse
    return response?.user_reviews || []
  }

  async function submitCorrectReview(
    courseSlug: string,
    coursePointType: string,
    coursePointId: number,
    pointExerciseType: string,
    pointExerciseId: number
  ) {
    const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/user_reviews/correct_review`, {
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