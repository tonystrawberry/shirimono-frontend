import { ref } from 'vue'
import { API_BASE_URL } from '../config'
import { useApiFetch } from '~/composables/useApiFetch'

interface Course {
  id: number
  title: string
  slug: string
}

interface CourseLevel {
  id: number
  title: string
  description: string
  position: number
  point_type: string
  course_points_count: number
  course: Course
}

// Course level status values
export type CourseLevelStatus =
  | 'ready'               // Initial state, ready to start
  | 'lessons_not_completed' // User has started but not completed all lessons
  | 'in_progress'         // All lessons completed, working on exercises
  | 'in_progress_advanced' // Working on advanced exercises
  | 'done'                // All exercises completed with required mastery

interface UserCourseLevel {
  id: number
  status: CourseLevelStatus
  created_at: string
  updated_at: string
  course_level: CourseLevel
}

interface UserCourseLevelsResponse {
  user_course_levels: UserCourseLevel[]
}

export function useUserCourseLevelsV1() {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchUserCourseLevels(): Promise<UserCourseLevelsResponse> {
    loading.value = true
    error.value = null

    try {
      const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/user_course_levels`, {
        method: 'GET'
      }).execute()

      return data.value as UserCourseLevelsResponse
    } catch (e) {
      console.error('Error fetching user course levels:', e)
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchUserCourseLevels
  }
}

export type { Course, CourseLevel, UserCourseLevel, UserCourseLevelsResponse }