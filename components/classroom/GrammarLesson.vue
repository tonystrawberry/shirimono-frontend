<template>
  <div class="flex flex-col items-center">
    <div class="text-8xl font-bold text-white mb-8">
      {{ currentGrammar.title }}
    </div>

    <div class="w-full max-w-2xl space-y-8">
      <!-- Meanings -->
      <div class="bg-white/10 rounded-lg p-6">
        <h3 class="text-white/60 text-sm font-medium mb-4">MEANINGS</h3>
        <div class="text-2xl text-white">
          {{ currentGrammar.meanings.join(', ') }}
        </div>
      </div>

      <!-- Explanation -->
      <div class="bg-white/10 rounded-lg p-6">
        <h3 class="text-white/60 text-sm font-medium mb-4">EXPLANATION</h3>
        <div class="text-xl text-white">
          {{ currentGrammar.explanation }}
        </div>
      </div>

      <!-- Examples -->
      <div class="bg-white/10 rounded-lg p-6">
        <h3 class="text-white/60 text-sm font-medium mb-4">EXAMPLES</h3>
        <div class="space-y-4">
          <div v-for="example in currentGrammar.examples" :key="example" class="text-xl text-white">
            {{ example }}
          </div>
        </div>
      </div>

      <!-- Continue Button -->
      <div class="flex justify-center mt-8">
        <button
          @click="$emit('next')"
          class="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg transition text-xl"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Grammar } from '~/composables/api/v1/useCourseLessonsV1'

defineProps<{
  currentGrammar: Grammar
}>()

defineEmits<{
  (e: 'next'): void
}>()</script>