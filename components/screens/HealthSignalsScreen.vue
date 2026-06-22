<template>
  <div class="h-full overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-24 text-slate-100">
    <div class="px-5 py-5">
      <header class="mb-5">
        <div class="mb-4 flex items-center gap-3">
          <div class="text-2xl font-black text-slate-100">M</div>
          <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Mentiva</p>
          <div class="ml-2 h-px flex-1 bg-gradient-to-r from-amber-500/60 to-transparent"></div>
        </div>

        <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Datenbasis</p>
        <h1 class="mt-2 text-2xl font-black leading-tight text-slate-100">Datenbasis</h1>
        <p class="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          Wearable- und Smartphone-Daten, die Mentiva für deine kognitive Einschätzung nutzt.
        </p>
      </header>

      <section class="mb-5 rounded-2xl border border-amber-400/20 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/30 backdrop-blur-md">
        <div class="space-y-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Tageszustand</p>
            <h2 class="mt-2 text-2xl font-black text-slate-100">Heutige Einschätzung: {{ readinessProjection.status }}</h2>
            <p class="mt-3 text-sm leading-relaxed text-slate-400">{{ readinessProjection.explanation }}</p>
          </div>

          <div class="rounded-2xl border border-slate-800/60 bg-slate-950/50 p-4">
            <p class="text-xs font-bold uppercase tracking-widest text-slate-500">Empfehlung</p>
            <p class="mt-2 text-sm font-semibold leading-relaxed text-slate-200">{{ readinessProjection.recommendation }}</p>
          </div>

          <div class="grid grid-cols-[1fr_auto] gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
            <div class="min-w-0">
              <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Check-in Zustand</p>
              <p class="mt-2 text-sm font-semibold leading-relaxed text-amber-100">{{ checkinInsight }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-black leading-none text-amber-300">{{ latestCheckinScore }}</p>
              <p class="mt-1 text-[10px] font-bold uppercase text-amber-400/80">von 10</p>
            </div>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-2">
          <div
            v-for="badge in trendBadges"
            :key="badge.label"
            class="rounded-xl border border-slate-800/60 bg-slate-950/40 px-3 py-2"
          >
            <p class="text-[11px] font-bold uppercase text-slate-500">{{ badge.label }}</p>
            <p class="mt-1 text-sm font-black" :class="badge.className">{{ badge.value }}</p>
          </div>
        </div>
      </section>

      <section class="mb-5 grid grid-cols-2 gap-3">
        <article
          v-for="metric in metricCards"
          :key="metric.label"
          class="flex min-h-[150px] min-w-0 flex-col rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md"
        >
          <div class="min-w-0">
            <p class="truncate text-[10px] font-bold uppercase tracking-wider text-slate-500">{{ metric.label }}</p>
            <p class="mt-2 break-words text-2xl font-black leading-none text-slate-100">{{ metric.value }}</p>
          </div>
          <p class="mt-3 line-clamp-2 break-words text-xs leading-relaxed text-slate-400">{{ metric.detail }}</p>
          <span
            class="mt-auto inline-flex max-w-full self-start truncate rounded-lg px-2 py-1 text-[10px] font-bold leading-none"
            :class="metric.badgeClass"
          >
            {{ metric.source }}
          </span>
        </article>
      </section>

      <section
        v-if="warnings.length > 0"
        class="mb-5 rounded-2xl border border-amber-400/20 bg-slate-900/50 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-md"
      >
        <div class="mb-4">
          <h2 class="text-lg font-black text-slate-100">Erkannte Langzeitmuster</h2>
          <p class="mt-1 text-sm text-slate-400">Mentiva betrachtet mehrtägige Muster, nicht einzelne Tagesausschläge.</p>
        </div>

        <div class="space-y-3">
          <article
            v-for="warning in warnings"
            :key="warning.title"
            class="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4"
          >
            <p class="text-sm font-black text-amber-300">{{ warning.title }}</p>
            <p class="mt-2 text-sm leading-relaxed text-slate-400">{{ warning.copy }}</p>
          </article>
        </div>
      </section>

      <section class="mb-5 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
        <h2 class="text-lg font-black text-slate-100">Trendübersicht</h2>
        <p class="mt-1 text-sm text-slate-400">Letzte 7 Tage im Vergleich zu den 7 Tagen davor.</p>

        <div class="mt-4 divide-y divide-slate-800/60 overflow-hidden rounded-xl border border-slate-800/60">
          <div
            v-for="row in trendRows"
            :key="row.label"
            class="grid grid-cols-[1fr_auto] gap-2 bg-slate-950/35 px-3 py-3 text-sm"
          >
            <span class="font-bold text-slate-200">{{ row.label }}</span>
            <span class="text-right font-black" :class="row.changeClass">{{ row.current }}</span>
            <span class="col-span-2 text-xs text-slate-500">Vorherige 7 Tage: {{ row.previous }}</span>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-md">
        <h2 class="text-lg font-black text-slate-100">Datenquellen</h2>
        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="source in todayHealth.dataSources"
            :key="source"
            class="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-300"
          >
            {{ source }}
          </span>
        </div>
        <p class="mt-4 text-sm leading-relaxed text-slate-400">
          Demo-Daten für den Prototyp. Echte Integrationen können diese Quellen später ersetzen.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMentivaDemo } from '../../composables/useMentivaDemo'

const { state } = useMentivaDemo()

const todayHealth = {
  date: '2026-06-22',
  sleepScore: 62,
  sleepDuration: 5.8,
  hrv: 42,
  restingHeartRate: 58,
  stressLevel: 74,
  workload: 82,
  recoveryScore: 54,
  steps: 8420,
  dataSources: ['Apple Health', 'Garmin', 'Smartphone-Sensoren', 'Check-in']
}

const healthHistory = [
  { date: '2026-06-09', sleepScore: 76, sleepDuration: 7.4, hrv: 61, restingHeartRate: 51, stressLevel: 42, workload: 58, recoveryScore: 74, steps: 10840 },
  { date: '2026-06-10', sleepScore: 72, sleepDuration: 7.1, hrv: 58, restingHeartRate: 52, stressLevel: 48, workload: 61, recoveryScore: 70, steps: 9360 },
  { date: '2026-06-11', sleepScore: 69, sleepDuration: 6.6, hrv: 55, restingHeartRate: 53, stressLevel: 55, workload: 68, recoveryScore: 66, steps: 8120 },
  { date: '2026-06-12', sleepScore: 71, sleepDuration: 6.9, hrv: 57, restingHeartRate: 52, stressLevel: 52, workload: 64, recoveryScore: 68, steps: 9870 },
  { date: '2026-06-13', sleepScore: 67, sleepDuration: 6.4, hrv: 53, restingHeartRate: 54, stressLevel: 61, workload: 72, recoveryScore: 62, steps: 7650 },
  { date: '2026-06-14', sleepScore: 64, sleepDuration: 6.1, hrv: 50, restingHeartRate: 55, stressLevel: 66, workload: 76, recoveryScore: 59, steps: 6840 },
  { date: '2026-06-15', sleepScore: 66, sleepDuration: 6.3, hrv: 51, restingHeartRate: 55, stressLevel: 63, workload: 74, recoveryScore: 60, steps: 7930 },
  { date: '2026-06-16', sleepScore: 61, sleepDuration: 5.9, hrv: 47, restingHeartRate: 57, stressLevel: 72, workload: 81, recoveryScore: 55, steps: 7210 },
  { date: '2026-06-17', sleepScore: 59, sleepDuration: 5.6, hrv: 45, restingHeartRate: 58, stressLevel: 76, workload: 84, recoveryScore: 52, steps: 6490 },
  { date: '2026-06-18', sleepScore: 63, sleepDuration: 6.0, hrv: 46, restingHeartRate: 57, stressLevel: 73, workload: 79, recoveryScore: 54, steps: 8740 },
  { date: '2026-06-19', sleepScore: 60, sleepDuration: 5.7, hrv: 43, restingHeartRate: 59, stressLevel: 78, workload: 86, recoveryScore: 50, steps: 5980 },
  { date: '2026-06-20', sleepScore: 58, sleepDuration: 5.5, hrv: 42, restingHeartRate: 60, stressLevel: 80, workload: 88, recoveryScore: 48, steps: 5340 },
  { date: '2026-06-21', sleepScore: 65, sleepDuration: 6.2, hrv: 44, restingHeartRate: 58, stressLevel: 71, workload: 77, recoveryScore: 56, steps: 9270 },
  { date: '2026-06-22', sleepScore: 62, sleepDuration: 5.8, hrv: 42, restingHeartRate: 58, stressLevel: 74, workload: 82, recoveryScore: 54, steps: 8420 }
]

const last7Days = computed(() => healthHistory.slice(-7))
const previous7Days = computed(() => healthHistory.slice(-14, -7))

const avgSleepScore7d = computed(() => average(last7Days.value.map((day) => day.sleepScore)))
const avgSleepDuration7d = computed(() => average(last7Days.value.map((day) => day.sleepDuration)))
const avgHrv7d = computed(() => average(last7Days.value.map((day) => day.hrv)))
const avgHrvPrevious7d = computed(() => average(previous7Days.value.map((day) => day.hrv)))
const hrvTrendPercent = computed(() => percentageChange(avgHrv7d.value, avgHrvPrevious7d.value))
const avgStress7d = computed(() => average(last7Days.value.map((day) => day.stressLevel)))
const avgWorkload7d = computed(() => average(last7Days.value.map((day) => day.workload)))
const avgRecovery7d = computed(() => average(last7Days.value.map((day) => day.recoveryScore)))
const avgRestingHeartRate7d = computed(() => average(last7Days.value.map((day) => day.restingHeartRate)))
const avgSteps7d = computed(() => average(last7Days.value.map((day) => day.steps)))
const highWorkloadDays7d = computed(() => last7Days.value.filter((day) => day.workload >= 75).length)
const workloadRecoveryMismatch = computed(() => avgWorkload7d.value > 70 && avgRecovery7d.value < 60)
const latestCheckin = computed(() => state.checkins.slice(-1)[0] ?? null)
const latestCheckinScore = computed(() => latestCheckin.value ? latestCheckin.value.readinessScore.toFixed(1) : '--')
const checkinInsight = computed(() => {
  if (!latestCheckin.value) {
    return 'Noch kein Check-in gespeichert.'
  }

  return `Letzter Selbstbericht: ${createCheckinLabel(latestCheckin.value.readinessScore)}.`
})

const warnings = computed(() => {
  const items: Array<{ title: string; copy: string }> = []

  if (avgSleepScore7d.value < 70 || avgSleepDuration7d.value < 6.5) {
    items.push({
      title: 'Schlafdefizit-Muster erkannt',
      copy: 'Deine Schlafsignale lagen in der letzten Woche unter deinem Normalbereich. Mentiva empfiehlt, hohe Fokusbelastung zu reduzieren, bis die Erholung wieder stabiler ist.'
    })
  }

  if (hrvTrendPercent.value <= -10) {
    items.push({
      title: 'Erholungsrückgang erkannt',
      copy: 'Dein HRV-Trend ist im Vergleich zur Vorwoche gesunken und deutet auf geringere Erholung hin.'
    })
  }

  if (highWorkloadDays7d.value >= 4) {
    items.push({
      title: 'Anhaltend hohe Belastung',
      copy: 'Deine Arbeitslast blieb über mehrere Tage hoch und kann kognitive Ermüdung wahrscheinlicher machen.'
    })
  }

  if (avgStress7d.value > 70) {
    items.push({
      title: 'Stressaufbau erkannt',
      copy: 'Stresssignale waren diese Woche durchgehend erhöht. Mentiva empfiehlt zusätzliche Erholungsphasen.'
    })
  }

  if (workloadRecoveryMismatch.value) {
    items.push({
      title: 'Belastung und Erholung passen nicht zusammen',
      copy: 'Deine geplante Belastung lag über deiner aktuellen Erholungskapazität.'
    })
  }

  return items
})

const readinessProjection = computed(() => {
  if (
    avgRecovery7d.value >= 75
    && avgSleepScore7d.value >= 75
    && avgStress7d.value < 60
    && hrvTrendPercent.value >= -5
  ) {
    return {
      status: 'Starke Erholung',
      explanation: 'Erholung, Schlaf und Stressmuster deuten aktuell auf eine starke kognitive Kapazität hin.',
      recommendation: 'Schütze deine wertvollsten Fokusfenster und halte deine Erholungsroutine stabil.'
    }
  }

  if (
    avgRecovery7d.value >= 65
    && avgSleepScore7d.value >= 65
    && avgWorkload7d.value < 75
  ) {
    return {
      status: 'Ausgeglichen',
      explanation: 'Belastung und Erholung sind in den letzten Tagen weitgehend im Gleichgewicht.',
      recommendation: 'Nutze fokussierte Arbeit in klaren Blöcken und halte Pausen verlässlich ein.'
    }
  }

  if (
    avgRecovery7d.value < 50
    || avgStress7d.value >= 75
    || workloadRecoveryMismatch.value
  ) {
    return {
      status: 'Hohe Belastung',
      explanation: 'Die letzte Woche zeigt hohe Belastung, erhöhte Stresssignale und geringere Erholungskapazität.',
      recommendation: 'Reduziere Deep-Work-Belastung und ergänze heute bewusste Erholungsphasen.'
    }
  }

  return {
    status: 'Moderate Belastung',
    explanation: 'Die Trenddaten zeigen etwas Erholungsdruck, aber keine durchgehend hohe Belastung.',
    recommendation: 'Wähle anspruchsvolle Arbeit bewusst aus und halte leichtere Aufgaben für spätere Phasen.'
  }
})

const trendBadges = computed(() => [
  { label: 'Schlaf 7T', value: `${formatNumber(avgSleepScore7d.value)} Punkte`, className: 'text-slate-100' },
  { label: 'HRV-Trend', value: `${formatSigned(hrvTrendPercent.value)}%`, className: hrvTrendPercent.value < 0 ? 'text-amber-300' : 'text-emerald-300' },
  { label: 'Stress 7T', value: `${formatNumber(avgStress7d.value)} Schnitt`, className: avgStress7d.value > 70 ? 'text-amber-300' : 'text-slate-100' },
  { label: 'Hohe Belastung', value: `${highWorkloadDays7d.value}/7 Tage`, className: highWorkloadDays7d.value >= 4 ? 'text-amber-300' : 'text-slate-100' }
])

const metricCards = computed(() => [
  {
    label: 'Schlafscore',
    value: `${todayHealth.sleepScore}`,
    detail: `7-Tage-Schnitt ${formatNumber(avgSleepScore7d.value)}`,
    source: 'Erholung',
    badgeClass: 'bg-amber-400/10 text-amber-300'
  },
  {
    label: 'HRV',
    value: `${todayHealth.hrv} ms`,
    detail: `${formatSigned(hrvTrendPercent.value)}% zur Vorwoche`,
    source: 'Wearable',
    badgeClass: 'bg-cyan-400/10 text-cyan-300'
  },
  {
    label: 'Erholungsscore',
    value: `${todayHealth.recoveryScore}`,
    detail: `7-Tage-Schnitt ${formatNumber(avgRecovery7d.value)}`,
    source: 'Kapazität',
    badgeClass: 'bg-emerald-400/10 text-emerald-300'
  },
  {
    label: 'Stresslevel',
    value: `${todayHealth.stressLevel}`,
    detail: `7-Tage-Schnitt ${formatNumber(avgStress7d.value)}`,
    source: 'Muster',
    badgeClass: 'bg-amber-400/10 text-amber-300'
  },
  {
    label: 'Belastung',
    value: `${todayHealth.workload}`,
    detail: `7-Tage-Schnitt ${formatNumber(avgWorkload7d.value)}`,
    source: 'Planung',
    badgeClass: 'bg-slate-700 text-slate-200'
  },
  {
    label: 'Ruhepuls',
    value: `${todayHealth.restingHeartRate} bpm`,
    detail: `7-Tage-Schnitt ${formatNumber(avgRestingHeartRate7d.value)} bpm`,
    source: 'Wearable',
    badgeClass: 'bg-cyan-400/10 text-cyan-300'
  },
  {
    label: 'Schlafdauer',
    value: `${todayHealth.sleepDuration} h`,
    detail: `7-Tage-Schnitt ${formatNumber(avgSleepDuration7d.value)} h`,
    source: 'Erholung',
    badgeClass: 'bg-amber-400/10 text-amber-300'
  },
  {
    label: 'Schritte',
    value: todayHealth.steps.toLocaleString('de-DE'),
    detail: `7-Tage-Schnitt ${formatNumber(avgSteps7d.value)}`,
    source: 'Smartphone',
    badgeClass: 'bg-slate-700 text-slate-200'
  }
])

const trendRows = computed(() => {
  const rows = [
    createTrendRow('Schlafscore', average(previous7Days.value.map((day) => day.sleepScore)), avgSleepScore7d.value),
    createTrendRow('HRV', avgHrvPrevious7d.value, avgHrv7d.value, ' ms'),
    createTrendRow('Stress', average(previous7Days.value.map((day) => day.stressLevel)), avgStress7d.value),
    createTrendRow('Belastung', average(previous7Days.value.map((day) => day.workload)), avgWorkload7d.value),
    createTrendRow('Erholung', average(previous7Days.value.map((day) => day.recoveryScore)), avgRecovery7d.value)
  ]

  return rows
})

function average(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return values.reduce((total, value) => total + value, 0) / values.length
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) {
    return 0
  }

  return ((current - previous) / previous) * 100
}

function createTrendRow(label: string, previous: number, current: number, unit = '') {
  const change = percentageChange(current, previous)

  return {
    label,
    previous: `${formatNumber(previous)}${unit}`,
    current: `${formatNumber(current)}${unit} (${formatSigned(change)}%)`,
    changeClass: change < 0 ? 'text-amber-300' : 'text-emerald-300'
  }
}

function createCheckinLabel(score: number) {
  if (score >= 8) {
    return 'stark'
  }

  if (score >= 6) {
    return 'stabil'
  }

  if (score >= 4) {
    return 'angespannt'
  }

  return 'niedrig'
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 1
  }).format(value)
}

function formatSigned(value: number) {
  const formatted = formatNumber(value)

  return value > 0 ? `+${formatted}` : formatted
}
</script>
