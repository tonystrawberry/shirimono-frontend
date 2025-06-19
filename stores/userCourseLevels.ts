import { defineStore } from 'pinia'
import { useUserCourseLevelsV1, type UserCourseLevelKanji, type CourseLevelStatus, type UserCourseLevelGrammar, type UserCourseLevelVocabulary } from '~/composables/api/v1/useUserCourseLevelsV1'

interface UserCourseLevelsState {
  userCourseLevelKanjis: UserCourseLevelKanji[]
  userCourseLevelGrammars: UserCourseLevelGrammar[]
  userCourseLevelVocabularies: UserCourseLevelVocabulary[]
  loading: boolean
  error: Error | null
}

export const useUserCourseLevelsStore = defineStore('userCourseLevels', {
  state: (): UserCourseLevelsState => ({
    userCourseLevelKanjis: [],
    userCourseLevelGrammars: [],
    userCourseLevelVocabularies: [],
    loading: false,
    error: null
  }),

  getters: {
    getLevelStatus: (state) => (type: 'kanji' | 'grammar' | 'vocabulary', levelId: number): CourseLevelStatus | null => {
      switch (type) {
        case 'kanji':
          const userLevelKanji = state.userCourseLevelKanjis.find(
            userCourselevel => userCourselevel.course_level_kanji.id === levelId
          )
          return userLevelKanji?.status || null
        case 'grammar':
          const userLevelGrammar = state.userCourseLevelGrammars.find(
            userCourselevel => userCourselevel.course_level_grammar.id === levelId
          )
          return userLevelGrammar?.status || null
        case 'vocabulary':
          const userLevelVocabulary = state.userCourseLevelVocabularies.find(
            userCourselevel => userCourselevel.course_level_vocabulary.id === levelId
          )
          return userLevelVocabulary?.status || null
      }
    }
  },

  actions: {
    async fetchUserCourseLevels() {
      this.loading = true
      this.error = null

      try {
        const { fetchUserCourseLevels } = useUserCourseLevelsV1()
        const response = await fetchUserCourseLevels()
        this.userCourseLevelKanjis = response.user_course_level_kanjis
        this.userCourseLevelGrammars = response.user_course_level_grammars
        this.userCourseLevelVocabularies = response.user_course_level_vocabularies
      } catch (err) {
        this.error = err as Error
        this.userCourseLevelKanjis = []
        this.userCourseLevelGrammars = []
        this.userCourseLevelVocabularies = []
      } finally {
        this.loading = false
      }
    }
  }
})