<template>
  <div class="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">

    <!-- Onboarding -->
    <Transition name="slide-down">
      <div v-if="state.showOnboarding"
        class="border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md p-4 pt-8 pl-5 flex justify-between" 
      >
          <p class="text-xs font-semibold text-amber-400">Willkommen zum Mentiva Mockup</p>
        <button class="text-slate-400" @click="hideOnboarding">✕</button>
      </div>
    </Transition>

    <div class="top-0 z-10 border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-md p-6">
      <h1 class="text-xl font-black">Guten Morgen</h1>
      <p class="text-sm text-slate-400">{{ formattedDate }}</p>
    </div>

    <div class="flex-1 overflow-y-auto px-6 py-6">

      <div class="mb-8">
        <MentalCapacityCurve />
      </div>

      <div>
        <h2 class="text-sm font-bold text-slate-300 mb-4">Dein Tagesablauf</h2>

        <div class="space-y-3">
          <FocusBlock
            v-for="(block, idx) in state.today.blocks"
            :key="`${block.time}-${block.label}`"
            :time="block.time"
            :end-time="block.endTime"
            :type="block.type"
            :label="block.label"
            :style="{ animationDelay: `${idx * 60}ms` }"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMentivaDemo } from '../../composables/useMentivaDemo'
import FocusBlock from '../../components/ui/FocusBlock.vue'
import MentalCapacityCurve from '../../components/ui/MentalCapacityCurve.vue'

const { state, hideOnboarding } = useMentivaDemo()

const formattedDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeInUp 0.45s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>