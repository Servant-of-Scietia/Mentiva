<template>
  <div class="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center" 
       :class="{ 'opacity-0 pointer-events-none': !showSplash }"
       style="transition: opacity 0.6s ease-out 0.8s;">
    <div class="flex flex-col items-center justify-center gap-8">
      <!-- Logo -->
      <div class="animate-fade-in-scale">
        <div class="text-center">
          <h1 class="text-9xl font-black text-white tracking-tighter" style="line-height: 0.9; letter-spacing: -0.05em;">
            M
          </h1>
          <div class="h-1 bg-gradient-to-r from-amber-500 to-orange-500 mt-2" style="width: 60px; margin-left: auto; margin-right: auto;"></div>
        </div>
        
        <p class="text-6xl font-black text-white tracking-tight mt-6" style="letter-spacing: -0.02em;">
          Mentiva
        </p>
      </div>

      <!-- Loading indicator -->
      <div class="flex gap-2 mt-12">
        <div class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style="animation-delay: 0s;"></div>
        <div class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style="animation-delay: 0.2s;"></div>
        <div class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style="animation-delay: 0.4s;"></div>
      </div>

      <!-- Subtitle -->
      <p class="text-sm text-gray-400 mt-8 font-medium tracking-wider">
        Optimiere dein mentales Potenzial
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showSplash = ref(true)

onMounted(() => {
  // Show splash for 3 seconds total (1.5s animation + 1.5s display)
  setTimeout(() => {
    showSplash.value = false
  }, 2400)
})
</script>

<style scoped>
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-scale {
  animation: fadeInScale 0.8s ease-out forwards;
}
</style>
