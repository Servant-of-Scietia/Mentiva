<template>
  <div class="h-full overflow-y-auto pb-24 bg-slate-950 text-slate-100">

    <!-- Header -->
    <div class="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md p-6 border-b border-slate-800/60">

      <div class="flex items-center gap-3 mb-4">
        <div class="text-2xl font-black text-slate-100">M</div>
        <p class="text-xs font-bold text-amber-400 uppercase tracking-widest">Mentiva</p>
        <div class="flex-1 h-px bg-gradient-to-r from-amber-500/60 to-transparent ml-2"></div>
      </div>

      <h1 class="text-2xl font-black text-slate-100 mb-1">Trends</h1>
      <p class="text-sm text-slate-400">Mentiva wird jeden Tag präziser</p>

    </div>

    <!-- Content -->
    <div class="p-6">

      <!-- Chart Card -->
      <div class="rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md p-6 shadow-lg">

        <h2 class="text-sm font-bold text-slate-300 mb-6">
          Vorhersage-Genauigkeit (7 Tage)
        </h2>

        <!-- Chart -->
        <div class="relative h-72 mb-8">

          <!-- Grid -->
          <div
            v-for="i in 6"
            :key="i"
            class="absolute left-0 right-0 border-t border-slate-800/40"
            :style="{ top: `${(i - 1) * 20}%` }"
          />

          <!-- Y axis -->
          <div class="absolute left-0 top-0 bottom-0 w-14 flex flex-col justify-between text-xs text-slate-500 font-bold pointer-events-none">
            <span>100%</span>
            <span>80%</span>
            <span>60%</span>
            <span>40%</span>
            <span>20%</span>
            <span>0%</span>
          </div>

          <!-- Bars -->
          <div class="ml-14 h-full flex items-end justify-around gap-3">

            <div
  v-for="(item, index) in state.weekTrend"
  :key="index"
  class="flex-1 h-full flex flex-col justify-end items-center cursor-pointer group"
>

              <div
                class="w-full rounded-t-2xl transition-all duration-300 border-l-2 border-amber-400/40 shadow-md"
                :class="selectedDay === index
                  ? 'bg-amber-400/30'
                  : 'bg-amber-400/10 group-hover:bg-amber-400/20'"
                :style="{ height: `${item.accuracy}%` }"
              />

              <div class="text-xs font-bold text-amber-400 mt-3">
                {{ item.accuracy }}%
              </div>

              <div class="text-xs text-slate-500 mt-1">
                Tag {{ item.day }}
              </div>

            </div>

          </div>
        </div>

        <!-- Detail -->
        <Transition name="expand">
          <div
            v-if="selectedDay !== null && state.weekTrend[selectedDay]"
            class="mt-6 p-4 rounded-xl border border-slate-800/60 bg-slate-900/60"
          >
            <div class="flex justify-between items-start mb-2">

              <div>
                <p class="text-sm font-bold text-slate-200">
                  Tag {{ state.weekTrend[selectedDay].day }}
                </p>
                <p class="text-lg font-black text-amber-400">
                  {{ state.weekTrend[selectedDay].accuracy }}%
                </p>
              </div>

              <button
                @click="selectedDay = null"
                class="text-slate-400 hover:text-amber-400 font-bold"
              >
                ✕
              </button>

            </div>

            <p class="text-xs text-slate-400">
              {{ state.weekTrend[selectedDay].note }}
            </p>
          </div>
        </Transition>

        <!-- Footer info -->
        <div class="mt-6 pt-4 border-t border-slate-800/60">
          <p class="text-xs text-slate-400">
            Fortschritt: {{ state.weekTrend[0].accuracy }}% → {{ state.weekTrend[state.weekTrend.length - 1].accuracy }}%
          </p>
        </div>

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
  transition: all 0.25s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(6px);
  max-height: 0;
}
</style>