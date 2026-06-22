<template>
  <div class="h-full overflow-y-auto pb-24 bg-neutral-50">
    <!-- Header with Mentiva branding -->
    <div class="sticky top-0 bg-gradient-to-b from-neutral-50 to-neutral-50/80 p-6 border-b-2 border-b-amber-200/50 backdrop-blur-sm z-10">
      <div class="flex items-center gap-3 mb-4">
        <div class="text-2xl font-black text-slate-900">M</div>
        <p class="text-xs font-bold text-amber-600 uppercase tracking-widest">Mentiva</p>
        <div class="flex-1 h-0.5 bg-gradient-to-r from-amber-400 to-transparent ml-2"></div>
      </div>
      <h1 class="mentiva-headline-md mb-2">Trends</h1>
      <p class="mentiva-subtext mt-1">Mentiva wird jeden Tag präziser</p>
    </div>
  </div>
    <div class="p-6">

    <!-- Chart Container -->
    <div class="mentiva-card p-6 border-2 border-neutral-200">
      <!-- Chart Title -->
      <h2 class="mentiva-label mb-6">
        Vorhersage-Genauigkeit (7 Tage)
      </h2>

      <!-- Chart Grid -->
      <div class="relative h-72 mb-8">
        <!-- Grid lines -->
        <div
          v-for="i in 5"
          :key="`grid-${i}`"
          class="absolute left-0 right-0 border-t border-neutral-200"
          :style="{ top: `${(i / 5) * 100}%` }"
        />

        <!-- Y-axis labels -->
        <div class="absolute left-0 top-0 bottom-0 w-14 flex flex-col justify-between text-xs text-neutral-500 font-bold pointer-events-none">
          <span>100%</span>
          <span>80%</span>
          <span>60%</span>
          <span>40%</span>
          <span>20%</span>
          <span>0%</span>
        </div>

        <!-- Bars with interactivity -->
        <div class="ml-14 h-full flex items-end justify-around gap-3">
          <div
            v-for="(item, index) in state.weekTrend"
            :key="`bar-${index}`"
            class="flex-1 flex flex-col items-center cursor-pointer group"
            @click="selectDay(index)"
          >
            <!-- Bar with hover effect -->
            <div
              class="w-full rounded-t-3xl transition-all duration-300 shadow-md hover:shadow-xl group-hover:opacity-100"
              :class="[
                selectedDay === index
                  ? 'bg-gradient-to-t from-amber-600 to-amber-400 opacity-100 scale-y-105'
                  : 'bg-gradient-to-t from-amber-400 to-amber-300 opacity-75 hover:opacity-90'
              ]"
              :style="{ height: `${(item.accuracy / 100) * 100}%` }"
            />
            <!-- Value label -->
            <div class="text-xs font-bold text-amber-600 mt-3 text-center group-hover:text-amber-700">{{ item.accuracy }}%</div>
            <!-- Day label -->
            <div class="text-xs text-neutral-400 mt-1 font-medium">Tag {{ item.day }}</div>
          </div>
        </div>
      </div>

      <!-- Tooltip / Detail on click -->
      <Transition name="expand">
        <div
          v-if="selectedDay !== null && state.weekTrend[selectedDay]"
          class="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-sm font-bold text-amber-900">Tag {{ state.weekTrend[selectedDay].day }}</p>
              <p class="text-lg font-black text-amber-600 mt-1">{{ state.weekTrend[selectedDay].accuracy }}% Genauigkeit</p>
            </div>
            <button
              @click="selectedDay = null"
              class="text-amber-500 hover:text-amber-700 font-bold text-lg"
            >
              ✕
            </button>
          </div>
          <p class="text-xs text-amber-800 leading-relaxed">
            {{ state.weekTrend[selectedDay].note }}
          </p>
        </div>
      </Transition>

      <!-- Overall Info -->
      <div class="mt-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
        <p class="text-xs font-bold text-blue-900 mb-2">📈 Deine Fortschritte</p>
        <p class="text-xs text-blue-800 leading-relaxed">
          Von {{ state.weekTrend[0].accuracy }}% auf {{ state.weekTrend[state.weekTrend.length - 1].accuracy }}% in dieser Woche.
          Mit jedem Check-in lernt Mentiva deine persönliche Leistungskurve besser kennen.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMentivaDemo } from '../../composables/useMentivaDemo'

const { state } = useMentivaDemo()
const selectedDay = ref<number | null>(null)

function selectDay(index: number) {
  selectedDay.value = selectedDay.value === index ? null : index
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
}

.expand-enter-to {
  opacity: 1;
  max-height: 150px;
  margin-top: 1.5rem;
}

.scale-y-105 {
  transform: scaleY(1.05);
}
</style>
