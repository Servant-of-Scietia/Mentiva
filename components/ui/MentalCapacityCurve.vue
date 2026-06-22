<template>
  <div class="rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md p-6 shadow-lg">

    <!-- Header -->
    <div class="mb-4">
      <p class="text-xs font-bold text-amber-400 uppercase tracking-wide">
        🧠 Deine mentale Kapazität
      </p>
      <p class="text-sm text-slate-300 font-medium">
        Energieverlauf heute
      </p>
    </div>

    <!-- Chart -->
    <div class="relative h-32 mt-6 mb-4">

      <!-- Grid -->
      <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
        <div class="border-t border-slate-700/40"></div>
        <div class="border-t border-slate-700/25"></div>
        <div class="border-t border-slate-700/25"></div>
        <div class="border-t border-slate-700/40"></div>
      </div>

      <!-- Y axis -->
      <div class="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 font-semibold -ml-8 w-6 text-right pr-1">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
      </div>

      <!-- SVG -->
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">

        <defs>
          <linearGradient id="capacityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0.05" />
          </linearGradient>
        </defs>

        <path :d="pathData" fill="url(#capacityGradient)" />

        <polyline
          :points="linePoints"
          fill="none"
          stroke="#fbbf24"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <circle
          v-for="(point, idx) in dataPoints"
          :key="idx"
          :cx="point.x"
          :cy="point.y"
          r="2"
          fill="#fbbf24"
          opacity="0.9"
        />
      </svg>
    </div>

    <!-- X axis -->
    <div class="flex justify-between text-xs text-slate-500 font-semibold mt-2">
      <span>08:00</span>
      <span>11:00</span>
      <span>14:00</span>
      <span>17:00</span>
      <span>18:00</span>
    </div>

    <!-- Legend -->
    <div class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/60">

      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-amber-400"></div>
        <p class="text-xs text-slate-400">Hoch: 09–12h, 15–16h</p>
      </div>

      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-slate-500"></div>
        <p class="text-xs text-slate-400">Mittel: morgens, abends</p>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Data points representing energy levels throughout the day (08:00 to 18:00)
// Values 0-100 representing mental capacity percentage
const energyData = [
  { time: '08:00', energy: 35 },
  { time: '09:00', energy: 60 },
  { time: '10:00', energy: 80 },
  { time: '11:00', energy: 90 },
  { time: '12:00', energy: 85 },
  { time: '12:10', energy: 82 },
  { time: '13:00', energy: 55 }, // post-lunch dip
  { time: '14:00', energy: 65 },
  { time: '15:00', energy: 75 },
  { time: '16:00', energy: 70 },
  { time: '17:00', energy: 50 },
  { time: '18:00', energy: 40 }
]

// Calculate SVG path points
const dataPoints = computed(() => {
  const points: { x: number; y: number }[] = []
  const width = 300
  const height = 120
  
  energyData.forEach((point, idx) => {
    const x = (idx / (energyData.length - 1)) * width
    const y = height - (point.energy / 100) * height
    points.push({ x, y })
  })
  
  return points
})

// Line points for polyline
const linePoints = computed(() => {
  return dataPoints.value.map(p => `${p.x},${p.y}`).join(' ')
})

// Path data for fill area (includes baseline)
const pathData = computed(() => {
  const points: { x: number; y: number }[] = dataPoints.value
  const width = 300
  const height = 120
  
  if (points.length === 0) return ''
  
  let path = `M ${points[0].x} ${points[0].y}`
  
  // Add smooth curve through points using quadratic Bezier
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cp = {
      x: (prev.x + curr.x) / 2,
      y: (prev.y + curr.y) / 2
    }
    path += ` Q ${cp.x} ${cp.y} ${curr.x} ${curr.y}`
  }
  
  // Close the path
  path += ` L ${points[points.length - 1].x} ${height}`
  path += ` L ${points[0].x} ${height}`
  path += ' Z'
  
  return path
})
</script>
