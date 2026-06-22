<template>
  <div class="flex h-full w-full items-center justify-around border-t border-slate-800/60 bg-slate-950/80 shadow-2xl backdrop-blur-xl">

    <!-- Today -->
    <button
      @click="() => goTo('dashboard')"
      :class="navClass('dashboard')"
    >
      <span :class="iconClass('dashboard')">⌂</span>
      <span class="text-[11px] font-medium">Heute</span>
    </button>

    <!-- Planning -->
    <button
      @click="() => goTo('calendar')"
      :class="navClass('calendar')"
    >
      <span :class="iconClass('calendar')">▦</span>
      <span class="text-[11px] font-medium">Planung</span>
    </button>

    <!-- Check-in -->
    <button
      @click="() => goTo('checkin')"
      class="relative -mt-7 flex h-16 w-16 flex-col items-center justify-center rounded-full transition hover:scale-105 active:scale-95"
    >
      <div class="absolute inset-1 rounded-full bg-amber-400/15 blur-md"></div>
      <div class="absolute inset-1 rounded-full border border-amber-200/30 bg-amber-400 shadow-lg shadow-amber-500/20"></div>
      <span class="relative text-3xl font-light leading-none text-slate-950">+</span>
    </button>

    <!-- Forecast -->
    <button
      @click="() => goTo('week')"
      :class="navClass('week')"
    >
      <span :class="iconClass('week')">⌁</span>
      <span class="text-[11px] font-medium">Prognose</span>
    </button>

    <!-- Data -->
    <button
      @click="() => goTo('signals')"
      :class="navClass('signals')"
    >
      <span :class="iconClass('signals')">◌</span>
      <span class="text-[11px] font-medium">Daten</span>
    </button>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMentivaDemo } from '../../composables/useMentivaDemo'

const { state, goTo } = useMentivaDemo()

const currentScreen = computed(() => state.currentScreen)

function navClass(screen: string) {
  const base =
    'flex flex-col items-center justify-center flex-1 h-full pt-1 transition-all duration-200'

  const inactive =
    'text-slate-500 hover:text-slate-300'

  const active =
    'text-amber-400 scale-105'

  return `${base} ${currentScreen.value === screen ? active : inactive}`
}

function iconClass(screen: string) {
  const base =
    'mb-1 flex h-7 w-7 items-center justify-center text-2xl font-light leading-none transition-all duration-200'

  const inactive =
    'text-slate-500'

  const active =
    'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.18)]'

  return `${base} ${currentScreen.value === screen ? active : inactive}`
}
</script>
