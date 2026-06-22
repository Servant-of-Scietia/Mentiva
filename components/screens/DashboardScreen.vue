<template>
  <div class="h-full overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-24 text-slate-100">
    <Transition name="slide-down">
      <div
        v-if="state.showOnboarding"
        class="flex justify-between border-b border-slate-800/60 bg-slate-900/60 p-4 pt-7 backdrop-blur-md"
      >
        <p class="text-xs font-semibold text-amber-400">Willkommen zum Mentiva Mockup</p>
        <button class="text-slate-400" @click="hideOnboarding">x</button>
      </div>
    </Transition>

    <header class="sticky top-0 z-20 border-b border-slate-800/60 bg-slate-950/85 p-5 backdrop-blur-md">
      <div class="mb-4 flex items-center gap-3">
        <div class="text-2xl font-black text-slate-100">M</div>
        <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Mentiva</p>
        <div class="ml-2 h-px flex-1 bg-gradient-to-r from-amber-500/60 to-transparent"></div>
      </div>

      <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Heute</p>
      <h1 class="mt-2 text-2xl font-black leading-tight text-slate-100">Dein Tag</h1>
      <p class="mt-2 text-sm leading-relaxed text-slate-400">
        Mentiva zeigt dir, wann deine kognitive Kapazität heute am wertvollsten ist.
      </p>
      <p class="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-300">
        Zeit ist nicht die knappe Ressource. Kognitive Kapazität ist es.
      </p>
    </header>

    <main class="space-y-5 p-5">
      <section class="rounded-2xl border border-amber-400/25 bg-slate-900/60 p-5 shadow-lg shadow-slate-950/30 backdrop-blur-md">
        <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Tagesstatus</p>
        <h2 class="mt-2 text-2xl font-black text-slate-100">{{ statusLine }}</h2>
        <p class="mt-4 text-sm leading-relaxed text-slate-300">{{ todayOverview.summary }}</p>

        <div class="mt-5 grid grid-cols-2 gap-2">
          <div
            v-for="metric in heroMetrics"
            :key="metric.label"
            class="rounded-xl border border-slate-800/60 bg-slate-950/45 px-3 py-3"
          >
            <p class="text-[10px] font-bold uppercase text-slate-500">{{ metric.label }}</p>
            <p class="mt-1 text-sm font-black text-slate-100">{{ metric.value }}</p>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
        <div class="mb-3">
          <h2 class="text-lg font-black text-slate-100">Tagesleistung</h2>
          <p class="mt-1 text-sm text-slate-400">Kompakte Vorschau deiner kognitiven Leistungsfähigkeit.</p>
        </div>

        <div class="rounded-2xl border border-slate-800/60 bg-slate-950/50 p-3">
          <svg viewBox="0 0 320 150" class="h-40 w-full overflow-visible" role="img" aria-label="Mini Tagesleistungskurve">
            <defs>
              <linearGradient id="miniReadinessStroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stop-color="#64748b" />
                <stop offset="52%" stop-color="#f59e0b" />
                <stop offset="100%" stop-color="#64748b" />
              </linearGradient>
              <linearGradient id="miniReadinessFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.24" />
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
              </linearGradient>
            </defs>

            <g class="text-slate-800">
              <line
                v-for="level in gridLevels"
                :key="level"
                x1="22"
                x2="304"
                :y1="getY(level)"
                :y2="getY(level)"
                stroke="currentColor"
                stroke-width="1"
                stroke-dasharray="3 7"
              />
            </g>

            <path :d="miniCurveAreaPath" fill="url(#miniReadinessFill)" />
            <path :d="miniCurvePath" fill="none" stroke="url(#miniReadinessStroke)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />

            <circle :cx="getX(peakIndex)" :cy="getY(peakReadinessPoint.readiness)" r="5" class="fill-amber-400 stroke-slate-950" stroke-width="3" />
            <circle :cx="getX(lowestIndex)" :cy="getY(lowestReadinessPoint.readiness)" r="4" class="fill-slate-500 stroke-slate-950" stroke-width="3" />

            <g class="fill-slate-500 text-[9px] font-bold">
              <text x="22" y="138">06:00</text>
              <text x="158" y="138" text-anchor="middle">13:00</text>
              <text x="304" y="138" text-anchor="end">22:00</text>
            </g>
          </svg>

          <div class="mt-3 grid grid-cols-3 gap-2">
            <div
              v-for="label in curveLabels"
              :key="label.title"
              class="rounded-xl bg-slate-900/70 px-2 py-2"
            >
              <p class="text-[10px] font-bold uppercase text-slate-500">{{ label.title }}</p>
              <p class="mt-1 text-xs font-black text-slate-100">{{ label.value }}</p>
            </div>
          </div>

          <p class="mt-3 text-center text-xs font-bold text-slate-500">
            Durchschnittliche Tagesleistung: {{ formatPercent(averageMiniReadiness) }}
          </p>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
        <h2 class="text-lg font-black text-slate-100">Mentivas Empfehlung</h2>
        <article class="mt-4 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4">
          <p class="text-base font-black text-amber-300">{{ mainRecommendation.title }}</p>
          <p class="mt-2 text-sm leading-relaxed text-slate-300">{{ mainRecommendation.text }}</p>
          <div class="mt-4 space-y-2">
            <p
              v-for="note in mainRecommendation.secondaryNotes"
              :key="note"
              class="rounded-xl border border-slate-800/60 bg-slate-950/40 px-3 py-2 text-xs font-bold text-slate-300"
            >
              {{ note }}
            </p>
          </div>
        </article>
      </section>

      <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
        <h2 class="text-lg font-black text-slate-100">Wichtigste Signale</h2>
        <div class="mt-4 space-y-3">
          <article
            v-for="signal in keySignals"
            :key="signal.title"
            class="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <p class="text-sm font-black text-slate-100">{{ signal.title }}</p>
              <span class="shrink-0 rounded-full bg-slate-800 px-2 py-1 text-[11px] font-bold text-amber-300">{{ signal.value }}</span>
            </div>
            <p class="mt-2 text-xs leading-relaxed text-slate-400">{{ signal.text }}</p>
          </article>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="text-lg font-black text-slate-100">Planungsstatus</h2>
            <p class="mt-1 text-sm text-slate-400">{{ planningStatusLabel }}</p>
          </div>
          <span class="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xl font-black text-amber-400">
            {{ planningStatus.count }}
          </span>
        </div>

        <div class="mt-4 space-y-2">
          <p
            v-for="item in planningStatus.items"
            :key="item"
            class="rounded-xl border border-slate-800/60 bg-slate-950/40 px-3 py-2 text-xs font-bold text-slate-300"
          >
            {{ item }}
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMentivaDemo } from '../../composables/useMentivaDemo'

const { state, hideOnboarding, forecastSummary, forecastCurve, planningStatus } = useMentivaDemo()

const miniCurveIndexes = [0, 2, 4, 6, 7, 9, 11, 12, 16]

const todayOverview = computed(() => ({
  status: forecastSummary.value.status,
  statusDetail: forecastSummary.value.peakWindow,
  peakFocus: forecastSummary.value.peakWindow,
  deepWorkCapacity: planningStatus.value.items.find((item) => item.startsWith('Fokus geplant'))?.replace('Fokus geplant: ', '') ?? 'offen',
  confidence: forecastSummary.value.confidence,
  fatigueRisk: forecastSummary.value.lowReadinessWindow,
  summary: forecastSummary.value.mainInterpretation
}))

const miniReadinessCurve = computed(() => miniCurveIndexes.map((index) => forecastCurve.value[index]))

const mainRecommendation = {
  title: 'Schütze dein Vormittagsfenster',
  text: 'Nutze die Phase höchster mentaler Tiefe für anspruchsvolle Denkarbeit und reduziere Kontextwechsel vor 12:00.',
  secondaryNotes: [
    'Routinefähigkeit steigt nach 13:00.',
    'Erholung wird ab 16:30 wichtiger als zusätzliche Arbeitszeit.'
  ]
}

const keySignals = [
  {
    title: 'Schlafdefizit',
    value: 'unter Normalwert',
    text: 'Schlaf lag diese Woche unter deinem persönlichen Normalwert.'
  },
  {
    title: 'Erholung reduziert',
    value: 'Trend sinkt',
    text: 'Der Erholungstrend deutet auf geringere Regeneration hin.'
  },
  {
    title: 'Belastung hoch',
    value: 'über Zielbereich',
    text: 'Die Arbeitslast bleibt über dem empfohlenen Bereich.'
  }
]

const chart = {
  left: 22,
  right: 304,
  top: 16,
  bottom: 118
}
const gridLevels = [25, 50, 75, 100]

const statusLine = computed(() => `${todayOverview.value.status} · ${todayOverview.value.statusDetail}`)
const peakReadinessPoint = computed(() => miniReadinessCurve.value.reduce((highest, point) => point.readiness > highest.readiness ? point : highest, miniReadinessCurve.value[0]))
const lowestReadinessPoint = computed(() => miniReadinessCurve.value.reduce((lowest, point) => point.readiness < lowest.readiness ? point : lowest, miniReadinessCurve.value[0]))
const averageMiniReadiness = computed(() => average(miniReadinessCurve.value.map((point) => point.readiness)))
const planningStatusLabel = computed(() => `${planningStatus.value.count} ${planningStatus.value.title}`)

const peakIndex = computed(() => miniReadinessCurve.value.findIndex((point) => point.time === peakReadinessPoint.value.time))
const lowestIndex = computed(() => miniReadinessCurve.value.findIndex((point) => point.time === lowestReadinessPoint.value.time))

const heroMetrics = computed(() => [
  { label: 'Peak-Fokus', value: todayOverview.value.peakFocus },
  { label: 'Deep-Work', value: todayOverview.value.deepWorkCapacity },
  { label: 'Sicherheit', value: `${todayOverview.value.confidence}%` },
  { label: 'Ermüdung', value: todayOverview.value.fatigueRisk }
])

const miniCurvePath = computed(() => miniReadinessCurve.value
  .map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.readiness)}`)
  .join(' ')
)

const miniCurveAreaPath = computed(() => {
  const firstX = getX(0)
  const lastX = getX(miniReadinessCurve.value.length - 1)

  return `${miniCurvePath.value} L ${lastX} ${chart.bottom} L ${firstX} ${chart.bottom} Z`
})

const curveLabels = computed(() => [
  { title: 'Peak', value: todayOverview.value.peakFocus },
  { title: 'Mittagstief', value: '13:00' },
  { title: 'Regeneration', value: todayOverview.value.fatigueRisk }
])

function getX(index: number) {
  const width = chart.right - chart.left

  return chart.left + (index / (miniReadinessCurve.value.length - 1)) * width
}

function getY(readiness: number) {
  const height = chart.bottom - chart.top

  return chart.bottom - (readiness / 100) * height
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return values.reduce((total, value) => total + value, 0) / values.length
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
