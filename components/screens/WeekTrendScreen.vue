<template>
  <div class="h-full overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-24 text-slate-100">
    <header class="sticky top-0 z-20 border-b border-slate-800/60 bg-slate-950/85 p-5 backdrop-blur-md">
      <div class="mb-4 flex items-center gap-3">
        <div class="text-2xl font-black text-slate-100">M</div>
        <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Mentiva</p>
        <div class="ml-2 h-px flex-1 bg-gradient-to-r from-amber-500/60 to-transparent"></div>
      </div>

      <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Leistungsprognose</p>
      <h1 class="mt-2 text-2xl font-black leading-tight text-slate-100">Deine Leistungsprognose</h1>
      <p class="mt-2 text-sm leading-relaxed text-slate-400">
        Mentiva prognostiziert deine kognitive Leistungsfähigkeit von 06:00 bis 22:00 Uhr.
      </p>
      <p class="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-300">
        Zeit ist nicht die knappe Ressource. Kognitive Kapazität ist es.
      </p>
    </header>

    <main class="space-y-5 p-5">
      <section class="rounded-2xl border border-amber-400/25 bg-slate-900/60 p-5 shadow-lg shadow-slate-950/30 backdrop-blur-md">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Heute</p>
            <h2 class="mt-2 text-2xl font-black text-slate-100">{{ forecastSummary.status }}</h2>
          </div>
          <div class="rounded-2xl border border-slate-800/60 bg-slate-950/50 px-3 py-2 text-right">
            <p class="text-[10px] font-bold uppercase text-slate-500">Prognose-Sicherheit</p>
            <p class="text-xl font-black text-amber-400">{{ forecastSummary.confidence }}%</p>
          </div>
        </div>

        <p class="mt-4 text-sm leading-relaxed text-slate-300">
          Dein stärkstes kognitives Fenster liegt heute zwischen {{ forecastSummary.peakWindow }}. Mentiva erwartet eine starke Vormittagsleistung, aber eine frühere Ermüdung am Nachmittag.
        </p>

        <div class="mt-5 grid gap-2">
          <div
            v-for="item in forecastWindows"
            :key="item.label"
            class="flex items-center justify-between gap-3 rounded-xl border border-slate-800/60 bg-slate-950/40 px-3 py-3"
          >
            <span class="text-xs font-bold text-slate-400">{{ item.label }}</span>
            <span class="text-sm font-black text-slate-100">{{ item.value }}</span>
          </div>
        </div>

        <div class="mt-5 space-y-3 border-t border-slate-800/60 pt-4">
          <p class="text-xs leading-relaxed text-slate-500">{{ forecastSummary.confidenceReason }}</p>
          <p class="text-sm leading-relaxed text-slate-300">{{ forecastSummary.mainInterpretation }}</p>
          <p class="rounded-xl bg-amber-400/10 px-3 py-3 text-sm font-bold leading-relaxed text-amber-300">
            {{ forecastSummary.coreMessage }}
          </p>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
        <div class="mb-4">
          <h2 class="text-lg font-black text-slate-100">Tagesleistungskurve</h2>
          <p class="mt-1 text-sm text-slate-400">Vorhergesagte mentale Leistungsfähigkeit von 06:00 bis 22:00 Uhr.</p>
        </div>

        <div class="rounded-2xl border border-slate-800/60 bg-slate-950/50 p-3">
          <svg viewBox="0 0 320 210" class="h-56 w-full overflow-visible" role="img" aria-label="Tagesleistungskurve">
            <defs>
              <linearGradient id="readinessStroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stop-color="#64748b" />
                <stop offset="48%" stop-color="#f59e0b" />
                <stop offset="100%" stop-color="#64748b" />
              </linearGradient>
              <linearGradient id="readinessFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.26" />
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
              </linearGradient>
            </defs>

            <g class="text-slate-700">
              <line
                v-for="level in gridLevels"
                :key="level"
                x1="28"
                x2="304"
                :y1="getY(level)"
                :y2="getY(level)"
                stroke="currentColor"
                stroke-width="1"
                stroke-dasharray="3 6"
              />
            </g>

            <path :d="readinessAreaPath" fill="url(#readinessFill)" />
            <path :d="readinessPath" fill="none" stroke="url(#readinessStroke)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />

            <g>
              <circle
                v-for="point in importantPoints"
                :key="point.time"
                :cx="getX(point.index)"
                :cy="getY(point.readiness)"
                r="5"
                class="fill-amber-400 stroke-slate-950"
                stroke-width="3"
              />
            </g>

            <g class="fill-slate-500 text-[9px] font-bold">
              <text x="25" :y="getY(100) + 3" text-anchor="end">100</text>
              <text x="25" :y="getY(50) + 3" text-anchor="end">50</text>
              <text x="25" :y="getY(0) + 3" text-anchor="end">0</text>
              <text x="28" y="198">06:00</text>
              <text x="159" y="198" text-anchor="middle">14:00</text>
              <text x="304" y="198" text-anchor="end">22:00</text>
            </g>

            <g class="fill-amber-300 text-[9px] font-black">
              <text :x="getX(4)" :y="getY(91) - 14" text-anchor="middle">Peak-Fokus</text>
              <text :x="getX(7)" :y="getY(59) + 22" text-anchor="middle">Mittagstief</text>
              <text :x="getX(9)" :y="getY(74) - 12" text-anchor="middle">Zweites Fenster</text>
              <text :x="getX(13)" :y="getY(41) + 22" text-anchor="middle">Regeneration</text>
            </g>
          </svg>

          <div class="mt-3 grid grid-cols-3 gap-2">
            <div class="rounded-xl bg-slate-900/70 px-3 py-2">
              <p class="text-[10px] font-bold uppercase text-slate-500">Spitze</p>
              <p class="text-sm font-black text-amber-400">{{ peakReadinessPoint.time }} · {{ peakReadinessPoint.readiness }}%</p>
            </div>
            <div class="rounded-xl bg-slate-900/70 px-3 py-2">
              <p class="text-[10px] font-bold uppercase text-slate-500">Durchschnitt</p>
              <p class="text-sm font-black text-slate-100">{{ formatPercent(averageReadiness) }}</p>
            </div>
            <div class="rounded-xl bg-slate-900/70 px-3 py-2">
              <p class="text-[10px] font-bold uppercase text-slate-500">Tiefpunkt</p>
              <p class="text-sm font-black text-slate-100">{{ lowestReadinessPoint.time }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
        <h2 class="text-lg font-black text-slate-100">Leistungszonen</h2>
        <div class="mt-4 space-y-3">
          <article
            v-for="zone in performanceZones"
            :key="zone.title"
            class="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-sm font-black text-slate-100">{{ zone.title }}</h3>
              <span class="shrink-0 rounded-full bg-amber-400/10 px-2 py-1 text-[11px] font-bold text-amber-300">{{ zone.time }}</span>
            </div>
            <p class="mt-2 text-xs leading-relaxed text-slate-400">{{ zone.meaning }}</p>
          </article>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
        <h2 class="text-lg font-black text-slate-100">Kognitive Kapazität heute</h2>
        <p class="mt-1 text-sm text-slate-400">Mentiva schätzt nicht nur freie Zeit, sondern verfügbare mentale Tiefe.</p>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <article
            v-for="item in cognitiveCapacity"
            :key="item.label"
            class="rounded-xl border border-slate-800/60 bg-slate-950/40 p-3"
          >
            <p class="text-[11px] font-bold uppercase text-slate-500">{{ item.label }}</p>
            <p class="mt-2 text-lg font-black text-amber-400">{{ item.value }}</p>
            <p class="mt-2 text-xs leading-relaxed text-slate-400">{{ item.description }}</p>
          </article>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
        <h2 class="text-lg font-black text-slate-100">Einfluss auf deine Tageskurve</h2>
        <p class="mt-1 text-sm text-slate-400">Mentiva zeigt nicht nur Signale, sondern wie sie die heutige Leistungskurve verändern.</p>

        <div class="mt-4 space-y-3">
          <article
            v-for="influence in curveInfluences"
            :key="influence.title"
            class="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4"
          >
            <p class="text-sm font-black text-slate-100">{{ influence.title }}</p>
            <p class="mt-2 text-xs leading-relaxed text-slate-400">{{ influence.effect }}</p>
            <p class="mt-3 inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-[11px] font-bold text-amber-300">
              {{ influence.impact }}
            </p>
          </article>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
        <h2 class="text-lg font-black text-slate-100">Empfohlene Tagesstrategie</h2>
        <p class="mt-1 text-sm text-slate-400">Allgemeine Strategie basierend auf deiner prognostizierten kognitiven Kapazität.</p>

        <div class="mt-4 space-y-3">
          <article
            v-for="strategy in dailyStrategy"
            :key="strategy.title"
            class="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4"
          >
            <p class="text-sm font-black text-slate-100">{{ strategy.title }}</p>
            <p class="mt-2 text-xs leading-relaxed text-slate-400">{{ strategy.text }}</p>
          </article>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
        <div class="mb-4">
          <h2 class="text-lg font-black text-slate-100">Wochenausblick</h2>
          <p class="mt-1 text-sm text-slate-400">Grobe Projektion deiner kognitiven Kapazität für die nächsten Tage.</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <article
            v-for="day in weeklyOutlook"
            :key="day.day"
            class="rounded-xl border border-slate-800/60 bg-slate-950/35 p-3"
            :class="day.day === highestWeeklyDay.day ? 'border-amber-400/40' : day.day === lowestWeeklyDay.day ? 'border-slate-700' : ''"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="text-lg font-black text-slate-100">{{ day.day }}</p>
              <p class="text-sm font-black text-amber-400">{{ day.readiness }}%</p>
            </div>
            <p class="mt-2 text-xs font-bold text-slate-300">{{ day.status }}</p>
            <p class="mt-1 text-xs leading-relaxed text-slate-500">{{ day.note }}</p>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type CurvePoint = {
  time: string
  readiness: number
  label: string
  zone: string
  interpretation: string
}

// Mock forecast data. Replace with model output when backend forecasting exists.
const readinessCurve: CurvePoint[] = [
  { time: '06:00', readiness: 42, label: 'Anlaufphase', zone: 'Regeneration', interpretation: 'Der Tag startet mit niedriger kognitiver Aktivierung.' },
  { time: '07:00', readiness: 54, label: 'Aktivierung', zone: 'Leichte Orientierung', interpretation: 'Mentale Energie steigt, aber komplexe Denkarbeit ist noch nicht optimal.' },
  { time: '08:00', readiness: 68, label: 'Fokus steigt', zone: 'Solide Ausführung', interpretation: 'Gute Phase für strukturierte Arbeit und Vorbereitung.' },
  { time: '09:00', readiness: 82, label: 'Peak-Fokus', zone: 'Tiefe Denkarbeit', interpretation: 'Starke Analysefähigkeit und hohe mentale Stabilität.' },
  { time: '10:00', readiness: 91, label: 'Höchstleistung', zone: 'Tiefe Denkarbeit', interpretation: 'Voraussichtlich stärkster kognitiver Punkt des Tages.' },
  { time: '11:00', readiness: 87, label: 'Hoher Fokus', zone: 'Tiefe Denkarbeit', interpretation: 'Weiterhin sehr gutes Fenster für komplexes Denken.' },
  { time: '12:00', readiness: 73, label: 'Leistungsabfall', zone: 'Solide Ausführung', interpretation: 'Die mentale Tiefe nimmt langsam ab, Ausführung bleibt stabil.' },
  { time: '13:00', readiness: 59, label: 'Mittagstief', zone: 'Routinefähigkeit', interpretation: 'Reduzierte kognitive Tiefe, aber brauchbar für einfache Aufgaben.' },
  { time: '14:00', readiness: 66, label: 'Erholung', zone: 'Solide Ausführung', interpretation: 'Leichte Stabilisierung nach dem Mittagstief.' },
  { time: '15:00', readiness: 74, label: 'Zweites Leistungsfenster', zone: 'Fokussierte Ausführung', interpretation: 'Kurzes zweites Fenster für mittelkomplexe Arbeit.' },
  { time: '16:00', readiness: 65, label: 'Solide Ausführung', zone: 'Routinefähigkeit', interpretation: 'Ausführung bleibt möglich, aber die mentale Tiefe sinkt.' },
  { time: '17:00', readiness: 54, label: 'Ermüdung', zone: 'Routinefähigkeit', interpretation: 'Ermüdung nimmt zu, neue komplexe Arbeit wird weniger effizient.' },
  { time: '18:00', readiness: 46, label: 'Niedrige Leistung', zone: 'Regeneration', interpretation: 'Mentale Belastbarkeit ist deutlich reduziert.' },
  { time: '19:00', readiness: 41, label: 'Regeneration', zone: 'Erholung', interpretation: 'Erholung ist voraussichtlich wertvoller als zusätzliche Arbeitszeit.' },
  { time: '20:00', readiness: 38, label: 'Erholung', zone: 'Erholung', interpretation: 'Niedrige kognitive Kapazität, gute Phase zum Abschalten.' },
  { time: '21:00', readiness: 34, label: 'Abschalten', zone: 'Schlafvorbereitung', interpretation: 'Mentiva erwartet sinkende Aktivierung.' },
  { time: '22:00', readiness: 28, label: 'Schlafvorbereitung', zone: 'Schlafvorbereitung', interpretation: 'Der Tag sollte kognitiv abgeschlossen werden.' }
]

const forecastSummary = {
  status: 'Moderate Belastung',
  peakWindow: '09:20-11:45',
  secondaryWindow: '14:30-15:40',
  lowReadinessWindow: '17:30-22:00',
  confidence: 82,
  confidenceReason: 'Basierend auf 14 Tagen Signalverlauf und heutigem Check-in.',
  mainInterpretation: 'Dein stärkstes kognitives Fenster liegt heute am Vormittag. Die Erholungssignale deuten auf gute Spitzenleistung, aber begrenzte Ausdauer über den Tag hin.',
  coreMessage: 'Zeit ist heute nicht der Engpass. Die knappe Ressource ist stabile kognitive Kapazität.'
}

const curveInfluences = [
  { title: 'Peak-Fokus bleibt stark, aber kürzer', effect: 'Das Vormittagsfenster erreicht hohe Werte, fällt aber früher ab als an erholten Tagen.', impact: 'verkürztes Hochleistungsfenster' },
  { title: 'Ermüdung früher erwartet', effect: 'Die Kurve zeigt ab ca. 16:30 eine deutlich stärkere Abnahme der mentalen Belastbarkeit.', impact: 'früherer Leistungsabfall' },
  { title: 'Kontextwechsel-Toleranz reduziert', effect: 'Häufige Unterbrechungen würden heute überdurchschnittlich viel kognitive Kapazität kosten.', impact: 'höhere Kosten durch Unterbrechungen' },
  { title: 'Zweites Leistungsfenster begrenzt', effect: 'Am Nachmittag ist ein kurzer Rebound möglich, aber keine stabile Höchstleistungsphase.', impact: 'kurzer Rebound statt zweiter Peak' },
  { title: 'Erholungshebel hoch', effect: 'Kurze Pausen haben heute voraussichtlich mehr Wirkung als zusätzliche Arbeitszeit.', impact: 'Erholung wichtiger als mehr Stunden' }
]

const cognitiveCapacity = [
  { label: 'Deep-Work-Kapazität', value: '2h 25m', description: 'Zeitfenster mit hoher mentaler Tiefe und stabiler Aufmerksamkeit.' },
  { label: 'Entscheidungsqualität', value: 'hoch bis 12:00', description: 'Komplexe Abwägungen sind voraussichtlich im Vormittagsfenster am stärksten.' },
  { label: 'Kontextwechsel-Toleranz', value: 'niedrig', description: 'Unterbrechungen kosten heute mehr kognitive Energie als üblich.' },
  { label: 'Ermüdungsrisiko', value: 'erhöht ab 16:30', description: 'Die mentale Belastbarkeit nimmt am späten Nachmittag deutlich ab.' }
]

const dailyStrategy = [
  { title: 'Nutze das Vormittagsfenster bewusst', text: 'Die Kurve zeigt dort die höchste Analyse- und Entscheidungsfähigkeit.' },
  { title: 'Reduziere Kontextwechsel vor 12:00', text: 'Bei reduzierter Erholung kosten Unterbrechungen mehr kognitive Kapazität.' },
  { title: 'Plane nachmittags geringere mentale Tiefe ein', text: 'Die Prognose zeigt ab ca. 16:30 eine zunehmende Ermüdung.' },
  { title: 'Stabilisiere die zweite Tageshälfte', text: 'Kurze Erholungsphasen können helfen, das zweite Leistungsfenster nutzbar zu halten.' }
]

const weeklyOutlook = [
  { day: 'Mo', readiness: 64, status: 'Moderate Belastung', note: 'Starker Vormittag, früher Leistungsabfall.' },
  { day: 'Di', readiness: 69, status: 'Stabilisierung', note: 'Erholung voraussichtlich leicht besser.' },
  { day: 'Mi', readiness: 76, status: 'Gutes Fokuspotenzial', note: 'Längeres Hochleistungsfenster möglich.' },
  { day: 'Do', readiness: 61, status: 'Belastung erhöht', note: 'Arbeitslast könnte Fokusfenster verkürzen.' },
  { day: 'Fr', readiness: 72, status: 'Stabil', note: 'Solide kognitive Kapazität erwartet.' },
  { day: 'Sa', readiness: 58, status: 'Regeneration', note: 'Niedrigere Leistungsanforderung sinnvoll.' },
  { day: 'So', readiness: 67, status: 'Erholung steigend', note: 'Basis für bessere nächste Woche.' }
]

const chart = {
  left: 28,
  right: 304,
  top: 18,
  bottom: 178
}
const gridLevels = [0, 25, 50, 75, 100]

const forecastWindows = computed(() => [
  { label: 'Peak-Fokus', value: forecastSummary.peakWindow },
  { label: 'Zweites Leistungsfenster', value: forecastSummary.secondaryWindow },
  { label: 'Niedrige Leistungsfähigkeit', value: forecastSummary.lowReadinessWindow }
])

const peakReadinessPoint = computed(() => readinessCurve.reduce((highest, point) => point.readiness > highest.readiness ? point : highest, readinessCurve[0]))
const lowestReadinessPoint = computed(() => readinessCurve.reduce((lowest, point) => point.readiness < lowest.readiness ? point : lowest, readinessCurve[0]))
const averageReadiness = computed(() => average(readinessCurve.map((point) => point.readiness)))
const peakFocusBlocks = computed(() => readinessCurve.filter((point) => point.readiness >= 80))
const lowReadinessBlocks = computed(() => readinessCurve.filter((point) => point.readiness < 50))
const deepWorkBlocks = computed(() => readinessCurve.filter((point) => point.readiness >= 75))
const routineBlocks = computed(() => readinessCurve.filter((point) => point.readiness >= 50 && point.readiness < 70))
const recoveryBlocks = computed(() => readinessCurve.filter((point) => point.readiness < 50))
const highestWeeklyDay = computed(() => weeklyOutlook.reduce((highest, day) => day.readiness > highest.readiness ? day : highest, weeklyOutlook[0]))
const lowestWeeklyDay = computed(() => weeklyOutlook.reduce((lowest, day) => day.readiness < lowest.readiness ? day : lowest, weeklyOutlook[0]))

const readinessPath = computed(() => readinessCurve
  .map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.readiness)}`)
  .join(' ')
)

const readinessAreaPath = computed(() => {
  const firstX = getX(0)
  const lastX = getX(readinessCurve.length - 1)

  return `${readinessPath.value} L ${lastX} ${chart.bottom} L ${firstX} ${chart.bottom} Z`
})

const importantPoints = computed(() => [
  { ...peakReadinessPoint.value, index: readinessCurve.findIndex((point) => point.time === peakReadinessPoint.value.time) },
  { ...readinessCurve[7], index: 7 },
  { ...readinessCurve[9], index: 9 },
  { ...readinessCurve[13], index: 13 }
])

const performanceZones = computed(() => [
  {
    title: 'Peak-Fokus',
    time: forecastSummary.peakWindow,
    meaning: 'Höchste mentale Tiefe, starke Analysefähigkeit, gute Entscheidungsqualität.'
  },
  {
    title: 'Solide Ausführung',
    time: '08:00-09:00 und 14:00-16:00',
    meaning: 'Stabile Leistung für strukturierte und mittelkomplexe Arbeit.'
  },
  {
    title: 'Routinefähigkeit',
    time: '12:45-14:00 und 16:00-17:30',
    meaning: 'Reduzierte Tiefe, aber brauchbare Stabilität für einfache kognitive Arbeit.'
  },
  {
    title: 'Regeneration',
    time: 'ab 18:00',
    meaning: 'Geringe kognitive Belastbarkeit, Erholung wirkt voraussichtlich stärker als zusätzliche Arbeitszeit.'
  }
])

function getX(index: number) {
  const width = chart.right - chart.left
  return chart.left + (index / (readinessCurve.length - 1)) * width
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

function getReadinessLabel(value: number) {
  if (value >= 80) {
    return 'Peak-Fokus'
  }

  if (value >= 70) {
    return 'Fokussierte Ausführung'
  }

  if (value >= 50) {
    return 'Routinefähigkeit'
  }

  return 'Regeneration'
}
</script>
