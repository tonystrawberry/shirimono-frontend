<template>
  <div class="flex flex-col items-center">
    <div class="text-8xl font-bold text-white mb-8">
      {{ currentKanji.title }}
    </div>

    <!-- Kunyomi Readings -->
    <div class="my-8">
      <span class="text-white/60 text-sm font-medium px-3 py-1 rounded-full bg-white/10">
        KUNYOMI READING
      </span>
    </div>
    <div class="text-xl text-white/90 mb-4">
      {{ currentKanji.kunyomi_readings.join('・') }}
    </div>

    <!-- Onyomi Readings -->
    <div class="my-8">
      <span class="text-white/60 text-sm font-medium px-3 py-1 rounded-full bg-white/10">
        ONYOMI READING
      </span>
    </div>
    <div class="text-xl text-white/90 mb-4">
      {{ currentKanji.onyomi_readings.join('・') }}
    </div>

    <!-- Meanings -->
    <div class="my-8">
      <span class="text-white/60 text-sm font-medium px-3 py-1 rounded-full bg-white/10">
        MEANING
      </span>
    </div>
    <div class="text-xl text-white/90 mb-8">
      {{ currentKanji.meanings.join(', ') }}
    </div>

    <button
      @click="$emit('next')"
      class="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-3 rounded-lg transition inline-flex items-center gap-2"
    >
      Next
      <div class="flex items-center gap-1 text-white/70">
        <div class="border border-white/30 rounded px-1 py-0.5 text-xs">return</div>
        <ArrowLeftIcon class="w-3 h-3 rotate-180" />
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/20/solid'
import type { Kanji } from '~/composables/api/v1/useCourseLessonsV1'

defineProps<{
  currentKanji: Kanji
}>()

defineEmits<{
  (e: 'next'): void
}>()
</script>