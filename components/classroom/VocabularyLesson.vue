<template>
  <div class="flex flex-col items-center">
    <div class="text-8xl font-bold text-white mb-8">
      {{ currentVocabulary.title }}
    </div>

    <div class="w-full max-w-2xl space-y-8">
      <!-- Readings -->
      <div class="bg-white/10 rounded-lg p-6">
        <h3 class="text-white/60 text-sm font-medium mb-4">READING</h3>
        <div class="text-2xl text-white">
          {{ currentVocabulary.kana }}
        </div>
      </div>

      <!-- Meanings -->
      <div class="bg-white/10 rounded-lg p-6">
        <h3 class="text-white/60 text-sm font-medium mb-4">MEANINGS</h3>
        <div class="text-2xl text-white">
          {{ currentVocabulary.meanings.join(', ') }}
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
import type { Vocabulary } from '~/composables/api/v1/useCourseLessonsV1'

defineProps<{
  currentVocabulary: Vocabulary
}>()

defineEmits<{
  (e: 'next'): void
}>()</script>