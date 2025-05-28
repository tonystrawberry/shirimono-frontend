<template>
  <div class="min-h-screen bg-kanji">
    <!-- Header -->
    <div class="flex justify-between items-center p-4 bg-gray-900 shadow">
      <button @click="router.back()" class="text-white hover:bg-white/10 p-2 rounded-full transition">
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
      <h1 class="text-white/90 font-medium flex items-center gap-2">
        <CheckCircleIcon class="w-5 h-5" />
        結果 ({{ formatDate(new Date()) }})
      </h1>
      <div class="w-10" /> <!-- Spacer for alignment -->
    </div>

    <!-- Stats Cards -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Correct Card -->
        <div class="overflow-hidden rounded-lg bg-gray-900 shadow">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-gray-300 font-medium">CORRECT</h3>
              <div class="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-sm">
                {{ stats.correct }}%
              </div>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-bold text-white">{{ stats.correctCount }}</span>
              <span class="text-gray-400">/ {{ stats.total }}</span>
            </div>
            <div class="flex mt-3">
              <div v-for="i in 5" :key="i" class="w-5 h-5 text-gray-700" :class="{'text-yellow-400': i <= Math.round(stats.correct / 20)}">
                <StarIcon />
              </div>
            </div>
          </div>
        </div>

        <!-- Kanji Card -->
        <div class="overflow-hidden rounded-lg bg-gray-900 shadow">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-gray-300 font-medium">KANJI</h3>
              <div class="bg-sky-500/20 text-sky-400 px-2 py-1 rounded-full text-sm">
                {{ stats.kanji }}%
              </div>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-bold text-white">{{ stats.kanjiCount }}</span>
              <span class="text-gray-400">/ {{ stats.kanjiTotal }}</span>
            </div>
            <div class="flex mt-3">
              <div v-for="i in 5" :key="i" class="w-5 h-5 text-gray-700" :class="{'text-yellow-400': i <= Math.round(stats.kanji / 20)}">
                <StarIcon />
              </div>
            </div>
          </div>
        </div>

        <!-- Vocabulary Card -->
        <div class="overflow-hidden rounded-lg bg-gray-900 shadow">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-gray-300 font-medium">VOCABULARY</h3>
              <div class="bg-violet-500/20 text-violet-400 px-2 py-1 rounded-full text-sm">
                {{ stats.vocabulary }}%
              </div>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-bold text-white">{{ stats.vocabularyCount }}</span>
              <span class="text-gray-400">/ {{ stats.vocabularyTotal }}</span>
            </div>
            <div class="flex mt-3">
              <div v-for="i in 5" :key="i" class="w-5 h-5 text-gray-700" :class="{'text-yellow-400': i <= Math.round(stats.vocabulary / 20)}">
                <StarIcon />
              </div>
            </div>
          </div>
        </div>

        <!-- Grammar Card -->
        <div class="overflow-hidden rounded-lg bg-gray-900 shadow">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-gray-300 font-medium">GRAMMAR</h3>
              <div class="bg-pink-500/20 text-pink-400 px-2 py-1 rounded-full text-sm">
                {{ stats.grammar }}%
              </div>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-bold text-white">{{ stats.grammarCount }}</span>
              <span class="text-gray-400">/ {{ stats.grammarTotal }}</span>
            </div>
            <div class="flex mt-3">
              <div v-for="i in 5" :key="i" class="w-5 h-5 text-gray-700" :class="{'text-yellow-400': i <= Math.round(stats.grammar / 20)}">
                <StarIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="mt-8 flex gap-4 overflow-x-auto pb-4">
        <button
          v-for="category in categories"
          :key="category.name"
          @click="selectedCategory = category.name"
          class="flex items-center gap-2 px-4 py-2 rounded-full transition-colors"
          :class="[
            selectedCategory === category.name
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-gray-300'
          ]"
        >
          {{ category.name }}
          <span class="bg-gray-800 px-2 py-0.5 rounded-full text-sm">{{ category.count }}</span>
        </button>
      </div>

      <!-- Results List -->
      <div class="mt-6 overflow-hidden rounded-lg bg-gray-900 shadow">
        <div class="divide-y divide-gray-800">
          <div v-for="(result, index) in filteredResults" :key="index" class="p-6 flex items-center gap-6">
            <div class="w-8 h-8 flex-shrink-0 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
              {{ index + 1 }}
            </div>
            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm px-3 py-0.5 rounded-full bg-gray-800 text-gray-400">
                  {{ result.type }}
                </span>
              </div>
              <div class="text-lg text-gray-300 mb-1">{{ result.question }}</div>
              <div class="text-gray-400">{{ result.answer }}</div>
            </div>
            <div class="flex-shrink-0">
              <div v-if="result.correct" class="text-emerald-400">
                <CheckCircleIcon class="w-6 h-6" />
              </div>
              <div v-else class="text-red-400">
                <XCircleIcon class="w-6 h-6" />
              </div>
            </div>
            <button class="text-gray-400 hover:text-gray-300 transition-colors">
              <MagnifyingGlassIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'classroom'
})

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronLeftIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/solid'

const router = useRouter()
const selectedCategory = ref('VOCABULARY')

// Mock data - replace with real data from your state management
const stats = {
  correct: 85,
  correctCount: 6,
  total: 7,
  kanji: 0,
  kanjiCount: 0,
  kanjiTotal: 0,
  vocabulary: 85,
  vocabularyCount: 6,
  vocabularyTotal: 7,
  grammar: 0,
  grammarCount: 0,
  grammarTotal: 0
}

const categories = [
  { name: 'CORRECT', count: 6 },
  { name: 'KANJI', count: 0 },
  { name: 'VOCABULARY', count: 7 },
  { name: 'GRAMMAR', count: 0 }
]

const results = [
  {
    type: 'VOCABULARY MEANING',
    question: '粗末 (な)',
    answer: 'miserable',
    correct: true
  },
  {
    type: 'VOCABULARY MEANING',
    question: '生活費',
    answer: 'cost of living',
    correct: true
  },
  {
    type: 'VOCABULARY MEANING',
    question: '医療費',
    answer: 'medical expenses',
    correct: true
  },
  {
    type: 'VOCABULARY MEANING',
    question: '渋い',
    answer: 'bitter',
    correct: true
  },
  {
    type: 'VOCABULARY MEANING',
    question: '好物',
    answer: 'favorite thing',
    correct: true
  }
]

const filteredResults = computed(() => {
  if (selectedCategory.value === 'CORRECT') {
    return results.filter(r => r.correct)
  }
  return results.filter(r => r.type.startsWith(selectedCategory.value))
})

function formatDate(date) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).format(date)
}
</script>