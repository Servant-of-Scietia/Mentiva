<template>
  <div class="h-full overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-24 text-slate-100">
    <div class="px-5 py-5">
      <header class="mb-5">
        <div class="mb-4 flex items-center gap-3">
          <div class="text-2xl font-black text-slate-100">M</div>
          <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Mentiva</p>
          <div class="ml-2 h-px flex-1 bg-gradient-to-r from-amber-500/60 to-transparent"></div>
        </div>

        <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Health Signals</p>
        <h1 class="mt-2 text-2xl font-black leading-tight text-slate-100">Health Signals</h1>
        <p class="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          Wearable and phone data used to estimate your cognitive readiness.
        </p>
      </header>

      <section class="mb-5 rounded-2xl border border-amber-400/20 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/30 backdrop-blur-md">
        <div class="space-y-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Readiness projection</p>
            <h2 class="mt-2 text-2xl font-black text-slate-100">Today's projection: {{ readinessProjection.status }}</h2>
            <p class="mt-3 text-sm leading-relaxed text-slate-400">{{ readinessProjection.explanation }}</p>
          </div>

          <div class="rounded-2xl border border-slate-800/60 bg-slate-950/50 p-4">
            <p class="text-xs font-bold uppercase tracking-widest text-slate-500">Recommended action</p>
            <p class="mt-2 text-sm font-semibold leading-relaxed text-slate-200">{{ readinessProjection.recommendation }}</p>
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
          class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ metric.label }}</p>
              <p class="mt-2 text-2xl font-black text-slate-100">{{ metric.value }}</p>
            </div>
            <span class="rounded-xl px-2 py-1 text-[10px] font-bold" :class="metric.badgeClass">{{ metric.source }}</span>
          </div>
          <p class="mt-3 text-xs leading-relaxed text-slate-400">{{ metric.detail }}</p>
        </article>
      </section>

      <section
        v-if="warnings.length > 0"
        class="mb-5 rounded-2xl border border-amber-400/20 bg-slate-900/50 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-md"
      >
        <div class="mb-4">
          <h2 class="text-lg font-black text-slate-100">Detected long-term patterns</h2>
          <p class="mt-1 text-sm text-slate-400">Mentiva looks at multi-day trends, not isolated daily fluctuations.</p>
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
        <h2 class="text-lg font-black text-slate-100">Trend summary</h2>
        <p class="mt-1 text-sm text-slate-400">Last 7 days vs previous 7 days.</p>

        <div class="mt-4 divide-y divide-slate-800/60 overflow-hidden rounded-xl border border-slate-800/60">
          <div
            v-for="row in trendRows"
            :key="row.label"
            class="grid grid-cols-[1fr_auto] gap-2 bg-slate-950/35 px-3 py-3 text-sm"
          >
            <span class="font-bold text-slate-200">{{ row.label }}</span>
            <span class="text-right font-black" :class="row.changeClass">{{ row.current }}</span>
            <span class="col-span-2 text-xs text-slate-500">Previous 7d: {{ row.previous }}</span>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-md">
        <h2 class="text-lg font-black text-slate-100">Data sources</h2>
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
          Mock data for demo purposes. Real integrations can later replace this source.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
  dataSources: ['Apple Health', 'Garmin', 'Phone Sensors']
}

const healthHistory = [
  { date: '2026-06-09', sleepScore: 76, sleepDuration: 7.4, hrv: 61, restingHeartRate: 51, stressLevel: 42, workload: 58, recoveryScore: 74 },
  { date: '2026-06-10', sleepScore: 72, sleepDuration: 7.1, hrv: 58, restingHeartRate: 52, stressLevel: 48, workload: 61, recoveryScore: 70 },
  { date: '2026-06-11', sleepScore: 69, sleepDuration: 6.6, hrv: 55, restingHeartRate: 53, stressLevel: 55, workload: 68, recoveryScore: 66 },
  { date: '2026-06-12', sleepScore: 71, sleepDuration: 6.9, hrv: 57, restingHeartRate: 52, stressLevel: 52, workload: 64, recoveryScore: 68 },
  { date: '2026-06-13', sleepScore: 67, sleepDuration: 6.4, hrv: 53, restingHeartRate: 54, stressLevel: 61, workload: 72, recoveryScore: 62 },
  { date: '2026-06-14', sleepScore: 64, sleepDuration: 6.1, hrv: 50, restingHeartRate: 55, stressLevel: 66, workload: 76, recoveryScore: 59 },
  { date: '2026-06-15', sleepScore: 66, sleepDuration: 6.3, hrv: 51, restingHeartRate: 55, stressLevel: 63, workload: 74, recoveryScore: 60 },
  { date: '2026-06-16', sleepScore: 61, sleepDuration: 5.9, hrv: 47, restingHeartRate: 57, stressLevel: 72, workload: 81, recoveryScore: 55 },
  { date: '2026-06-17', sleepScore: 59, sleepDuration: 5.6, hrv: 45, restingHeartRate: 58, stressLevel: 76, workload: 84, recoveryScore: 52 },
  { date: '2026-06-18', sleepScore: 63, sleepDuration: 6.0, hrv: 46, restingHeartRate: 57, stressLevel: 73, workload: 79, recoveryScore: 54 },
  { date: '2026-06-19', sleepScore: 60, sleepDuration: 5.7, hrv: 43, restingHeartRate: 59, stressLevel: 78, workload: 86, recoveryScore: 50 },
  { date: '2026-06-20', sleepScore: 58, sleepDuration: 5.5, hrv: 42, restingHeartRate: 60, stressLevel: 80, workload: 88, recoveryScore: 48 },
  { date: '2026-06-21', sleepScore: 65, sleepDuration: 6.2, hrv: 44, restingHeartRate: 58, stressLevel: 71, workload: 77, recoveryScore: 56 },
  { date: '2026-06-22', sleepScore: 62, sleepDuration: 5.8, hrv: 42, restingHeartRate: 58, stressLevel: 74, workload: 82, recoveryScore: 54 }
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
const highWorkloadDays7d = computed(() => last7Days.value.filter((day) => day.workload >= 75).length)
const workloadRecoveryMismatch = computed(() => avgWorkload7d.value > 70 && avgRecovery7d.value < 60)

const warnings = computed(() => {
  const items: Array<{ title: string; copy: string }> = []

  if (avgSleepScore7d.value < 70 || avgSleepDuration7d.value < 6.5) {
    items.push({
      title: 'Sleep debt pattern detected',
      copy: 'Your sleep metrics have been below baseline over the last week. Mentiva recommends reducing high-focus workload until recovery improves.'
    })
  }

  if (hrvTrendPercent.value <= -10) {
    items.push({
      title: 'Recovery decline detected',
      copy: 'HRV has dropped compared with your previous week, suggesting lower physiological recovery.'
    })
  }

  if (highWorkloadDays7d.value >= 4) {
    items.push({
      title: 'Sustained workload overload',
      copy: 'Your workload has stayed high across multiple days, increasing the risk of cognitive fatigue.'
    })
  }

  if (avgStress7d.value > 70) {
    items.push({
      title: 'Stress accumulation detected',
      copy: 'Stress signals have remained elevated this week. Mentiva recommends adding recovery blocks.'
    })
  }

  if (workloadRecoveryMismatch.value) {
    items.push({
      title: 'Workload-recovery mismatch',
      copy: 'Your planned workload has exceeded your recent recovery capacity.'
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
      status: 'Strong recovery',
      explanation: 'Recent recovery, sleep, and stress patterns point to strong cognitive readiness.',
      recommendation: 'Protect your highest-value focus blocks and keep normal recovery routines in place.'
    }
  }

  if (
    avgRecovery7d.value >= 65
    && avgSleepScore7d.value >= 65
    && avgWorkload7d.value < 75
  ) {
    return {
      status: 'Balanced',
      explanation: 'Your recent workload and recovery signals are broadly aligned.',
      recommendation: 'Plan focused work in shorter blocks and keep breaks consistent.'
    }
  }

  if (
    avgRecovery7d.value < 50
    || avgStress7d.value >= 75
    || workloadRecoveryMismatch.value
  ) {
    return {
      status: 'High strain',
      explanation: 'The last week shows high workload pressure, elevated stress signals, and reduced recovery capacity.',
      recommendation: 'Reduce deep-work load, move lower-priority tasks, and add recovery blocks today.'
    }
  }

  return {
    status: 'Moderate strain',
    explanation: 'Trend data suggests some recovery pressure, but signals are not consistently high strain.',
    recommendation: 'Keep demanding work selective and schedule lighter tasks after focus windows.'
  }
})

const trendBadges = computed(() => [
  { label: 'Sleep 7d', value: `${formatNumber(avgSleepScore7d.value)} score`, className: 'text-slate-100' },
  { label: 'HRV trend', value: `${formatSigned(hrvTrendPercent.value)}%`, className: hrvTrendPercent.value < 0 ? 'text-amber-300' : 'text-emerald-300' },
  { label: 'Stress 7d', value: `${formatNumber(avgStress7d.value)} avg`, className: avgStress7d.value > 70 ? 'text-amber-300' : 'text-slate-100' },
  { label: 'Workload high', value: `${highWorkloadDays7d.value}/7 days`, className: highWorkloadDays7d.value >= 4 ? 'text-amber-300' : 'text-slate-100' }
])

const metricCards = computed(() => [
  {
    label: 'Sleep Score',
    value: `${todayHealth.sleepScore}`,
    detail: `7-day average ${formatNumber(avgSleepScore7d.value)}`,
    source: 'Recovery',
    badgeClass: 'bg-amber-400/10 text-amber-300'
  },
  {
    label: 'HRV',
    value: `${todayHealth.hrv} ms`,
    detail: `${formatSigned(hrvTrendPercent.value)}% vs previous week`,
    source: 'Wearable',
    badgeClass: 'bg-cyan-400/10 text-cyan-300'
  },
  {
    label: 'Recovery Score',
    value: `${todayHealth.recoveryScore}`,
    detail: `7-day average ${formatNumber(avgRecovery7d.value)}`,
    source: 'Readiness',
    badgeClass: 'bg-emerald-400/10 text-emerald-300'
  },
  {
    label: 'Stress Level',
    value: `${todayHealth.stressLevel}`,
    detail: `7-day average ${formatNumber(avgStress7d.value)}`,
    source: 'Pattern',
    badgeClass: 'bg-amber-400/10 text-amber-300'
  },
  {
    label: 'Workload',
    value: `${todayHealth.workload}`,
    detail: `7-day average ${formatNumber(avgWorkload7d.value)}`,
    source: 'Planning',
    badgeClass: 'bg-slate-700 text-slate-200'
  },
  {
    label: 'Resting Heart Rate',
    value: `${todayHealth.restingHeartRate} bpm`,
    detail: 'Used as a background strain signal',
    source: 'Wearable',
    badgeClass: 'bg-cyan-400/10 text-cyan-300'
  },
  {
    label: 'Sleep Duration',
    value: `${todayHealth.sleepDuration} h`,
    detail: `7-day average ${formatNumber(avgSleepDuration7d.value)} h`,
    source: 'Recovery',
    badgeClass: 'bg-amber-400/10 text-amber-300'
  },
  {
    label: 'Steps',
    value: todayHealth.steps.toLocaleString('en-US'),
    detail: 'Phone and wearable movement context',
    source: 'Phone',
    badgeClass: 'bg-slate-700 text-slate-200'
  }
])

const trendRows = computed(() => {
  const rows = [
    createTrendRow('Sleep Score', average(previous7Days.value.map((day) => day.sleepScore)), avgSleepScore7d.value),
    createTrendRow('HRV', avgHrvPrevious7d.value, avgHrv7d.value, ' ms'),
    createTrendRow('Stress', average(previous7Days.value.map((day) => day.stressLevel)), avgStress7d.value),
    createTrendRow('Workload', average(previous7Days.value.map((day) => day.workload)), avgWorkload7d.value),
    createTrendRow('Recovery', average(previous7Days.value.map((day) => day.recoveryScore)), avgRecovery7d.value)
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

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1
  }).format(value)
}

function formatSigned(value: number) {
  const formatted = formatNumber(value)

  return value > 0 ? `+${formatted}` : formatted
}
</script>
