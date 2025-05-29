import { ref } from 'vue'
import { API_BASE_URL } from '../config'
import { useApiFetch } from '~/composables/useApiFetch'

export interface Course {
  id: string
  title: string
  slug: string
  kanjis_count: number
  grammars_count: number
  vocabularies_count: number
  course_level_kanjis_count: number
  course_level_vocabularies_count: number
  course_level_grammars_count: number
  created_at: string
  updated_at: string
}

export interface CoursesResponse {
  courses: Course[]
}

export interface CoursePoint {
  id: number
  title: string
  meaning: string
}

export interface CourseLevel {
  id: number
  position: number
  title: string
  description: string
  points: CoursePoint[]
}

export interface CourseLevelsResponse {
  course: {
    id: string
    slug: string
    title: string
    course_level_kanjis_count: number
    course_level_vocabularies_count: number
    course_level_grammars_count: number
    levels: CourseLevel[]
  }
}

export const useCoursesV1 = () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchCourses = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/courses`, {
        method: 'GET'
      }).execute()

      const response = data.value as CoursesResponse
      return response?.courses || []
    } catch (e) {
      console.error("Error fetching courses:", e)
      error.value = e as Error
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchCourseLevels = async (slug: string, pointType: 'kanji' | 'vocabulary' | 'grammar') => {
    loading.value = true
    error.value = null

    try {
      const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/courses/${slug}.json?point_type=${pointType}`, {
        method: 'GET'
      }).execute()

      const response = data.value as CourseLevelsResponse
      return response?.course || null
    } catch (e) {
      console.error("Error fetching course levels:", e)
      error.value = e as Error
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchCourses,
    fetchCourseLevels
  }
}