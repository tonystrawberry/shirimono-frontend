<template>
  <div class="bg-gray-900 shadow rounded-lg">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-white">Point of the Day</h2>
        <div v-if="store.pointOfTheDay" class="text-sm text-gray-400">
          {{ new Date(store.pointOfTheDay.featured_on).toLocaleDateString() }}
        </div>
      </div>

      <div v-if="store.loading" class="text-sm text-gray-400">
        Loading point of the day...
      </div>
      <div v-else-if="store.error" class="text-sm text-red-400">
        Error loading point of the day. Please try again later.
      </div>
      <div v-else-if="store.pointOfTheDay">
        <KanjiOfTheDay
          v-if="store.isKanji"
          :point="store.pointOfTheDay.point as KanjiPoint"
        />
        <VocabularyOfTheDay
          v-else-if="store.isVocabulary"
          :point="store.pointOfTheDay.point as VocabularyPoint"
        />
        <GrammarOfTheDay
          v-else-if="store.isGrammar"
          :point="store.pointOfTheDay.point as GrammarPoint"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePointOfTheDayStore } from '~/stores/pointOfTheDay'
import { type KanjiPoint, type VocabularyPoint, type GrammarPoint } from '~/types/pointOfTheDay'
import KanjiOfTheDay from '~/components/point-of-the-day/KanjiOfTheDay.vue'
import VocabularyOfTheDay from '~/components/point-of-the-day/VocabularyOfTheDay.vue'
import GrammarOfTheDay from '~/components/point-of-the-day/GrammarOfTheDay.vue'

const store = usePointOfTheDayStore()

onMounted(() => {
  store.fetchPointOfTheDay()
})
</script>

<script lang="ts">
export default {
  name: 'PointOfTheDay'
}
</script>