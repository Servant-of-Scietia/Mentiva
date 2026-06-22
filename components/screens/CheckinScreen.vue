<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6 pb-10">

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-black mb-2">Check-in</h1>
      <p class="text-sm text-slate-400">Teile deine aktuelle Verfassung mit Mentiva</p>
    </div>

    <!-- Center content -->
    <div class="flex-1 flex flex-col space-y-10 py-10">

      <!-- Energy -->
      <div class="p-5 rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md">
        <div class="flex justify-between mb-4">
          <span class="text-sm font-semibold">Energie-Level</span>
          <span class="text-2xl font-black text-amber-400">{{ energy }}</span>
        </div>

        <input
          v-model.number="energy"
          type="range"
          min="1"
          max="10"
          class="w-full h-3 rounded-full appearance-none cursor-pointer energy-slider"
        />

        <div class="flex justify-between text-xs text-slate-500 mt-3">
          <span>Müde</span>
          <span>Energiegeladen</span>
        </div>
      </div>

      <!-- Sleep -->
      <div class="p-5 rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md">
        <div class="flex justify-between mb-4">
          <span class="text-sm font-semibold">Schlafqualität</span>
          <span class="text-2xl font-black text-amber-400">{{ sleep }}</span>
        </div>

        <input
          v-model.number="sleep"
          type="range"
          min="1"
          max="10"
          class="w-full h-3 rounded-full appearance-none cursor-pointer sleep-slider"
        />

        <div class="flex justify-between text-xs text-slate-500 mt-3">
          <span>Schlecht</span>
          <span>Ausgezeichnet</span>
        </div>
      </div>

    </div>

    <div class="mt-auto pt-6">
      <button
        @click="handleSubmit"
        class="w-full py-4 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition active:scale-[0.98]"
      >
        Speichern & Analysieren
      </button>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="showSuccessMessage"
        class="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-slate-800/90 border border-slate-700 text-slate-100 text-sm shadow-lg backdrop-blur-md"
      >
        {{ lastSuccessMessage }}
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMentivaDemo } from '../../composables/useMentivaDemo'

const { addCheckin, goTo, lastSuccessMessage, showSuccessMessage } = useMentivaDemo()

const energy = ref(7)
const sleep = ref(7)

function handleSubmit() {
  addCheckin(energy.value, sleep.value)

  setTimeout(() => {
    energy.value = 7
    sleep.value = 7
    goTo('dashboard')
  }, 2000)
}
</script>

<style scoped>
/* Energy slider */
.energy-slider {
  background: linear-gradient(to right, #f59e0b, #fb7185);
}

.energy-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background: #f59e0b;
  border: 3px solid #0f172a;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.4);
}

/* Sleep slider */
.sleep-slider {
  background: linear-gradient(to right, #60a5fa, #22d3ee);
}

.sleep-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background: #22d3ee;
  border: 3px solid #0f172a;
  box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.4);
}

/* Toast animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px) scale(0.95);
}
</style>