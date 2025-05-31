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
  course: Course
}

interface Exercise {
  id: number
  question: string
  exercise_type: string
  question_types: string[]
  accepted_answers: string[]
  wrong_answers: string[]
}

interface Kanji {
  id: number
  title: string
  slug: string
  kunyomi_readings: string[]
  onyomi_readings: string[]
  meanings: string[]
  exercises: Exercise[]
}

interface Vocabulary {
  id: number
  title: string
  slug: string
  readings: string[]
  meanings: string[]
  exercises: Exercise[]
}

interface Grammar {
  id: number
  title: string
  slug: string
  explanation: string
  examples: string[]
  exercises: Exercise[]
}

interface KanjiLessonResponse {
  course_level: CourseLevel
  kanjis: Kanji[]
}

interface VocabularyLessonResponse {
  course_level: CourseLevel
  vocabularies: Vocabulary[]
}

interface GrammarLessonResponse {
  course_level: CourseLevel
  grammars: Grammar[]
}

export function useCourseLessonsV1() {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchKanjiLessons(courseSlug: string, position: number): Promise<KanjiLessonResponse> {
    loading.value = true
    error.value = null

    try {
      const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/courses/${courseSlug}/course_lessons/kanjis/${position}`, {
        method: 'GET'
      }).execute()

      return data.value as KanjiLessonResponse
    } catch (e) {
      console.error('Error fetching kanji lessons:', e)
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchVocabularyLessons(courseSlug: string, position: number): Promise<VocabularyLessonResponse> {
    loading.value = true
    error.value = null

    try {
      const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/courses/${courseSlug}/course_lessons/vocabularies/${position}`, {
        method: 'GET'
      }).execute()

      return data.value as VocabularyLessonResponse
    } catch (e) {
      console.error('Error fetching vocabulary lessons:', e)
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchGrammarLessons(courseSlug: string, position: number): Promise<GrammarLessonResponse> {
    loading.value = true
    error.value = null

    try {
      const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/courses/${courseSlug}/course_lessons/grammars/${position}`, {
        method: 'GET'
      }).execute()

      return data.value as GrammarLessonResponse
    } catch (e) {
      console.error('Error fetching grammar lessons:', e)
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchKanjiLessons,
    fetchVocabularyLessons,
    fetchGrammarLessons
  }
}

export type {
  Course,
  CourseLevel,
  Exercise,
  Kanji,
  Vocabulary,
  Grammar,
  KanjiLessonResponse,
  VocabularyLessonResponse,
  GrammarLessonResponse
}