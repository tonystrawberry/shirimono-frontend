import { ref } from 'vue'
import { API_BASE_URL } from '../config'
import { useApiFetch } from '~/composables/useApiFetch'
import { type PointOfTheDay } from '~/types/pointOfTheDay'

export const usePointOfTheDayV1 = () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchPointOfTheDay = async (): Promise<PointOfTheDay> => {
    loading.value = true
    error.value = null

    try {
      const { data } = await useApiFetch(`${API_BASE_URL}/api/v1/point_of_the_days/today`, {
        method: 'GET'
      }).execute()

      const response = data.value as { point_of_the_day: PointOfTheDay }
      return response.point_of_the_day
    } catch (e) {
      console.error('Error fetching point of the day:', e)
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchPointOfTheDay,
  }
}