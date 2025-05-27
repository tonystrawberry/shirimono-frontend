<template>
  <div class="max-w-5xl mx-auto pt-4 pb-10 px-4">
    <!-- Top Banner -->
    <div class="rounded-lg bg-gray-800 shadow mb-8">
      <div class="px-4 py-4 flex items-center gap-4">
        <NuxtLink to="/app/courses/jlpt-n5" class="text-white hover:text-gray-200">
          <ChevronLeftIcon class="w-6 h-6" />
        </NuxtLink>
        <AcademicCapIcon class="w-10 h-10 text-white" aria-hidden="true" />
        <h1 class="text-3xl font-bold text-white">JLPT N5</h1>
      </div>
    </div>

    <div class="flex gap-8">
      <!-- Sidebar -->
      <div class="w-80 flex-shrink-0">
        <div class="bg-gray-900 rounded-lg shadow overflow-hidden">
          <div class="p-4 border-b border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium text-white">{{ currentLevel.title }}</h2>
                <p class="text-sm text-gray-400">{{ currentLevel.items.length }} items</p>
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
                  :disabled="level >= kanjiLevels.length"
                  class="p-1 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon class="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
          <nav class="flex flex-col relative">
            <button
              v-for="item in currentLevel.items"
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
                      :class="[
                        'h-2 w-2 rounded-full',
                        item.mastery_level === 0 ? 'bg-gray-600' :
                        item.mastery_level === 1 ? 'bg-yellow-500' :
                        item.mastery_level === 2 ? 'bg-green-500' :
                        'bg-indigo-500'
                      ]"
                    ></div>
                    <span class="ml-1">
                      {{
                        item.mastery_level === 0 ? 'Not Started' :
                        item.mastery_level === 1 ? 'Learning' :
                        item.mastery_level === 2 ? 'Practicing' :
                        'Mastered'
                      }}
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
                    water
                    <div class="text-lg text-gray-400">Wednesday</div>
                  </div>
                </div>

                <div class="bg-gray-800/50 rounded-lg p-4">
                  <h3 class="uppercase tracking-wider text-xs font-medium text-indigo-400 mb-2">Onyomi</h3>
                  <div class="text-xl text-white">
                    すい
                  </div>
                </div>

                <div class="bg-gray-800/50 rounded-lg p-4">
                  <h3 class="uppercase tracking-wider text-xs font-medium text-indigo-400 mb-2">Kunyomi</h3>
                  <div class="text-xl text-white">
                    みず
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Used In Section -->
        <div class="mt-8 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div class="p-8">
            <h3 class="uppercase tracking-wider text-xs font-medium text-indigo-400 mb-4">Used in</h3>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(word, index) in relatedWords" :key="index"
                class="bg-gray-800/50 rounded-lg p-4 flex flex-col gap-2"
              >
                <div class="flex justify-between items-start">
                  <div class="text-xl text-white">
                    <ruby>
                      {{ word.kanji }}<rt>{{ word.reading }}</rt>
                    </ruby>
                  </div>
                  <div class="flex gap-1">
                    <span
                      v-for="level in word.jlptLevels"
                      :key="level"
                      class="text-xs font-medium px-2 py-0.5 rounded bg-gray-700/50 text-gray-300"
                    >
                      {{ level }}
                    </span>
                  </div>
                </div>
                <div class="text-sm text-gray-400">{{ word.meaning }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  ChevronLeftIcon,
  AcademicCapIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  EyeSlashIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

const route = useRoute()
const router = useRouter()

const level = parseInt(route.params.level)

// This would come from your data store or API in a real app
const kanjiLevels = [
  {
    id: 1,
    level: 1,
    title: 'Days of the week',
    items: [
      {
        id: 1,
        title: '日',
        slug: 'nichi-hi',
        mastery_level: 3
      },
      {
        id: 2,
        title: '月',
        slug: 'getsu-tsuki',
        mastery_level: 3
      },
      {
        id: 3,
        title: '火',
        slug: 'ka-hi',
        mastery_level: 2
      },
      {
        id: 4,
        title: '水',
        slug: 'sui-mizu',
        mastery_level: 2
      },
      {
        id: 5,
        title: '木',
        slug: 'moku-ki',
        mastery_level: 1
      },
      {
        id: 6,
        title: '金',
        slug: 'kin-kane',
        mastery_level: 1
      },
      {
        id: 7,
        title: '土',
        slug: 'do-tsuchi',
        mastery_level: 0
      }
    ],
    learned: 3
  },
  {
    id: 2,
    level: 2,
    title: 'Numbers',
    items: [
      {
        id: 8,
        title: '一',
        slug: 'ichi',
        mastery_level: 3
      },
      {
        id: 9,
        title: '二',
        slug: 'ni',
        mastery_level: 3
      },
      {
        id: 10,
        title: '三',
        slug: 'san',
        mastery_level: 2
      },
      {
        id: 11,
        title: '四',
        slug: 'shi-yon',
        mastery_level: 2
      },
      {
        id: 12,
        title: '五',
        slug: 'go',
        mastery_level: 1
      },
      {
        id: 13,
        title: '六',
        slug: 'roku',
        mastery_level: 0
      },
      {
        id: 14,
        title: '七',
        slug: 'shichi-nana',
        mastery_level: 0
      },
      {
        id: 15,
        title: '八',
        slug: 'hachi',
        mastery_level: 0
      },
      {
        id: 16,
        title: '九',
        slug: 'kyuu-ku',
        mastery_level: 0
      },
      {
        id: 17,
        title: '十',
        slug: 'juu',
        mastery_level: 0
      },
      {
        id: 18,
        title: '万',
        slug: 'man',
        mastery_level: 0
      },
      {
        id: 19,
        title: '百',
        slug: 'hyaku',
        mastery_level: 0
      },
      {
        id: 20,
        title: '千',
        slug: 'sen',
        mastery_level: 0
      }
    ],
    learned: 5
  }
]

// Get the current level data
const currentLevel = computed(() => {
  return kanjiLevels.find(l => l.id === level)
})

// Get the selected item from navigation state or default to first item
const selectedItem = ref(router.currentRoute.value.state?.selectedItem || currentLevel.value?.items[0])

const selectItem = (item) => {
  selectedItem.value = item
}

// Example related words - this would come from your data store or API
const relatedWords = [
  {
    kanji: '洪水',
    reading: 'こうずい',
    meaning: 'flood',
    jlptLevels: ['N3', 'N2']
  },
  {
    kanji: '雨水',
    reading: 'うすい',
    meaning: 'rainfall',
    jlptLevels: ['N2']
  },
  {
    kanji: '海水浴',
    reading: 'かいすいよく',
    meaning: 'sea swimming',
    jlptLevels: ['N4', 'N3']
  },
  {
    kanji: '水不足',
    reading: 'みずぶそく',
    meaning: 'lack of water',
    jlptLevels: ['N3']
  },
  {
    kanji: '水準',
    reading: 'すいじゅん',
    meaning: 'standard',
    jlptLevels: ['N2', 'N1']
  },
  {
    kanji: '節水',
    reading: 'せっすい',
    meaning: 'saving water',
    jlptLevels: ['N2']
  },
  {
    kanji: '水分',
    reading: 'すいぶん',
    meaning: 'moisture',
    jlptLevels: ['N4', 'N3']
  },
  {
    kanji: '水族館',
    reading: 'すいぞくかん',
    meaning: 'aquarium',
    jlptLevels: ['N3']
  }
]

const navigateLevel = (delta) => {
  const newLevel = level + delta
  if (newLevel >= 1 && newLevel <= kanjiLevels.length) {
    router.push(`/app/courses/jlpt-n5/kanji/${newLevel}`)
  }
}

// Add the ignore function
const ignoredItems = ref(new Set())

const toggleIgnoreItem = (itemId) => {
  if (ignoredItems.value.has(itemId)) {
    ignoredItems.value.delete(itemId)
  } else {
    ignoredItems.value.add(itemId)
  }
}
</script>