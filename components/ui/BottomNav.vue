<template>
  <div class="w-full border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-xl flex justify-around items-center h-full rounded-t-3xl shadow-2xl">

    <!-- Dashboard -->
    <button
      @click="() => goTo('dashboard')"
      :class="navClass('dashboard')"
    >
      <span class="text-2xl mb-1">🏠</span>
      <span class="text-[11px] font-medium">Dashboard</span>
    </button>

    <!-- Calendar -->
    <button
      @click="() => goTo('calendar')"
      :class="navClass('calendar')"
    >
      <span class="text-2xl mb-1">📅</span>
      <span class="text-[11px] font-medium">Kalender</span>
    </button>

    <!-- Check-in -->
    <button
  @click="() => goTo('checkin')"
  class="
    flex flex-col items-center justify-center
    w-16 h-16 -mt-8 rounded-full
    relative transition
    hover:scale-110 active:scale-95
  "
>
  <!-- glow layer -->
  <div class="absolute inset-0 rounded-full bg-amber-400/20 blur-md"></div>

  <!-- main surface -->
  <div class="
    absolute inset-0 rounded-full
    bg-gradient-to-br from-amber-300 to-amber-500
    border border-amber-200/40
    shadow-lg
  "></div>

  <!-- icon layer -->
  <span class="relative text-slate-950 text-2xl font-black leading-none">
    +
  </span>
</button>

    <!-- Trends -->
    <button
      @click="() => goTo('week')"
      :class="navClass('week')"
    >
      <span class="text-2xl mb-1">📈</span>
      <span class="text-[11px] font-medium">Trends</span>
    </button>

    <!-- spacer -->
    <div class="flex-1"></div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMentivaDemo } from '../../composables/useMentivaDemo'

const { state, goTo } = useMentivaDemo()

const currentScreen = computed(() => state.currentScreen)

function navClass(screen: string) {
  const base =
    'flex flex-col items-center justify-center flex-1 h-full transition-all duration-200'

  const inactive =
    'text-slate-500 hover:text-slate-300'

  const active =
    'text-amber-400 scale-105'

  return `${base} ${currentScreen.value === screen ? active : inactive}`
}
</script>