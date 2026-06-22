<template>
  <div class="mentiva-card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-6 shadow-lg">
    <div class="flex justify-between items-start mb-4">
      <div>
        <p class="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">🧠 Deine mentale Kapazität</p>
        <p class="text-sm text-purple-800 font-medium">Energieverlauf heute</p>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="relative h-32 mt-6 mb-4">
      <!-- Grid lines -->
      <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
        <div class="border-t border-purple-200/50"></div>
        <div class="border-t border-purple-200/30"></div>
        <div class="border-t border-purple-200/30"></div>
        <div class="border-t border-purple-200/50"></div>
      </div>

      <!-- Y-axis labels -->
      <div class="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-purple-500 font-semibold -ml-8 w-6 text-right pr-1">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
      </div>

      <!-- Chart SVG -->
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
        <!-- Gradient fill -->
        <defs>
          <linearGradient id="capacityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color: #a855f7; stop-opacity: 0.3" />
            <stop offset="100%" style="stop-color: #ec4899; stop-opacity: 0.05" />
          </linearGradient>
        </defs>

        <!-- Path area -->
        <path
          :d="pathData"
          fill="url(#capacityGradient)"
          stroke="none"
        />

        <!-- Line -->
        <polyline
          :points="linePoints"
          fill="none"
          stroke="#a855f7"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />

        <!-- Data points -->
        <circle
          v-for="(point, idx) in dataPoints"
          :key="`point-${idx}`"
          :cx="point.x"
          :cy="point.y"
          r="1.5"
          fill="#d946ef"
          opacity="0.8"
        />
      </svg>
    </div>

    <!-- X-axis labels -->
    <div class="flex justify-between text-xs text-purple-500 font-semibold mt-2">
      <span>08:00</span>
      <span>11:00</span>
      <span>14:00</span>
      <span>17:00</span>
      <span>18:00</span>
    </div>

    <!-- Energy zones legend -->
    <div class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-purple-200">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-green-500"></div>
        <p class="text-xs text-purple-700">Hoch: 09-12h, 15-16h</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"></div>
        <p class="text-xs text-purple-700">Mittel: morgens, abends</p>
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
  const points = []
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
  const points = dataPoints.value
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
