<!-- components/CourseLevelStatusBadge.vue -->
<template>
  <div class="flex items-center gap-2">
    <span
      v-if="status"
      class="px-2 py-0.5 text-xs font-medium rounded-full"
      :class="statusClasses"
    >
      {{ statusText }}
    </span>
    <button
      v-if="showStartButton"
      @click="startLesson"
      class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md transition-colors"
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
  status: CourseLevelStatus | null
  courseSlug: string
  pointType: 'kanji' | 'grammar' | 'vocabulary' | ''
  level: {
    id: number
    position: number
    title: string
  }
}>()

const showStartButton = computed(() => {
  return props.status === 'ready' || props.status === 'lessons_not_completed'
})

const classroomNavigation = useState<ClassroomNavigationState>('classroom-navigation', () => ({
  courseSlug: '',
  pointType: '',
  level: null
}))

async function startLesson() {
  console.log("startLesson", props.courseSlug, props.pointType, props.level)

  // Set the navigation state
  classroomNavigation.value = {
    courseSlug: props.courseSlug,
    pointType: props.pointType,
    level: props.level.position
  }

  // Navigate to the classroom page
  await navigateTo('/app/classroom/learn', {
    replace: true
  })
}

const statusClasses = computed(() => {
  switch (props.status) {
    case 'ready':
      return 'bg-gray-100 text-gray-800'
    case 'lessons_not_completed':
      return 'bg-yellow-100 text-yellow-800'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800'
    case 'in_progress_advanced':
      return 'bg-purple-100 text-purple-800'
    case 'done':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const statusText = computed(() => {
  switch (props.status) {
    case 'ready':
      return 'Ready to Start'
    case 'lessons_not_completed':
      return 'Lessons in Progress'
    case 'in_progress':
      return 'In Progress'
    case 'in_progress_advanced':
      return 'Advanced'
    case 'done':
      return 'Completed'
    default:
      return 'Unknown'
  }
})
</script>