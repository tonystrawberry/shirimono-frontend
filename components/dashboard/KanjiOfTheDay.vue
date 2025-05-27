<template>
  <div class="bg-gradient-to-br from-indigo-400 to-indigo-500 shadow rounded-lg">
    <div class="p-6">
      <div class="flex">
        <!-- Kanji Column -->
        <div class="flex flex-col items-center w-1/3">
          <h2 class="text-lg font-semibold text-white mb-4">Kanji of the Day</h2>
          <div class="text-7xl font-bold text-white mb-6">犬</div>
          <div class="space-y-4 text-center w-full">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-white/60 text-xs uppercase tracking-wider mb-1">Kunyomi</div>
                <UTooltip text="いぬ" :delay="0">
                  <div class="text-xl text-white cursor-help">いぬ</div>
                </UTooltip>
              </div>
              <div>
                <div class="text-white/60 text-xs uppercase tracking-wider mb-1">Onyomi</div>
                <UTooltip text="ken" :delay="0">
                  <div class="text-xl text-white cursor-help">ケン</div>
                </UTooltip>
              </div>
            </div>
            <div class="pt-2">
              <div class="text-white/60 text-xs uppercase tracking-wider mb-1">Meaning</div>
              <div class="text-lg text-white/80">dog</div>
            </div>
          </div>
        </div>
        <!-- Example Sentences Column -->
        <div class="w-2/3 pl-8 flex flex-col justify-center">
          <div class="grid grid-cols-2 gap-6">
            <!-- Left Column Examples -->
            <div class="space-y-4">
              <div v-for="(example, index) in kunyomiExamples" :key="index" class="space-y-1">
                <div class="text-lg text-white">{{ example.japanese }}</div>
                <div class="text-sm text-white/80">{{ example.romaji }}</div>
                <div class="text-sm text-white/60">{{ example.english }}</div>
              </div>
            </div>
            <!-- Right Column Examples -->
            <div class="space-y-4">
              <div v-for="(example, index) in onyomiExamples" :key="index" class="space-y-1">
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
const kunyomiExamples = [
  {
    japanese: '私の犬は大きいです。',
    romaji: 'Watashi no inu wa ōkii desu.',
    english: 'My dog is big.'
  },
  {
    japanese: '黒い犬が走っています。',
    romaji: 'Kuroi inu ga hashitte imasu.',
    english: 'A black dog is running.'
  },
  {
    japanese: '犬を散歩に連れて行きます。',
    romaji: 'Inu wo sanpo ni tsurete ikimasu.',
    english: 'I will take the dog for a walk.'
  }
]

const onyomiExamples = [
  {
    japanese: '警察犬は賢いです。',
    romaji: 'Keisatsu-ken wa kashikoi desu.',
    english: 'Police dogs are smart.'
  },
  {
    japanese: '盲導犬は目の見えない人を助けます。',
    romaji: 'Mōdō-ken wa me no mienai hito wo tasukemasu.',
    english: 'Guide dogs help blind people.'
  },
  {
    japanese: '猟犬は狩りに使われます。',
    romaji: 'Ryōken wa kari ni tsukawaremasu.',
    english: 'Hunting dogs are used for hunting.'
  }
]
</script>