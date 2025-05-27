<template>
  <div class="max-w-5xl mx-auto pt-4 pb-10 px-4">
    <!-- Top Banner -->
    <div class="rounded-lg bg-gray-800 shadow mb-8">
      <div class="px-4 py-4 flex items-center gap-4">
        <NuxtLink to="/app/courses/jlpt-n5" class="text-white hover:text-gray-200">
          <ChevronLeftIcon class="w-6 h-6" />
        </NuxtLink>
        <BookOpenIcon class="w-10 h-10 text-white" aria-hidden="true" />
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
                  :disabled="level >= vocabLevels.length"
                  class="p-1 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon class="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
          <nav class="flex flex-col">
            <button
              v-for="item in currentLevel.items"
              :key="item.id"
              @click="selectItem(item)"
              :class="[
                'px-4 py-3 text-left hover:bg-gray-800 flex items-center gap-3 transition-colors',
                selectedItem?.id === item.id ? 'bg-gray-800 border-l-4 border-violet-500' : 'border-l-4 border-transparent'
              ]"
            >
              <span class="text-lg text-white">{{ item.title }}</span>
              <div class="flex-1 flex items-center justify-between">
                <div class="text-sm text-gray-400">
                  <div class="flex items-center gap-1">
                    <div
                      :class="[
                        'h-2 w-2 rounded-full',
                        item.mastery_level === 0 ? 'bg-gray-600' :
                        item.mastery_level === 1 ? 'bg-yellow-500' :
                        item.mastery_level === 2 ? 'bg-green-500' :
                        'bg-violet-500'
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
        <!-- Vocabulary Card -->
        <div class="bg-gray-900 rounded-lg shadow-lg overflow-hidden mb-6">
          <div class="p-8">
            <!-- Vocabulary Display -->
            <div class="text-center">
              <div class="text-[120px] font-bold text-violet-400 mb-8 uppercase tracking-wide">
                {{ selectedItem.title }}
              </div>

              <!-- Readings -->
              <div class="grid grid-cols-3 gap-8">
                <div class="bg-gray-800/50 rounded-lg p-4">
                  <h3 class="uppercase tracking-wider text-xs font-medium text-violet-400 mb-2">Romaji</h3>
                  <div class="text-xl text-white">
                    {{ selectedItem.slug }}
                  </div>
                </div>

                <div class="bg-gray-800/50 rounded-lg p-4">
                  <h3 class="uppercase tracking-wider text-xs font-medium text-violet-400 mb-2">Meaning</h3>
                  <div class="text-xl text-white">
                    hello
                  </div>
                </div>

                <div class="bg-gray-800/50 rounded-lg p-4">
                  <h3 class="uppercase tracking-wider text-xs font-medium text-violet-400 mb-2">Type</h3>
                  <div class="text-xl text-white">
                    Greeting
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs Card -->
        <div class="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <!-- Tabs -->
          <div class="border-t border-gray-700 py-6">
            <div class="px-8">
              <div class="flex gap-4">
                <button
                  v-for="tab in ['RELATED KANJI', 'EXAMPLE SENTENCES']"
                  :key="tab"
                  @click="currentTab = tab"
                  :class="[
                    'px-6 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    currentTab === tab
                      ? 'bg-violet-500 text-white uppercase tracking-wider text-xs font-medium'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 uppercase tracking-wider text-xs font-medium'
                  ]"
                >
                  {{ tab }}
                </button>
              </div>
            </div>

            <div class="p-8">
              <!-- Related Kanji Tab -->
              <div v-if="currentTab === 'RELATED KANJI'" class="grid grid-cols-2 gap-4">
                <div v-for="(kanji, index) in relatedKanji" :key="index"
                  class="bg-gray-800/50 rounded-lg p-4 flex flex-col gap-2"
                >
                  <div class="flex justify-between items-start">
                    <div class="text-xl text-white">
                      <ruby>
                        {{ kanji.character }}<rt>{{ kanji.reading }}</rt>
                      </ruby>
                    </div>
                    <div class="flex gap-1">
                      <span
                        v-for="level in kanji.jlptLevels"
                        :key="level"
                        class="text-xs font-medium px-2 py-0.5 rounded bg-gray-700/50 text-gray-300"
                      >
                        {{ level }}
                      </span>
                    </div>
                  </div>
                  <div class="text-sm text-gray-400">{{ kanji.meaning }}</div>
                </div>
              </div>

              <!-- Example Sentences Tab -->
              <div v-else class="space-y-6">
                <div v-for="(sentence, index) in exampleSentences" :key="index"
                  class="bg-gray-800/50 rounded-lg p-6"
                >
                  <div class="text-xl text-white mb-3">
                    <ruby v-for="(word, idx) in sentence.words" :key="idx">
                      {{ word.kanji || word.kana }}<rt>{{ word.reading }}</rt>
                    </ruby>
                  </div>
                  <div class="text-lg text-gray-300 mb-2">{{ sentence.romaji }}</div>
                  <div class="text-gray-400">{{ sentence.translation }}</div>
                </div>
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
  BookOpenIcon,
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
const vocabLevels = [
  {
    id: 1,
    level: 1,
    title: 'Greetings',
    items: [
      {
        id: 1,
        title: 'こんにちは',
        slug: 'konnichiwa',
        mastery_level: 3
      },
      {
        id: 2,
        title: 'ありがとう',
        slug: 'arigatou',
        mastery_level: 3
      },
      {
        id: 3,
        title: 'さようなら',
        slug: 'sayounara',
        mastery_level: 1
      },
      {
        id: 4,
        title: 'おはよう',
        slug: 'ohayou',
        mastery_level: 0
      },
      {
        id: 5,
        title: 'こんばんは',
        slug: 'konbanwa',
        mastery_level: 0
      }
    ],
    learned: 2
  },
  {
    id: 2,
    level: 2,
    title: 'Numbers',
    items: [
      {
        id: 6,
        title: 'いち',
        slug: 'ichi',
        mastery_level: 3
      },
      {
        id: 7,
        title: 'に',
        slug: 'ni',
        mastery_level: 3
      },
      {
        id: 8,
        title: 'さん',
        slug: 'san',
        mastery_level: 2
      },
      {
        id: 9,
        title: 'し',
        slug: 'shi',
        mastery_level: 1
      },
      {
        id: 10,
        title: 'ご',
        slug: 'go',
        mastery_level: 0
      }
    ],
    learned: 4
  }
]

// Get the current level data
const currentLevel = computed(() => {
  return vocabLevels.find(l => l.id === level)
})

// Get the selected item from navigation state or default to first item
const selectedItem = ref(router.currentRoute.value.state?.selectedItem || currentLevel.value?.items[0])

const selectItem = (item) => {
  selectedItem.value = item
}

const navigateLevel = (delta) => {
  const newLevel = level + delta
  if (newLevel >= 1 && newLevel <= vocabLevels.length) {
    router.push(`/app/courses/jlpt-n5/vocabulary/${newLevel}`)
  }
}

// Track ignored items
const ignoredItems = ref(new Set())

const toggleIgnoreItem = (itemId) => {
  if (ignoredItems.value.has(itemId)) {
    ignoredItems.value.delete(itemId)
  } else {
    ignoredItems.value.add(itemId)
  }
}

// Example related kanji - this would come from your data store or API
const relatedKanji = [
  {
    character: '日',
    reading: 'にち',
    meaning: 'day, sun',
    jlptLevels: ['N5']
  },
  {
    character: '本',
    reading: 'ほん',
    meaning: 'book, origin',
    jlptLevels: ['N5']
  },
  {
    character: '人',
    reading: 'じん',
    meaning: 'person',
    jlptLevels: ['N5']
  },
  {
    character: '月',
    reading: 'つき',
    meaning: 'moon, month',
    jlptLevels: ['N5']
  }
]

// Add currentTab ref
const currentTab = ref('RELATED KANJI')

// Add example sentences data
const exampleSentences = [
  {
    words: [
      { kana: 'おはよう', reading: 'ohayou' },
      { kana: 'ございます', reading: 'gozaimasu' },
      { kanji: '田中', reading: 'たなか' },
      { kana: 'さん', reading: 'san' }
    ],
    romaji: 'Ohayou gozaimasu, Tanaka-san',
    translation: 'Good morning, Mr. Tanaka'
  },
  {
    words: [
      { kana: 'おはよう', reading: 'ohayou' },
      { kanji: '母', reading: 'はは' }
    ],
    romaji: 'Ohayou, haha',
    translation: 'Good morning, mother'
  },
  {
    words: [
      { kanji: '朝', reading: 'あさ' },
      { kana: 'から', reading: 'kara' },
      { kana: 'おはよう', reading: 'ohayou' },
      { kana: 'って', reading: 'tte' },
      { kanji: '言', reading: 'い' },
      { kana: 'ってる', reading: 'tteru' }
    ],
    romaji: 'Asa kara ohayou tte itteru',
    translation: 'They\'ve been saying good morning since the morning'
  }
]
</script>