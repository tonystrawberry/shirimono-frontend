<template>
  <div class="max-w-5xl mx-auto pt-4 pb-10 px-4">
    <!-- Top Banner -->
    <div class="rounded-lg bg-gray-800 shadow mb-8">
      <div class="px-4 py-4 flex items-center gap-4">
        <AcademicCapIcon class="w-10 h-10 text-white" aria-hidden="true" />
        <h1 class="text-3xl font-bold text-white">JLPT N5</h1>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex justify-center gap-6 mb-8">
      <button
        :class="[tab === 'kanji' ? 'bg-indigo-600 text-white' : 'bg-indigo-900 text-indigo-300', 'px-6 py-3 rounded-lg font-bold text-lg flex flex-col items-center gap-1 transition min-w-[120px]']"
        @click="tab = 'kanji'"
      >
        <span class="flex items-center gap-2">
          <AcademicCapIcon class="w-6 h-6" />
          <span>漢字</span>
        </span>
        <span class="text-xs font-normal tracking-wider uppercase text-indigo-200">KANJI</span>
      </button>
      <button
        :class="[tab === 'vocabulary' ? 'bg-violet-600 text-white' : 'bg-violet-900 text-violet-200', 'px-6 py-3 rounded-lg font-bold text-lg flex flex-col items-center gap-1 transition min-w-[120px]']"
        @click="tab = 'vocabulary'"
      >
        <span class="flex items-center gap-2">
          <BookOpenIcon class="w-6 h-6" />
          <span>単語</span>
        </span>
        <span class="text-xs font-normal tracking-wider uppercase text-violet-200">VOCABULARY</span>
      </button>
      <button
        :class="[tab === 'grammar' ? 'bg-teal-600 text-white' : 'bg-teal-900 text-teal-200', 'px-6 py-3 rounded-lg font-bold text-lg flex flex-col items-center gap-1 transition min-w-[120px]']"
        @click="tab = 'grammar'"
      >
        <span class="flex items-center gap-2">
          <Cog6ToothIcon class="w-6 h-6" />
          <span>文法</span>
        </span>
        <span class="text-xs font-normal tracking-wider uppercase text-teal-200">GRAMMAR</span>
      </button>
    </div>

    <!-- Levels Section (Sample for Kanji) -->
    <div v-if="tab === 'kanji'">
      <div class="bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4 text-white">Levels</h2>
        <div v-for="level in kanjiLevels" :key="level.id" class="mb-8">
          <div class="flex items-center mb-2 relative">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-700 text-white font-bold mr-3">
              {{ level.level }}
            </span>
            <span class="text-lg font-semibold text-white mr-3">{{ level.title }}</span>
            <span class="bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded ml-2" v-if="level.level === 1">Start level</span>
            <span class="text-gray-400 text-xs ml-4 absolute right-0">{{ level.items.length }} items</span>
          </div>
          <!-- Progress bar -->
          <div class="w-full h-3 bg-indigo-900 rounded-full overflow-hidden mb-2">
            <div
              class="h-3 bg-indigo-400 rounded-full transition-all"
              :style="{ width: `${level.learned / level.items.length * 100}%` }"
            ></div>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <button
              v-for="item in level.items"
              :key="item.id"
              @click="handleItemClick(level, item)"
              class="inline-block px-3 py-1 rounded bg-indigo-700 text-white font-semibold text-lg shadow-sm hover:bg-indigo-500 transition"
            >
              {{ item.title }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="tab === 'vocabulary'">
      <div class="bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4 text-white">Levels</h2>
        <div v-for="level in vocabLevels" :key="level.id" class="mb-8">
          <div class="flex items-center mb-2 relative">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-700 text-white font-bold mr-3">
              {{ level.level }}
            </span>
            <span class="text-lg font-semibold text-white mr-3">{{ level.title }}</span>
            <span class="bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded ml-2" v-if="level.level === 1">Start level</span>
            <span class="text-gray-400 text-xs ml-4 absolute right-0">{{ level.items.length }} items</span>
          </div>
          <!-- Progress bar -->
          <div class="w-full h-3 bg-violet-900 rounded-full overflow-hidden mb-2">
            <div
              class="h-3 bg-violet-400 rounded-full transition-all"
              :style="{ width: `${level.learned / level.items.length * 100}%` }"
            ></div>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <button
              v-for="item in level.items"
              :key="item.id"
              @click="handleItemClick(level, item)"
              class="inline-block px-3 py-1 rounded bg-violet-700 text-white font-semibold text-lg shadow-sm hover:bg-violet-500 transition"
            >
              {{ item.title }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="tab === 'grammar'">
      <div class="bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4 text-white">Levels</h2>
        <div v-for="level in grammarLevels" :key="level.id" class="mb-8">
          <div class="flex items-center mb-2 relative">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-700 text-white font-bold mr-3">
              {{ level.level }}
            </span>
            <span class="text-lg font-semibold text-white mr-3">{{ level.title }}</span>
            <span class="bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded ml-2" v-if="level.level === 1">Start level</span>
            <span class="text-gray-400 text-xs ml-4 absolute right-0">{{ level.items.length }} items</span>
          </div>
          <!-- Progress bar -->
          <div class="w-full h-3 bg-teal-900 rounded-full overflow-hidden mb-2">
            <div
              class="h-3 bg-teal-400 rounded-full transition-all"
              :style="{ width: `${level.learned / level.items.length * 100}%` }"
            ></div>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <button
              v-for="item in level.items"
              :key="item.id"
              @click="handleItemClick(level, item)"
              class="inline-block px-3 py-1 rounded bg-teal-700 text-white font-semibold text-lg shadow-sm hover:bg-teal-500 transition"
            >
              {{ item.title }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AcademicCapIcon, BookOpenIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

const tab = ref('kanji')
const router = useRouter()

const handleItemClick = (level, item) => {
  // Navigate to the level page
  router.push(`/app/courses/jlpt-n5/${tab.value}/${level.id}`, {
    state: { selectedItem: item }  // Pass item data via navigation state
  })
}

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
      },
      {
        id: 11,
        title: 'ろく',
        slug: 'roku',
        mastery_level: 0
      },
      {
        id: 12,
        title: 'しち',
        slug: 'shichi',
        mastery_level: 0
      },
      {
        id: 13,
        title: 'はち',
        slug: 'hachi',
        mastery_level: 0
      },
      {
        id: 14,
        title: 'きゅう',
        slug: 'kyuu',
        mastery_level: 0
      },
      {
        id: 15,
        title: 'じゅう',
        slug: 'juu',
        mastery_level: 0
      }
    ],
    learned: 4
  }
]

const grammarLevels = [
  {
    id: 1,
    level: 1,
    title: 'Particles',
    items: [
      {
        id: 1,
        title: 'は',
        slug: 'wa',
        mastery_level: 3
      },
      {
        id: 2,
        title: 'が',
        slug: 'ga',
        mastery_level: 2
      },
      {
        id: 3,
        title: 'を',
        slug: 'wo',
        mastery_level: 1
      },
      {
        id: 4,
        title: 'に',
        slug: 'ni',
        mastery_level: 0
      },
      {
        id: 5,
        title: 'で',
        slug: 'de',
        mastery_level: 0
      },
      {
        id: 6,
        title: 'と',
        slug: 'to',
        mastery_level: 0
      },
      {
        id: 7,
        title: 'も',
        slug: 'mo',
        mastery_level: 0
      }
    ],
    learned: 2
  },
  {
    id: 2,
    level: 2,
    title: 'Basic sentence endings',
    items: [
      {
        id: 8,
        title: 'です',
        slug: 'desu',
        mastery_level: 3
      },
      {
        id: 9,
        title: 'ます',
        slug: 'masu',
        mastery_level: 0
      },
      {
        id: 10,
        title: 'ません',
        slug: 'masen',
        mastery_level: 0
      },
      {
        id: 11,
        title: 'ました',
        slug: 'mashita',
        mastery_level: 0
      },
      {
        id: 12,
        title: 'ましょう',
        slug: 'mashou',
        mastery_level: 0
      }
    ],
    learned: 1
  }
]
</script>