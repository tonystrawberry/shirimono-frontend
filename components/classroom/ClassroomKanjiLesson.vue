<template>
  <div class="flex flex-col items-center">
    <div class="text-8xl font-bold text-white mb-8">
      {{ currentKanji.title }}
    </div>

    <div class="w-full max-w-2xl space-y-8">
      <!-- Readings -->
      <div class="bg-white/10 rounded-lg p-6">
        <h3 class="text-white/60 text-sm font-medium mb-4">READINGS</h3>
        <div class="space-y-4">
          <!-- Kunyomi -->
          <div>
            <h4 class="text-white/40 text-sm mb-2">KUNYOMI</h4>
            <div class="text-2xl text-white">
              {{ currentKanji.kunyomi_readings.join(', ') }}
            </div>
          </div>
          <!-- Onyomi -->
          <div>
            <h4 class="text-white/40 text-sm mb-2">ONYOMI</h4>
            <div class="text-2xl text-white">
              {{ currentKanji.onyomi_readings.join(', ') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Meanings -->
      <div class="bg-white/10 rounded-lg p-6">
        <h3 class="text-white/60 text-sm font-medium mb-4">MEANINGS</h3>
        <div class="text-2xl text-white">
          {{ currentKanji.meanings.join(', ') }}
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
import { defineComponent } from 'vue'
import type { Kanji } from '~/composables/api/v1/useCourseLessonsV1'

const props = defineProps<{
  currentKanji: Kanji
}>()

defineEmits(['next'])
</script>

<script lang="ts">
export default defineComponent({
  name: 'ClassroomKanjiLesson'
})
</script>