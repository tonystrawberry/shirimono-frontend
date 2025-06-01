import { ref } from 'vue'
import { API_BASE_URL } from '../config'
import { useApiFetch } from '~/composables/useApiFetch'

export interface CourseLevel {
  id: string
  title: string
  description: string
  position: number
  point_type: 'kanji' | 'vocabulary' | 'grammar'
  kanjis?: Kanji[]
  vocabularies?: Vocabulary[]
  grammars?: Grammar[]
}

export interface Kanji {
  id: string
  title: string
  meanings: string[]
  kunyomi_readings: string[]
  onyomi_readings: string[]
  related_kanjis: RelatedKanji[]
  example_sentences: ExampleSentence[],
  exercises: Exercise[]
}

export interface RelatedKanji {
  id: string
  title: string
  meanings: string[]
}

type CoursePointType = 'CourseLevelKanji' | 'CourseLevelVocabulary' | 'CourseLevelGrammar'

export interface Vocabulary {
  id: string
  title: string
  kana: string
  meanings: string[]
  types: string[]
  synonyms: VocabReference[]
  antonyms: VocabReference[]
  example_sentences: ExampleSentence[]
  exercises: Exercise[]
}

export interface VocabReference {
  id: string
  title: string
  kana: string
  meanings: string[]
}

export interface Grammar {
  id: string
  title: string
  meanings: string[]
  example_sentences: ExampleSentence[]
  exercises: Exercise[]
}

export interface ExampleSentence {
  id: string
  sentence: string
  sentence_html: string
  translation: string
}

export interface Exercise {
  id: number
  question: string
  exercise_type: string
  question_types: string[]
  accepted_answers: string[]
  wrong_answers: string[],
  numberOfCorrectAnswers?: number
}

export interface CourseLevelResponse {
  course_level: CourseLevel
}

export const useCourseLevelsV1 = () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchCourseLevel = async (courseSlug: string, pointType: string, position: number) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/courses/${courseSlug}/course_levels/${pointType}/${position}`, {
        method: 'GET'
      }).execute()

      const response = data.value as CourseLevelResponse
      return response?.course_level || null
    } catch (e) {
      console.error("Error fetching course level:", e)
      error.value = e as Error
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchCourseLevel
  }
}