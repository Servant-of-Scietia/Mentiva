<template>
  <div class="h-full overflow-y-auto bg-neutral-50 flex flex-col pb-24">
    <!-- Onboarding Banner -->
    <Transition name="slide-down">
      <div
        v-if="state.showOnboarding"
        class="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-300 p-4 flex justify-between items-start gap-3"
      >
        <div class="flex-1">
          <p class="text-xs font-semibold text-blue-900">👋 Willkommen zu Mentiva Demo</p>
          <p class="text-xs text-blue-800 mt-1">Dies ist ein interaktives Mockup mit Beispieldaten. Navigiere durch alle Screens!</p>
        </div>
        <button
          @click="hideOnboarding"
          class="text-blue-500 hover:text-blue-700 font-bold text-lg leading-none"
        >
          ✕
        </button>
      </div>
    </Transition>

    <!-- Header with subtle gradient -->
    <div class="sticky top-0 bg-gradient-to-b from-neutral-50 to-neutral-50/80 p-6 border-b-2 border-b-amber-200/50 backdrop-blur-sm z-10">
      <div class="flex items-center gap-3 mb-4">
        <div class="text-2xl font-black text-slate-900">M</div>
        <p class="text-xs font-bold text-amber-600 uppercase tracking-widest">Mentiva</p>
        <div class="flex-1 h-0.5 bg-gradient-to-r from-amber-400 to-transparent ml-2"></div>
      </div>
      <h1 class="mentiva-headline-md">Guten Morgen</h1>
      <p class="mentiva-subtext mt-1">{{ formattedDate }}</p>
    </div>

    <div class="px-6 py-6">
      <!-- Mental Capacity Curve -->
      <div class="mb-8">
        <MentalCapacityCurve />
      </div>

      <!-- Tagesübersicht -->
      <div>
        <h2 class="mentiva-headline-sm mb-4 text-neutral-900">Dein Tagesablauf</h2>
        <div class="space-y-3">
          <FocusBlock
            v-for="(block, idx) in state.today.blocks"
            :key="`${block.time}-${block.label}`"
            :time="block.time"
            :end-time="block.endTime"
            :type="block.type"
            :label="block.label"
            :style="{ animationDelay: `${idx * 50}ms` }"
            class="animate-fade-in"
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
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to {
  opacity: 1;
  max-height: 200px;
}
</style>
