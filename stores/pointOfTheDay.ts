import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { type PointOfTheDay } from '~/types/pointOfTheDay'
import { usePointOfTheDayV1 } from '~/composables/api/v1/usePointOfTheDayV1'

export const usePointOfTheDayStore = defineStore('pointOfTheDay', () => {
  const pointOfTheDay = ref<PointOfTheDay | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const api = usePointOfTheDayV1()

  const fetchPointOfTheDay = async () => {
    loading.value = true
    error.value = null

    try {
      pointOfTheDay.value = await api.fetchPointOfTheDay()
    } catch (e) {
      error.value = e as Error
      pointOfTheDay.value = null
    } finally {
      loading.value = false
    }
  }

  // Computed properties to help with type checking
  const isKanji = computed(() =>
    pointOfTheDay.value?.point.type === 'kanji'
  )

  const isVocabulary = computed(() =>
    pointOfTheDay.value?.point.type === 'vocabulary'
  )

  const isGrammar = computed(() =>
    pointOfTheDay.value?.point.type === 'grammar'
  )

  return {
    pointOfTheDay,
    loading,
    error,
    fetchPointOfTheDay,
    isKanji,
    isVocabulary,
    isGrammar
  }
})