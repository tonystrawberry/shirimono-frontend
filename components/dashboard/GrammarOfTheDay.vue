<template>
  <div class="bg-gradient-to-br from-teal-400 to-teal-500 shadow rounded-lg">
    <div class="p-6">
      <h2 class="text-lg font-semibold text-white mb-4">Grammar of the Day</h2>
      <div class="flex">
        <!-- Grammar Point Column -->
        <div class="flex flex-col items-center w-1/3">
          <div class="text-5xl font-bold text-white mb-6">〜ておく</div>
          <div class="space-y-4 text-center w-full">
            <div>
              <div class="text-white/60 text-xs uppercase tracking-wider mb-1">Reading</div>
              <div class="text-xl text-white">て おく</div>
            </div>
            <div class="pt-2">
              <div class="text-white/60 text-xs uppercase tracking-wider mb-1">Usage</div>
              <div class="text-lg text-white/80">Preparation or doing something in advance</div>
            </div>
          </div>
        </div>
        <!-- Example Sentences Column -->
        <div class="w-2/3 pl-8 flex flex-col justify-center">
          <div class="grid grid-cols-2 gap-6">
            <!-- Left Column Examples -->
            <div class="space-y-4">
              <div v-for="(example, index) in casualExamples" :key="index" class="space-y-1">
                <div class="text-lg text-white">{{ example.japanese }}</div>
                <div class="text-sm text-white/80">{{ example.romaji }}</div>
                <div class="text-sm text-white/60">{{ example.english }}</div>
              </div>
            </div>
            <!-- Right Column Examples -->
            <div class="space-y-4">
              <div v-for="(example, index) in formalExamples" :key="index" class="space-y-1">
                <div class="text-lg text-white">{{ example.japanese }}</div>
                <div class="text-sm text-white/80">{{ example.romaji }}</div>
                <div class="text-sm text-white/60">{{ example.english }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const casualExamples = [
  {
    japanese: '晩ご飯を作っておきました。',
    romaji: 'Bangohan wo tsukutte okimashita.',
    english: 'I prepared dinner (in advance).'
  },
  {
    japanese: '窓を開けておく。',
    romaji: 'Mado wo akete oku.',
    english: 'I\'ll leave the window open (for later).'
  },
  {
    japanese: '電話番号を書いておいて。',
    romaji: 'Denwa bangō wo kaite oite.',
    english: 'Write down the phone number (for future use).'
  }
]

const formalExamples = [
  {
    japanese: '資料を準備しておきます。',
    romaji: 'Shiryō wo junbi shite okimasu.',
    english: 'I will prepare the documents (beforehand).'
  },
  {
    japanese: '会議室を予約しておきました。',
    romaji: 'Kaigishitsu wo yoyaku shite okimashita.',
    english: 'I have booked the meeting room (in preparation).'
  },
  {
    japanese: 'メールを送っておいた方がいいです。',
    romaji: 'Mēru wo okutte oita hō ga ii desu.',
    english: 'It would be better to send the email (in advance).'
  }
]
</script>