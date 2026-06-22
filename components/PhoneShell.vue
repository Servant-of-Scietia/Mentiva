<template>
  <div class="flex items-center justify-center min-h-screen">
    <!-- Outer phone bezel -->
    <div class="bg-black p-3 rounded-[48px] shadow-2xl" style="width: 414px; height: 870px">
      <!-- Inner screen -->
      <div
        class="w-full h-full rounded-[40px] overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 flex flex-col relative"
        style="width: 390px; height: 844px"
      >
        <!-- Screen content with transition -->
        <div class="flex-1 relative overflow-hidden">
          <Transition name="fade" mode="out-in">
            <DashboardScreen v-if="state.currentScreen === 'dashboard'" key="dashboard" />
            <CheckinScreen v-else-if="state.currentScreen === 'checkin'" key="checkin" />
            <WeekTrendScreen v-else-if="state.currentScreen === 'week'" key="week" />
            <CalendarScreen v-else-if="state.currentScreen === 'calendar'" key="calendar" />
          </Transition>
        </div>

        <!-- Bottom Navigation (always visible except on checkin screen) -->
        <div
          v-if="state.currentScreen !== 'checkin'"
          class="relative h-20"
        >
          <BottomNav />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMentivaDemo } from '~/composables/useMentivaDemo'
import DashboardScreen from '~/components/screens/DashboardScreen.vue'
import CheckinScreen from '~/components/screens/CheckinScreen.vue'
import WeekTrendScreen from '~/components/screens/WeekTrendScreen.vue'
import CalendarScreen from '~/components/screens/CalendarScreen.vue'
import BottomNav from '~/components/ui/BottomNav.vue'

const { state } = useMentivaDemo()
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
