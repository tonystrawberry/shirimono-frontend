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
                  :disabled="level >= grammarLevels.length"
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
                'px-4 py-3 text-left hover:bg-gray-800 flex items-center gap-3 transition-colors border-l-4',
                selectedItem?.id === item.id ? 'bg-gray-800 border-teal-500' : 'border-transparent'
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
                        item.mastery_level === 2 ? 'bg-teal-300' :
                        'bg-teal-500'
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
        <!-- Grammar Card -->
        <div class="bg-gray-900 rounded-lg shadow-lg overflow-hidden mb-6">
          <div class="p-8">
            <!-- Grammar Point Display -->
            <div class="text-center">
              <div class="text-[120px] font-bold text-teal-400 mb-8 uppercase tracking-wide">
                {{ selectedItem.title }}
              </div>

              <!-- Basic Info -->
              <div class="grid grid-cols-2 gap-8">
                <div class="bg-gray-800/50 rounded-lg p-4">
                  <h3 class="uppercase tracking-wider text-xs font-medium text-teal-400 mb-2">Meaning</h3>
                  <div class="text-xl text-white">
                    {{ selectedItem.meaning }}
                  </div>
                </div>

                <div class="bg-gray-800/50 rounded-lg p-4">
                  <h3 class="uppercase tracking-wider text-xs font-medium text-teal-400 mb-2">Level</h3>
                  <div class="text-xl text-white flex items-center justify-center gap-2">
                    <span
                      class="px-3 py-1 rounded-full bg-gray-700/50 text-gray-300 text-sm font-medium"
                    >
                      {{ selectedItem.level }}
                    </span>
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
                  v-for="tab in ['STRUCTURE', 'EXAMPLE SENTENCES']"
                  :key="tab"
                  @click="currentTab = tab"
                  :class="[
                    'px-6 py-2.5 rounded-lg text-sm font-medium transition-colors uppercase tracking-wider text-xs font-medium',
                    currentTab === tab
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  ]"
                >
                  {{ tab }}
                </button>
              </div>
            </div>
          </div>

          <div class="p-8">
            <!-- Structure Tab -->
            <div v-if="currentTab === 'STRUCTURE'" class="space-y-6">
              <!-- Formation -->
              <div class="bg-gray-800/50 rounded-lg p-6">
                <h3 class="uppercase tracking-wider text-xs font-medium text-teal-400 mb-4">Formation</h3>
                <div class="flex items-center gap-2 text-lg text-white mb-4">
                  <span class="px-3 py-1 bg-gray-700 rounded">{{ selectedItem.formation }}</span>
                </div>
                <p class="text-gray-300">{{ selectedItem.formationExplanation }}</p>
              </div>

              <!-- Usage Notes -->
              <div class="bg-gray-800/50 rounded-lg p-6">
                <h3 class="uppercase tracking-wider text-xs font-medium text-teal-400 mb-4">Usage Notes</h3>
                <ul class="space-y-4">
                  <li v-for="(note, index) in selectedItem.usageNotes" :key="index" class="text-gray-300">
                    {{ note }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Example Sentences Tab -->
            <div v-else class="space-y-6">
              <div v-for="(sentence, index) in selectedItem.examples" :key="index"
                class="bg-gray-800/50 rounded-lg p-6"
              >
                <div class="text-xl text-white mb-3">
                  <ruby v-for="(word, idx) in sentence.japanese" :key="idx">
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

// Sample data structure for grammar points
const grammarLevels = [
  {
    id: 1,
    level: 1,
    title: 'Basic Grammar',
    items: [
      {
        id: 1,
        title: '～おわる',
        meaning: 'to finish ~',
        level: 'N4',
        formation: 'VERB ます-stem + おわる',
        formationExplanation: 'Remove ます from the ます-form of the verb and add おわる. The resulting compound verb means "to finish doing ~".',
        usageNotes: [
          'Used to indicate the completion of an action.',
          'Can be conjugated like a regular verb (おわります、おわった、etc.).',
          'Different from ～てしまう which can also mean completion but has additional nuances.'
        ],
        examples: [
          {
            japanese: [
              { kanji: '読', reading: 'よ' },
              { kana: 'んで', reading: 'nde' },
              { kana: 'いた', reading: 'ita' },
              { kanji: '本', reading: 'ほん' },
              { kana: 'が', reading: 'ga' },
              { kanji: '読', reading: 'よ' },
              { kana: 'み', reading: 'mi' },
              { kana: 'おわった', reading: 'owatta' }
            ],
            romaji: 'Yondeita hon ga yomiowatta',
            translation: 'I finished reading the book I was reading.'
          }
        ],
        mastery_level: 1
      },
      {
        id: 2,
        title: 'AながらB',
        meaning: 'to do B while doing A',
        level: 'N4',
        formation: 'VERB stem + ながら + Sentence',
        formationExplanation: 'Attach ながら to the stem of the first verb (remove ます from ます-form) to show it happens simultaneously with the second action.',
        usageNotes: [
          'Both actions must be performed by the same person.',
          'The action with ながら is usually the secondary or background action.',
          'Cannot be used with stative verbs like いる、ある、etc.'
        ],
        examples: [
          {
            japanese: [
              { kanji: '新聞', reading: 'しんぶん' },
              { kana: 'を', reading: 'wo' },
              { kanji: '読', reading: 'よ' },
              { kana: 'みながら', reading: 'minagara' },
              { kanji: '朝', reading: 'あさ' },
              { kanji: '食', reading: 'しょく' },
              { kana: 'を', reading: 'wo' },
              { kanji: '食', reading: 'た' },
              { kana: 'べます', reading: 'bemasu' }
            ],
            romaji: 'Shinbun wo yominagara asashoku wo tabemasu',
            translation: 'I eat breakfast while reading the newspaper.'
          }
        ],
        mastery_level: 0
      }
    ]
  }
]

// Get the current level data
const currentLevel = computed(() => {
  return grammarLevels.find(l => l.id === level)
})

// Get the selected item from navigation state or default to first item
const selectedItem = ref(router.currentRoute.value.state?.selectedItem || currentLevel.value?.items[0])

const selectItem = (item) => {
  selectedItem.value = item
}

const navigateLevel = (delta) => {
  const newLevel = level + delta
  if (newLevel >= 1 && newLevel <= grammarLevels.length) {
    router.push(`/app/courses/jlpt-n5/grammar/${newLevel}`)
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

// Set initial tab
const currentTab = ref('STRUCTURE')
</script>