<template>
  <div class="space-y-4">
    <div class="flex items-center space-x-4">
      <h3 class="text-2xl font-bold text-white">{{ point.title }}</h3>
    </div>

    <div class="space-y-2">
      <div class="text-teal-400">{{ point.meanings.join(', ') }}</div>
    </div>

    <div v-if="point.example_sentences.length" class="space-y-3">
      <h4 class="text-sm font-medium text-teal-400">Example Sentences</h4>
      <div v-for="example in point.example_sentences" :key="example.id" class="bg-teal-900/50 rounded-lg p-4 space-y-2">
        <div v-html="example.sentence_html" class="text-white"></div>
        <div class="text-teal-400">{{ example.translation }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type GrammarPoint } from '~/types/pointOfTheDay'

const props = defineProps<{
  point: GrammarPoint
}>()
</script>

<script lang="ts">
export default {
  name: 'GrammarOfTheDay'
}
</script>