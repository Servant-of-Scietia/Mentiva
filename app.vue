<template>
<div class="flex min-h-screen items-center justify-center">
    <!-- Outer phone bezel -->
    <div class="bg-black p-3 rounded-[48px] shadow-2xl" style="width: 414px; height: 870px">
      <!-- Inner screen -->
      <div
        class="w-full h-full rounded-[40px] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col relative"
        style="width: 390px; height: 844px"
      >
        <MentivaLogoSplash />

        <!-- Screen content with transition -->
        <div class="flex-1 relative overflow-hidden">
          <Transition name="fade" mode="out-in">
            <component :is="currentScreenComponent" :key="state.currentScreen" />
          </Transition>
        </div>

        <!-- Bottom Navigation -->
        <div class="relative h-20">
          <BottomNav />
        </div>
      </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMentivaDemo } from './composables/useMentivaDemo'
import DashboardScreen from './components/screens/DashboardScreen.vue'
import CheckinScreen from './components/screens/CheckinScreen.vue'
import WeekTrendScreen from './components/screens/WeekTrendScreen.vue'
import CalendarScreen from './components/screens/CalendarScreen.vue'
import HealthSignalsScreen from './components/screens/HealthSignalsScreen.vue'
import BottomNav from './components/ui/BottomNav.vue'
import MentivaLogoSplash from './components/MentivaLogoSplash.vue'

const { state } = useMentivaDemo()

const screenComponents = {
  dashboard: DashboardScreen,
  checkin: CheckinScreen,
  week: WeekTrendScreen,
  calendar: CalendarScreen,
  signals: HealthSignalsScreen
}

const currentScreenComponent = computed(() => screenComponents[state.currentScreen] ?? DashboardScreen)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
<style>
html,
body {
  background-color: #f3f4f6;
}
</style>
