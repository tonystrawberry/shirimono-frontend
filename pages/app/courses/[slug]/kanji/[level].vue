<template>
  <div class="max-w-5xl mx-auto pt-4 pb-10 px-4">
    <!-- Top Banner -->
    <div class="rounded-lg bg-gray-800 shadow mb-8">
      <div class="px-4 py-4 flex items-center gap-4">
        <NuxtLink :to="`/app/courses/${route.params.slug}`" class="text-white hover:text-gray-200">
          <ChevronLeftIcon class="w-6 h-6" />
        </NuxtLink>
        <AcademicCapIcon class="w-10 h-10 text-white" aria-hidden="true" />
        <h1 class="text-3xl font-bold text-white">{{ course?.title }}</h1>
      </div>
    </div>

    <div v-if="loading" class="text-gray-400">
      Loading kanji level...
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
                <p class="text-sm text-gray-400">{{ kanjis.length }} items</p>
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
          <nav class="flex flex-col relative">
            <button
              v-for="item in kanjis"
              :key="item.id"
              @click="selectItem(item)"
              :class="[
                'px-4 py-3 text-left hover:bg-gray-800 flex items-center gap-3 transition-colors group',
                selectedItem?.id === item.id ? 'bg-gray-800 border-l-4 border-indigo-500' : 'border-l-4 border-transparent',
                ignoredItems.has(item.id) ? 'opacity-50' : ''
              ]"
            >
              <span class="text-2xl text-white">{{ item.title }}</span>
              <div class="flex-1 flex items-center justify-between">
                <div class="text-sm text-gray-400">
                  <div class="flex items-center gap-1">
                    <div
                      class="h-2 w-2 rounded-full"
                      :class="[
                        getKanjiReviews(item.id).length > 0 ? 'bg-indigo-500' : 'bg-gray-600'
                      ]"
                    ></div>
                    <span class="ml-1" v-if="getKanjiReviews(item.id).length > 0">
                      Studying ({{ getKanjiReviews(item.id).length }}/{{ item.exercises.length }})
                    </span>
                    <span class="ml-1" v-else>
                      Not Started
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
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
              </div>
            </button>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1" v-if="selectedItem">
        <div class="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div class="p-8">
            <!-- Kanji Display -->
            <div class="text-center mb-8">
              <div class="text-[120px] font-bold text-indigo-400 mb-8">
                {{ selectedItem.title }}
              </div>

              <!-- Readings -->
              <div class="grid grid-cols-3 gap-8">
                <div class="bg-gray-800/50 rounded-lg p-4">
                  <h3 class="uppercase tracking-wider text-xs font-medium text-indigo-400 mb-2">Meanings</h3>
                  <div class="text-xl text-white">
                    {{ selectedItem.meanings.join(', ') }}
                  </div>
                </div>

                <div class="bg-gray-800/50 rounded-lg p-4">
                  <h3 class="uppercase tracking-wider text-xs font-medium text-indigo-400 mb-2">Onyomi</h3>
                  <div class="text-xl text-white">
                    {{ selectedItem.onyomi_readings.join(', ') }}
                  </div>
                </div>

                <div class="bg-gray-800/50 rounded-lg p-4">
                  <h3 class="uppercase tracking-wider text-xs font-medium text-indigo-400 mb-2">Kunyomi</h3>
                  <div class="text-xl text-white">
                    {{ selectedItem.kunyomi_readings.join(', ') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example Sentences -->
        <div class="mt-8 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div class="p-8">
            <h3 class="uppercase tracking-wider text-xs font-medium text-indigo-400 mb-4">Example Sentences</h3>
            <div class="space-y-4">
              <div v-for="sentence in selectedItem.example_sentences" :key="sentence.id"
                class="bg-gray-800/50 rounded-lg p-4"
              >
                <div class="text-xl text-white mb-2" v-html="sentence.sentence_html"></div>
                <div class="text-gray-400">{{ sentence.translation }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Kanji -->
        <div v-if="selectedItem.related_kanjis.length > 0" class="mt-8 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div class="p-8">
            <h3 class="uppercase tracking-wider text-xs font-medium text-indigo-400 mb-4">Related Kanji</h3>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="kanji in selectedItem.related_kanjis" :key="kanji.id"
                class="bg-gray-800/50 rounded-lg p-4"
              >
                <div class="text-xl text-white mb-2">{{ kanji.title }}</div>
                <div class="text-gray-400">{{ kanji.meanings.join(', ') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  EyeSlashIcon,
  EyeIcon,
  AcademicCapIcon
} from '@heroicons/vue/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useCourseLevelsStore } from '~/stores/courseLevels'
import { useCoursesStore } from '~/stores/courses'
import { useUserReviewsStore } from '~/stores/userReviews'
import type { Kanji } from '~/composables/api/v1/useCourseLevelsV1'

definePageMeta({
  layout: 'app'
})

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()
const courseLevelsStore = useCourseLevelsStore()
const userReviewsStore = useUserReviewsStore()

const level = computed(() => parseInt(route.params.level as string))
const selectedItem = ref<Kanji | null>(null)
const ignoredItems = ref(new Set<string>())

// Computed properties for the view
const loading = computed(() => courseLevelsStore.loading)
const error = computed(() => courseLevelsStore.error)
const currentLevel = computed(() => courseLevelsStore.currentLevel)
const kanjis = computed(() => currentLevel.value?.kanjis || [])
const course = computed(() => coursesStore.courses.find(c => c.slug === route.params.slug))
const courseLevelCount = computed(() => course.value?.course_level_kanjis_count || 0)

// Function to get reviews for a specific kanji
const getKanjiReviews = (kanjiId: string) => {
  console.log("userReviewsStore.reviews", userReviewsStore.reviews)
  console.log("kanjiId", kanjiId)

  return userReviewsStore.reviews.filter(review =>
    review.course_point.type === 'CourseLevelKanji' &&
    review.course_point.id === kanjiId
  )
}

// Watch for route changes to fetch new data
watch([route], async () => {
  await fetchData()
}, { immediate: true })

// Watch for kanjis changes to select the point from URL
watch([kanjis], () => {
  const state = history.state as { selectedPointId?: string }
  if (kanjis.value.length > 0 && state?.selectedPointId) {
    const point = kanjis.value.find(k => k.id === state.selectedPointId)
    if (point) {
      selectItem(point)
    }
  }
})

async function fetchData() {
  if (coursesStore.courses.length === 0) {
    await coursesStore.fetchCourses()
  }
  await courseLevelsStore.fetchCourseLevel(route.params.slug as string, 'kanji', level.value)
  await userReviewsStore.fetchUserReviews()
}

function selectItem(item: Kanji) {
  selectedItem.value = item
}

function navigateLevel(delta: number) {
  const newLevel = level.value + delta
  if (newLevel >= 1) {
    router.push(`/app/courses/${route.params.slug}/kanji/${newLevel}`)
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