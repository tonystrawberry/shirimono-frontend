<template>
  <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
    <!-- Banner -->
    <UserBanner :user="currentUser" />

    <!-- Course Progress -->
    <div class="mt-6">
      <CourseProgress />
    </div>

    <!-- Calendar Section -->
    <div class="mt-6 grid grid-cols-3 gap-6">
      <!-- Word of the Day Card -->
      <div class="col-span-2">
        <KanjiOfTheDay />
      </div>

      <!-- Calendar Card -->
      <div>
        <ReviewCalendar />
      </div>

      <!-- Grammar of the Day Card - Commented out for preview -->
      <!-- <div class="col-span-2">
        <GrammarOfTheDay />
      </div> -->

      <!-- Vocabulary of the Day Card - Commented out for preview -->
      <!-- <div class="col-span-3">
        <VocabularyOfTheDay />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import UserBanner from '~/components/dashboard/UserBanner.vue'
import CourseProgress from '~/components/dashboard/CourseProgress.vue'
import KanjiOfTheDay from '~/components/dashboard/KanjiOfTheDay.vue'
import ReviewCalendar from '~/components/dashboard/ReviewCalendar.vue'
import GrammarOfTheDay from '~/components/dashboard/GrammarOfTheDay.vue'
import VocabularyOfTheDay from '~/components/dashboard/VocabularyOfTheDay.vue'

const currentUser = {
  name: 'John Doe',
  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
</script>