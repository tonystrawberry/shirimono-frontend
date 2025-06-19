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

interface CourseLevelKanji {
  id: number
  title: string
  description: string
  position: number
  course_level_kanji_links_count: number
  course: Course
}

interface CourseLevelGrammar {
  id: number
  title: string
  description: string
  position: number
  course_level_grammar_links_count: number
  course: Course
}

interface CourseLevelVocabulary {
  id: number
  title: string
  description: string
  position: number
  course_level_vocabulary_links_count: number
  course: Course
}

interface UserCourseLevelKanji {
  id: number
  status: CourseLevelStatus
  created_at: string
  updated_at: string
  course_level_kanji: CourseLevelKanji
}

interface UserCourseLevelGrammar {
  id: number
  status: CourseLevelStatus
  created_at: string
  updated_at: string
  course_level_grammar: CourseLevelGrammar
}

interface UserCourseLevelVocabulary {
  id: number
  status: CourseLevelStatus
  created_at: string
  updated_at: string
  course_level_vocabulary: CourseLevelVocabulary
}

interface UserCourseLevelsResponse {
  user_course_level_kanjis: UserCourseLevelKanji[]
  user_course_level_vocabularies: UserCourseLevelVocabulary[]
  user_course_level_grammars: UserCourseLevelGrammar[]
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

export type { Course, CourseLevel, CourseLevelKanji, CourseLevelGrammar, CourseLevelVocabulary, UserCourseLevelKanji, UserCourseLevelGrammar, UserCourseLevelVocabulary, UserCourseLevelsResponse }