<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute top-0 left-full flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <DashboardSidebar :user="currentUser" />
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <DashboardSidebar :user="currentUser" />

    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-xs sm:px-6 lg:hidden">
      <button type="button" class="-m-2.5 p-2.5 text-gray-400 lg:hidden" @click="sidebarOpen = true">
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="size-6" aria-hidden="true" />
      </button>
      <div class="flex-1 text-sm/6 font-semibold text-white">Dashboard</div>
      <a href="#">
        <span class="sr-only">Your profile</span>
        <img class="size-8 rounded-full bg-gray-800" :src="currentUser.imageUrl" :alt="currentUser.name" >
      </a>
    </div>

    <main class="py-10 lg:pl-72">
      <div class="px-4 sm:px-6 lg:px-8">
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
          <div class="col-span-2">
            <GrammarOfTheDay />
          </div>

          <!-- Vocabulary of the Day Card - Commented out for preview -->
          <div class="col-span-2">
            <VocabularyOfTheDay />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

import DashboardSidebar from '~/components/layout/DashboardSidebar.vue'
import UserBanner from '~/components/dashboard/UserBanner.vue'
import CourseProgress from '~/components/dashboard/CourseProgress.vue'
import KanjiOfTheDay from '~/components/dashboard/KanjiOfTheDay.vue'
import ReviewCalendar from '~/components/dashboard/ReviewCalendar.vue'
import GrammarOfTheDay from '~/components/dashboard/GrammarOfTheDay.vue'
import VocabularyOfTheDay from '~/components/dashboard/VocabularyOfTheDay.vue'

const sidebarOpen = ref(false)

const currentUser = {
  name: 'John Doe',
  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
</script>