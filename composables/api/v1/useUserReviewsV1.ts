import { API_BASE_URL } from '../config'
import { useApiFetch } from '~/composables/useApiFetch'
import type { CourseLevelGrammar, CourseLevelKanji, CourseLevelVocabulary } from './useUserCourseLevelsV1'
import type { Exercise } from './useCourseLevelsV1'

type CoursePointType = 'CourseLevelKanji' | 'CourseLevelVocabulary' | 'CourseLevelGrammar'

export interface CoursePoint {
  id: string
  type: CoursePointType
}

export interface Course {
  id: string
  title: string
  slug: string
}

export interface UserReviewKanji {
  id: string
  memorization_status: string
  number_of_total_reviews: number
  number_of_correct_reviews: number
  next_review_at: string
  kanji_id: number
  user_course_level_kanji_link_id: number
  kanji_exercise_id: number,
  course: Course
  course_level_kanji: CourseLevelKanji
}

export interface UserReviewVocabulary {
  id: string
  memorization_status: string
  number_of_total_reviews: number
  number_of_correct_reviews: number
  next_review_at: string
  vocabulary_id: number
  user_course_level_vocabulary_link_id: number
  vocabulary_exercise_id: number,
  course: Course
  course_level_vocabulary: CourseLevelVocabulary
}

export interface UserReviewGrammar {
  id: string
  memorization_status: string
  number_of_total_reviews: number
  number_of_correct_reviews: number
  next_review_at: string
  grammar_id: number
  user_course_level_grammar_link_id: number
  grammar_exercise_id: number,
  course: Course
  course_level_grammar: CourseLevelGrammar
}

export interface DueReviewKanji {
  id: number;
  memorization_status: string;
  number_of_total_reviews: number;
  number_of_correct_reviews: number;
  next_review_at: string;
  kanji_exercise: Exercise;
  pointType: 'kanji' | 'vocabulary' | 'grammar';
}

export interface DueReviewVocabulary {
  id: number;
  memorization_status: string;
  number_of_total_reviews: number;
  number_of_correct_reviews: number;
  next_review_at: string;
  vocabulary_exercise: Exercise;
  pointType: 'vocabulary';
}

export interface DueReviewGrammar {
  id: number;
  memorization_status: string;
  number_of_total_reviews: number;
  number_of_correct_reviews: number;
  next_review_at: string;
  grammar_exercise: Exercise;
  pointType: 'grammar';
}

export interface DueReviewsResponse {
  user_review_kanjis: DueReviewKanji[]
  user_review_vocabularies: DueReviewVocabulary[]
  user_review_grammars: DueReviewGrammar[]
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

  async function fetchDueReviews(): Promise<DueReviewsResponse> {
    const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/user_reviews/due_reviews`, {
      method: 'GET'
    }).execute()

    const response = data.value as DueReviewsResponse
    return {
      user_review_kanjis: response?.user_review_kanjis || [],
      user_review_vocabularies: response?.user_review_vocabularies || [],
      user_review_grammars: response?.user_review_grammars || []
    }
  }

  async function submitCorrectReview(
    courseSlug: string,
    position: number,
    pointExerciseType: string,
    pointExerciseId: number
  ) {
    const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/user_reviews/correct_review`, {
      method: 'POST',
      body: {
        course_slug: courseSlug,
        position: position,
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
    fetchDueReviews,
    submitCorrectReview,
    submitIncorrectReview
  }
}