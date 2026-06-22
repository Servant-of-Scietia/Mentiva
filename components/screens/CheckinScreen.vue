<template>
  <div class="h-full flex flex-col bg-gradient-to-b from-neutral-50 to-neutral-100 p-6 justify-between relative">
    <!-- Header -->
    <div>
      <h1 class="mentiva-headline-lg mb-2">Check-in</h1>
      <p class="mentiva-subtext">Teile deine aktuelle Verfassung mit Mentiva</p>
    </div>

    <!-- Form -->
    <div class="space-y-10 flex-1 flex flex-col justify-center">
      <!-- Energy Level -->
      <div class="mentiva-card p-5 bg-gradient-to-br from-red-50 to-amber-50">
        <label class="block mentiva-label mb-4 flex justify-between">
          <span>Energie-Level</span>
          <span class="text-2xl font-black text-amber-600">{{ energy }}</span>
        </label>
        <input
          v-model.number="energy"
          type="range"
          min="1"
          max="10"
          class="w-full h-4 bg-gradient-to-r from-red-300 to-amber-400 rounded-full appearance-none cursor-pointer transition-all duration-200"
          style="
            -webkit-appearance: none;
          "
        />
        <div class="flex justify-between text-xs text-neutral-500 mt-3 font-medium">
          <span>Müde</span>
          <span>Energiegeladen</span>
        </div>
      </div>

      <!-- Sleep Quality -->
      <div class="mentiva-card p-5 bg-gradient-to-br from-blue-50 to-cyan-50">
        <label class="block mentiva-label mb-4 flex justify-between">
          <span>Schlafqualität</span>
          <span class="text-2xl font-black text-blue-600">{{ sleep }}</span>
        </label>
        <input
          v-model.number="sleep"
          type="range"
          min="1"
          max="10"
          class="w-full h-4 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-full appearance-none cursor-pointer transition-all duration-200"
          style="
            -webkit-appearance: none;
          "
        />
        <div class="flex justify-between text-xs text-neutral-500 mt-3 font-medium">
          <span>Schlecht</span>
          <span>Ausgezeichnet</span>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <button
      @click="handleSubmit"
      class="mentiva-button-primary w-full py-4 text-lg font-bold hover:scale-[1.02] active:scale-[0.98]"
    >
      Speichern & Analysieren
    </button>

    <!-- Success Toast -->
    <Transition name="toast">
      <div
        v-if="showSuccessMessage"
        class="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold text-sm animate-pulse"
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

const handleSubmit = () => {
  addCheckin(energy.value, sleep.value)
  // Wait for toast animation, then navigate
  setTimeout(() => {
    // Reset form
    energy.value = 7
    sleep.value = 7
    // Navigate back
    goTo('dashboard')
  }, 2100)
}
</script>

<style scoped>
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 3px solid currentColor;
  transition: all 0.2s;
}

input[type='range']::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

input[type='range']::-moz-range-thumb {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 3px solid currentColor;
  transition: all 0.2s;
}

input[type='range']::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px) scale(0.9);
}

.toast-enter-to {
  opacity: 1;
  transform: translate(-50%, 0) scale(1);
}
</style>
