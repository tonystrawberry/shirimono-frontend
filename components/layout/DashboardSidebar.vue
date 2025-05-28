<template>
  <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
    <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
      <div class="flex h-16 shrink-0 items-center">
        <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" >
      </div>
      <nav class="flex flex-1 flex-col">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" class="-mx-2 space-y-1">
              <li v-for="item in navigation" :key="item.name">
                <NuxtLink
                  :to="item.to"
                  :class="[
                    isActive(item.to)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                    'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                  ]"
                >
                  <component :is="item.icon" class="size-6 shrink-0" aria-hidden="true" />
                  {{ item.name }}
                </NuxtLink>
              </li>
            </ul>
          </li>
          <li class="-mx-6 mt-auto">
            <a href="#" class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800">
              <img v-if="usersStore.currentUser" class="size-8 rounded-full bg-gray-800" :src="usersStore.currentUser.imageUrl" :alt="usersStore.currentUser.email" >
              <span class="sr-only">Your profile</span>
              <span v-if="usersStore.currentUser" aria-hidden="true">{{ usersStore.currentUser.email }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import {
  HomeIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline'
import { useUsersStore } from '~/stores/users'

const navigation = [
  { name: 'Home', to: '/app', icon: HomeIcon },
  { name: 'Courses', to: '/app/courses', icon: AcademicCapIcon },
  { name: 'Settings', to: '/app/settings', icon: Cog6ToothIcon },
]

const route = useRoute()
const isActive = (to) => route.path === to
const usersStore = useUsersStore()
</script>