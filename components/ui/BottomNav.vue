<template>
  <div class="w-full bg-white border-t-2 border-neutral-200 flex justify-around items-center h-full rounded-t-3xl shadow-2xl">
    <!-- Dashboard -->
    <button
      @click="() => goTo('dashboard')"
      :class="[
        'flex flex-col items-center justify-center flex-1 h-full transition-all duration-200',
        'hover:scale-110 active:scale-95',
        currentScreen === 'dashboard'
          ? 'text-amber-500 scale-105'
          : 'text-neutral-400 hover:text-neutral-600'
      ]"
      title="Dashboard"
    >
      <span class="text-2xl mb-1">🏠</span>
      <span class="text-xs font-semibold">Dashboard</span>
    </button>

    <!-- Calendar -->
    <button
      @click="() => goTo('calendar')"
      :class="[
        'flex flex-col items-center justify-center flex-1 h-full transition-all duration-200',
        'hover:scale-110 active:scale-95',
        currentScreen === 'calendar'
          ? 'text-amber-500 scale-105'
          : 'text-neutral-400 hover:text-neutral-600'
      ]"
      title="Kalender"
    >
      <span class="text-2xl mb-1">📅</span>
      <span class="text-xs font-semibold">Kalender</span>
    </button>

    <!-- Check-in (Central CTA) -->
    <button
      @click="() => goTo('checkin')"
      :class="[
        'flex flex-col items-center justify-center transition-all duration-200',
        'w-16 h-16 -mt-8 rounded-full shadow-xl',
        'hover:scale-110 active:scale-90',
        'border-4 border-white',
        currentScreen === 'checkin'
          ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white scale-110 shadow-2xl'
          : 'bg-gradient-to-br from-amber-400 to-amber-500 text-white'
      ]"
      title="Check-in"
    >
      <span class="text-3xl">➕</span>
    </button>

    <!-- Trends -->
    <button
      @click="() => goTo('week')"
      :class="[
        'flex flex-col items-center justify-center flex-1 h-full transition-all duration-200',
        'hover:scale-110 active:scale-95',
        currentScreen === 'week'
          ? 'text-amber-500 scale-105'
          : 'text-neutral-400 hover:text-neutral-600'
      ]"
      title="Trends"
    >
      <span class="text-2xl mb-1">📈</span>
      <span class="text-xs font-semibold">Trends</span>
    </button>

    <!-- Placeholder for symmetry -->
    <div class="flex-1" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMentivaDemo } from '../../composables/useMentivaDemo'

const { state, goTo } = useMentivaDemo()

const currentScreen = computed(() => state.currentScreen)
</script>
