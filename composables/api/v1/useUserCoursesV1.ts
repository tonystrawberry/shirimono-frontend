import { ref } from 'vue'
import { API_BASE_URL } from '../config'
import { useApiFetch } from '~/composables/useApiFetch'

export interface Course {
  id: string
  title: string
  slug: string
}

export interface UserCourse {
  id: string
  kanji_user_reviews_count: number
  vocabulary_user_reviews_count: number
  grammar_user_reviews_count: number
  course: Course
}

export interface UserCoursesResponse {
  user_courses: UserCourse[]
}

export const useUserCoursesV1 = () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchUserCourses = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/user_courses`, {
        method: 'GET'
      }).execute()

      console.log("data", data.value)

      const response = data.value as UserCoursesResponse
      return response?.user_courses || []
    } catch (e) {
      console.error("Error fetching user courses:", e)
      error.value = e as Error
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchUserCourses
  }
}