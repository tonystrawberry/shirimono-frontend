<!-- components/CourseLevelStatusBadge.vue -->
<template>
  <div class="flex items-center gap-2">
    <span
      v-if="status"
      class="px-1.5 py-0.5 text-xs font-medium rounded-xs"
      :class="statusClasses"
    >
      {{ statusText }}
    </span>
    <button
      v-if="showStartButton"
      @click="startLesson"
      class="cursor-pointer inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md transition-colors"
      :class="{
        'bg-indigo-50 text-indigo-700 hover:bg-indigo-100': props.pointType === 'kanji',
        'bg-violet-50 text-violet-700 hover:bg-violet-100': props.pointType === 'vocabulary',
        'bg-teal-50 text-teal-700 hover:bg-teal-100': props.pointType === 'grammar'
      }"
    >
      <PlayIcon class="w-4 h-4 mr-1" />
      Start Lesson
    </button>
  </div>
</template>

<script setup lang="ts">
import { PlayIcon } from '@heroicons/vue/24/solid'
import type { CourseLevelStatus } from '~/composables/api/v1/useUserCourseLevelsV1'
import type { ClassroomNavigationState } from '~/types/navigation'

const props = defineProps<{
  status: CourseLevelStatus | null | undefined
  courseSlug: string | null
  pointType: 'kanji' | 'grammar' | 'vocabulary' | null
  position: number | null
  level: {
    id: number
    position: number
    title: string
  }
}>()

const showStartButton = computed(() => {
  return props.status === 'ready' || props.status === 'partially_in_progress'
})

const classroomNavigation = useState<ClassroomNavigationState>('classroom-navigation', () => ({
  courseSlug: null,
  pointType: null,
  position: null
}))

async function startLesson() {
  // Set the navigation state
  classroomNavigation.value = {
    courseSlug: props.courseSlug,
    pointType: props.pointType,
    position: props.level.position
  }

  // Navigate to the classroom page
  await navigateTo('/app/classroom/learn', {
    replace: true
  })
}

const statusClasses = computed(() => {
  switch (props.status) {
    case 'not_ready':
      return 'bg-gray-100 text-gray-800'
    case 'ready':
      return 'bg-green-100 text-green-800'
    case 'partially_in_progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'all_in_progress':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const statusText = computed(() => {
  switch (props.status) {
    case 'not_ready':
      return 'Not Ready'
    case 'ready':
      return 'Ready to Start'
    case 'partially_in_progress':
      return 'In Progress (Lessons)'
    case 'all_in_progress':
      return 'In Progress (Exercises)'
    case 'completed':
      return 'Completed'
    default:
      return 'Unknown'
  }
})
</script>