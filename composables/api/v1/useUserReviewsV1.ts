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

export const useUserReviewsV1 = () => {
  const fetchUserReviews = async () => {
    const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/user_reviews`, {
      method: 'GET'
    }).execute()

    const response = data.value as UserReviewsResponse
    return response?.user_reviews || []
  }

  return {
    fetchUserReviews
  }
}