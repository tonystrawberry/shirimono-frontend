<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const modelValue = shallowRef(new CalendarDate(2022, 1, 10))

function getColorByDate(date: Date) {
  const isWeekend = date.getDay() % 6 == 0
  const isDayMeeting = date.getDay() % 3 == 0

  if (isWeekend) {
    return undefined
  }

  if (isDayMeeting) {
    return 'error'
  }

  return 'success'
}
</script>

<template>
  <UCalendar v-model="modelValue">
    <template #day="{ day }">
      <UPopover mode="hover">
        <template #default>
          <div>
            <UChip
              :show="!!getColorByDate(day.toDate('UTC'))"
              :color="getColorByDate(day.toDate('UTC'))"
              size="2xs"
            >
              {{ day.day }}
            </UChip>
          </div>
        </template>

        <template #content>
          <div>
            <h3 class="text-sm/6 font-medium text-gray-500">Meetings</h3>
            <p class="text-xs/6 text-gray-500">You have a meeting today</p>
          </div>
        </template>
      </UPopover>
    </template>
  </UCalendar>
</template>