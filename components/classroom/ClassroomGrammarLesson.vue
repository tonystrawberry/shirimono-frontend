<template>
  <div class="flex flex-col items-center">
    <div class="text-8xl font-bold text-white mb-8">
      {{ currentGrammar.title }}
    </div>

    <div class="w-full max-w-2xl space-y-8">
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
import { defineComponent } from 'vue'
import type { Grammar } from '~/composables/api/v1/useCourseLessonsV1'

const props = defineProps<{
  currentGrammar: Grammar
}>()

defineEmits(['next'])
</script>

<script lang="ts">
export default defineComponent({
  name: 'ClassroomGrammarLesson'
})
</script>