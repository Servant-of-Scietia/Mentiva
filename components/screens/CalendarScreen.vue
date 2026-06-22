<template>
  <div class="h-full overflow-y-auto pb-24 bg-neutral-50">
    <!-- Header with Mentiva branding -->
    <div class="sticky top-0 bg-gradient-to-b from-neutral-50 to-neutral-50/80 p-6 border-b-2 border-b-amber-200/50 backdrop-blur-sm z-10">
      <div class="flex items-center gap-3 mb-4">
        <div class="text-2xl font-black text-slate-900">M</div>
        <p class="text-xs font-bold text-amber-600 uppercase tracking-widest">Mentiva</p>
        <div class="flex-1 h-0.5 bg-gradient-to-r from-amber-400 to-transparent ml-2"></div>
      </div>
      <h1 class="mentiva-headline-md mb-2">Tagesplan</h1>
      <p class="mentiva-subtext">Deine Aufgaben in den optimalen Fokusphasen</p>
    </div>
  </div>

    <div class="p-6">
    <!-- Timeline Container -->
    <div class="mentiva-card p-6 border-2 border-neutral-200">
      <!-- Time labels on the left -->
      <div class="absolute left-6 top-24 bottom-6 w-12 flex flex-col justify-between text-xs text-neutral-400 font-bold pointer-events-none">
        <span>08:00</span>
        <span>10:00</span>
        <span>12:00</span>
        <span>14:00</span>
        <span>16:00</span>
        <span>18:00</span>
      </div>

      <!-- Timeline track -->
      <div class="ml-16 relative h-96 border-l-4 border-amber-200 pl-4">
        <!-- Events positioned by time with entrance animation -->
        <div
          v-for="(block, idx) in state.today.blocks"
          :key="`${block.time}-${block.label}`"
          class="absolute left-0 right-0 p-4 rounded-xl shadow-md border-l-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
          :class="getBlockStyle(block.type)"
          :style="{
            ...getBlockPosition(block.time, block.endTime),
            animation: `slideInBlock 0.5s ease-out forwards`,
            animationDelay: `${idx * 80}ms`
          }"
        >
          <div class="font-bold text-sm mb-1">{{ block.label }}</div>
          <div class="text-xs opacity-75 font-medium">{{ block.time }} – {{ block.endTime }}</div>
        </div>
      </div>
    </div>

    <!-- Info Box -->
    <div class="mt-6 mentiva-card bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-blue-400 p-4">
      <p class="text-xs font-bold text-blue-900 mb-2">ℹ️ Wie Mentiva optimiert</p>
      <p class="text-xs text-blue-800 leading-relaxed">
        Deine Peak-Fokuszeit (9:40–12:10) ist für Deep Work reserviert. Meetings und Admin-Aufgaben landen in Zeiten mit niedrigerer kognitiver Last.
      </p>
    </div>
  </div>

</template>

<script setup lang="ts">
import { useMentivaDemo } from '../../composables/useMentivaDemo'

const { state } = useMentivaDemo()

const typeStyles = {
  deepwork: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border-amber-400',
  meeting: 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-400',
  routine: 'bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-600 border-neutral-400'
}

function getBlockStyle(type: 'deepwork' | 'meeting' | 'routine') {
  return typeStyles[type]
}

function getBlockPosition(startTime: string, endTime: string) {
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  const baseMinutes = 8 * 60

  const topPercent = ((startMinutes - baseMinutes) / (10 * 60)) * 100
  const heightPercent = ((endMinutes - startMinutes) / (10 * 60)) * 100

  return {
    top: `${topPercent}%`,
    height: `${heightPercent}%`
  }
}
</script>

<style scoped>
@keyframes slideInBlock {
  from {
    opacity: 0;
    transform: translateX(-24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
