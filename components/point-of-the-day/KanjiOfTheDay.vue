<template>
  <div class="space-y-4">
    <div class="flex items-center space-x-4">
      <h3 class="text-2xl font-bold text-white">{{ point.title }}</h3>
      <div class="text-indigo-400">({{ point.meanings.join(', ') }})</div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="bg-indigo-900/50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-indigo-400 mb-2">Kunyomi</h4>
        <div class="text-white">{{ point.kunyomi_readings.join('、') }}</div>
      </div>
      <div class="bg-indigo-900/50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-indigo-400 mb-2">Onyomi</h4>
        <div class="text-white">{{ point.onyomi_readings.join('、') }}</div>
      </div>
    </div>

    <div v-if="point.example_sentences.length" class="space-y-3">
      <h4 class="text-sm font-medium text-indigo-400">Example Sentences</h4>
      <div v-for="example in point.example_sentences" :key="example.id" class="bg-indigo-900/50 rounded-lg p-4 space-y-2">
        <div v-html="example.sentence_html" class="text-white"></div>
        <div class="text-indigo-400">{{ example.translation }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type KanjiPoint } from '~/types/pointOfTheDay'

const props = defineProps<{
  point: KanjiPoint
}>()
</script>

<script lang="ts">
export default {
  name: 'KanjiOfTheDay'
}
</script>