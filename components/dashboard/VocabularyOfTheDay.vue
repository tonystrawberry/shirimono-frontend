<template>
  <div class="bg-gradient-to-br from-violet-400 to-violet-500 shadow rounded-lg">
    <div class="p-6">
      <h2 class="text-lg font-semibold text-white mb-4">Vocabulary of the Day</h2>
      <div class="flex">
        <!-- Vocabulary Column -->
        <div class="flex flex-col items-center w-1/3">
          <div class="text-6xl font-bold text-white mb-6">懐かしい</div>
          <div class="space-y-4 text-center w-full">
            <div>
              <div class="text-white/60 text-xs uppercase tracking-wider mb-1">Reading</div>
              <div class="text-xl text-white">なつかしい</div>
            </div>
            <div class="pt-2">
              <div class="text-white/60 text-xs uppercase tracking-wider mb-1">Type</div>
              <div class="text-lg text-white/80">い-Adjective</div>
            </div>
            <div class="pt-2">
              <div class="text-white/60 text-xs uppercase tracking-wider mb-1">Meaning</div>
              <div class="text-lg text-white/80">Nostalgic; dear; missed</div>
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
    japanese: '故郷が懐かしい。',
    romaji: 'Furusato ga natsukashii.',
    english: 'I miss my hometown.'
  },
  {
    japanese: '懐かしい友達に会った。',
    romaji: 'Natsukashii tomodachi ni atta.',
    english: 'I met an old friend.'
  },
  {
    japanese: 'その歌は懐かしいね。',
    romaji: 'Sono uta wa natsukashii ne.',
    english: 'That song brings back memories.'
  }
]

const formalExamples = [
  {
    japanese: '懐かしい思い出がよみがえります。',
    romaji: 'Natsukashii omoide ga yomigaerimasu.',
    english: 'Fond memories come flooding back.'
  },
  {
    japanese: '子供の頃の写真を見ると懐かしくなります。',
    romaji: 'Kodomo no koro no shashin wo miru to natsukashiku narimasu.',
    english: 'Looking at childhood photos makes me feel nostalgic.'
  },
  {
    japanese: '懐かしい香りがしました。',
    romaji: 'Natsukashii kaori ga shimashita.',
    english: 'There was a familiar scent.'
  }
]
</script>