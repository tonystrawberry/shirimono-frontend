<template>
  <div class="max-w-5xl mx-auto pt-4 pb-10 px-4">
    <!-- Top Banner -->
    <div class="rounded-lg bg-gray-800 shadow mb-8">
      <div class="px-4 py-4 flex items-center gap-4">
        <NuxtLink :to="`/app/courses/${route.params.slug}`" class="text-white hover:text-gray-200">
          <ChevronLeftIcon class="w-6 h-6" />
        </NuxtLink>
        <BookOpenIcon class="w-10 h-10 text-white" aria-hidden="true" />
        <h1 class="text-3xl font-bold text-white">{{ course?.title }}</h1>
      </div>
    </div>

    <div v-if="loading" class="text-gray-400">
      Loading grammar level...
    </div>
    <div v-else-if="error" class="text-red-400">
      {{ error }}
    </div>
    <div v-else class="flex gap-8">
      <!-- Sidebar -->
      <div class="w-80 flex-shrink-0">
        <div class="bg-gray-900 rounded-lg shadow overflow-hidden">
          <div class="p-4 border-b border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium text-white">{{ currentLevel?.title }}</h2>
                <p class="text-sm text-gray-400">{{ grammars.length }} items</p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="navigateLevel(-1)"
                  :disabled="level <= 1"
                  class="p-1 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon class="w-5 h-5 text-gray-400" />
                </button>
                <button
                  @click="navigateLevel(1)"
                  :disabled="level >= courseLevelCount"
                  class="p-1 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon class="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
          <nav class="flex flex-col">
            <button
              v-for="item in grammars"
              :key="item.id"
              @click="selectItem(item)"
              :class="[
                'px-4 py-3 text-left hover:bg-gray-800 flex items-center gap-3 transition-colors border-l-4',
                selectedItem?.id === item.id ? 'bg-gray-800 border-teal-500' : 'border-transparent'
              ]"
            >
              <span class="text-lg text-white">{{ item.title }}</span>
              <div class="flex-1 flex items-center justify-between">
                <div class="text-sm text-gray-400">
                  <div class="flex items-center gap-1">
                    <div class="h-2 w-2 rounded-full bg-gray-600"></div>
                    <span class="ml-1">Not Started</span>
                  </div>
                </div>
                <Menu as="div" class="relative">
                  <MenuButton
                    class="p-1 rounded-full hover:bg-gray-700"
                    @click.stop
                  >
                    <EllipsisVerticalIcon class="w-5 h-5 text-gray-400" />
                  </MenuButton>
                  <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <MenuItems
                      class="absolute right-0 mt-1 w-48 origin-top-right rounded-md bg-gray-800 shadow-lg ring-opacity-5 focus:outline-none z-10"
                    >
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="toggleIgnoreItem(item.id)"
                          :class="[
                            active ? 'bg-gray-700' : '',
                            'group flex w-full items-center px-4 py-2 text-sm text-gray-300 rounded-md'
                          ]"
                        >
                          <component
                            :is="ignoredItems.has(item.id) ? EyeIcon : EyeSlashIcon"
                            class="w-5 h-5 mr-3 text-gray-400"
                          />
                          {{ ignoredItems.has(item.id) ? 'Unignore' : 'Ignore' }}
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
            </button>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1" v-if="selectedItem">
        <!-- Grammar Card -->
        <div class="bg-gray-900 rounded-lg shadow-lg overflow-hidden mb-6">
          <div class="p-8">
            <!-- Grammar Point Display -->
            <div class="text-center">
              <div class="text-[120px] font-bold text-teal-400 mb-8 uppercase tracking-wide">
                {{ selectedItem.title }}
              </div>

              <!-- Basic Info -->
              <div class="bg-gray-800/50 rounded-lg p-4">
                <h3 class="uppercase tracking-wider text-xs font-medium text-teal-400 mb-2">Meanings</h3>
                <div class="text-xl text-white">
                  {{ selectedItem.meanings.join(', ') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example Sentences -->
        <div class="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div class="p-8">
            <h3 class="uppercase tracking-wider text-xs font-medium text-teal-400 mb-4">Example Sentences</h3>
            <div class="space-y-6">
              <div v-for="sentence in selectedItem.example_sentences" :key="sentence.id"
                class="bg-gray-800/50 rounded-lg p-6"
              >
                <div class="text-xl text-white mb-2" v-html="sentence.sentence_html"></div>
                <div class="text-gray-400">{{ sentence.translation }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  EyeSlashIcon,
  EyeIcon,
  BookOpenIcon
} from '@heroicons/vue/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useCourseLevelsStore } from '~/stores/courseLevels'
import { useCoursesStore } from '~/stores/courses'
import type { Grammar } from '~/composables/api/v1/useCourseLevelsV1'

definePageMeta({
  layout: 'app'
})

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()
const courseLevelsStore = useCourseLevelsStore()

const level = computed(() => parseInt(route.params.level as string))
const selectedItem = ref<Grammar | null>(null)
const currentTab = ref('STRUCTURE')
const ignoredItems = ref(new Set<string>())

// Computed properties for the view
const loading = computed(() => courseLevelsStore.loading)
const error = computed(() => courseLevelsStore.error)
const currentLevel = computed(() => courseLevelsStore.currentLevel)
const grammars = computed(() => currentLevel.value?.grammars || [])
const course = computed(() => coursesStore.courses.find(c => c.slug === route.params.slug))
const courseLevelCount = computed(() => course.value?.course_level_grammars_count || 0)

// Watch for route changes to fetch new data
watch([route], async () => {
  await fetchData()
}, { immediate: true })

// Watch for grammars changes to select the point from URL
watch([grammars], () => {
  const state = history.state as { selectedPointId?: string }
  if (grammars.value.length > 0 && state?.selectedPointId) {
    const point = grammars.value.find(g => g.id === state.selectedPointId)
    if (point) {
      selectItem(point)
    }
  }
})

async function fetchData() {
  if (coursesStore.courses.length === 0) {
    await coursesStore.fetchCourses()
  }
  await courseLevelsStore.fetchCourseLevel(route.params.slug as string, 'grammar', level.value)
}

function selectItem(item: Grammar) {
  selectedItem.value = item
}

function navigateLevel(delta: number) {
  const newLevel = level.value + delta
  if (newLevel >= 1) {
    router.push(`/app/courses/${route.params.slug}/grammar/${newLevel}`)
  }
}

function toggleIgnoreItem(itemId: string) {
  if (ignoredItems.value.has(itemId)) {
    ignoredItems.value.delete(itemId)
  } else {
    ignoredItems.value.add(itemId)
  }
}
</script>