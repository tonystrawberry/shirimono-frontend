<template>
  <div class="space-y-4">
    <div class="flex items-center space-x-4">
      <h3 class="text-2xl font-bold text-white">{{ point.title }}</h3>
      <div class="text-violet-400">({{ point.kana }})</div>
    </div>

    <div class="space-y-2">
      <div class="text-violet-400">{{ point.meanings.join(', ') }}</div>
      <div class="flex gap-2">
        <span v-for="type in point.types" :key="type" class="px-2 py-1 bg-violet-900/50 rounded text-sm text-violet-300">
          {{ type }}
        </span>
      </div>
    </div>

    <div v-if="point.example_sentences.length" class="space-y-3">
      <h4 class="text-sm font-medium text-violet-400">Example Sentences</h4>
      <div v-for="example in point.example_sentences" :key="example.id" class="bg-violet-900/50 rounded-lg p-4 space-y-2">
        <div v-html="example.sentence_html" class="text-white"></div>
        <div class="text-violet-400">{{ example.translation }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type VocabularyPoint } from '~/types/pointOfTheDay'

const props = defineProps<{
  point: VocabularyPoint
}>()
</script>

<script lang="ts">
export default {
  name: 'VocabularyOfTheDay'
}
</script>