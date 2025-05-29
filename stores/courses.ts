import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCoursesV1, type Course, type CourseLevel } from '~/composables/api/v1/useCoursesV1'

interface CourseLevelsMap {
  [courseSlug: string]: {
    kanji: CourseLevel[]
    vocabulary: CourseLevel[]
    grammar: CourseLevel[]
  }
}

export const useCoursesStore = defineStore('courses', () => {
  const coursesV1 = useCoursesV1()

  const courses = ref<Course[]>([])
  const courseLevels = ref<CourseLevelsMap>({})
  const loading = ref(false)
  const loadingLevels = ref(false)
  const error = ref<Error | null>(null)
  const levelsError = ref<Error | null>(null)

  const fetchCourses = async () => {
    if (courses.value.length > 0) return courses.value

    loading.value = true
    error.value = null

    try {
      courses.value = await coursesV1.fetchCourses()
      return courses.value
    } catch (e) {
      console.error('Error fetching courses:', e)
      error.value = e as Error
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchCourseLevels = async (slug: string, pointType: 'kanji' | 'vocabulary' | 'grammar') => {
    loadingLevels.value = true
    levelsError.value = null

    try {
      // Initialize the course levels map for this course if it doesn't exist
      if (!courseLevels.value[slug]) {
        courseLevels.value[slug] = {
          kanji: [],
          vocabulary: [],
          grammar: []
        }
      }

      // If we already have the data for this point type, return it
      if (courseLevels.value[slug][pointType].length > 0) {
        return courseLevels.value[slug][pointType]
      }

      // Fetch and store the data
      const response = await coursesV1.fetchCourseLevels(slug, pointType)
      if (response) {
        courseLevels.value[slug][pointType] = response.levels
        return response.levels
      }
      return []
    } catch (e) {
      console.error('Error fetching course levels:', e)
      levelsError.value = e as Error
      return []
    } finally {
      loadingLevels.value = false
    }
  }

  const getCourseLevels = (slug: string, pointType: 'kanji' | 'vocabulary' | 'grammar') => {
    return courseLevels.value[slug]?.[pointType] || []
  }

  return {
    courses,
    courseLevels,
    loading,
    loadingLevels,
    error,
    levelsError,
    fetchCourses,
    fetchCourseLevels,
    getCourseLevels
  }
})