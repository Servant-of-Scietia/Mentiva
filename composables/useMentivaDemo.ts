import { computed, reactive, ref } from 'vue'

interface TimeBlock {
  time: string
  endTime: string
  type: 'deepwork' | 'meeting' | 'routine'
  label: string
}

export type EventType = 'deepwork' | 'meeting' | 'routine'
export type ScreenId = 'dashboard' | 'checkin' | 'week' | 'calendar' | 'signals'

export interface PlanEvent {
  id: number
  date: string
  time: string
  endTime: string
  type: EventType
  label: string
  note: string
}

interface TrendDay {
  day: number
  accuracy: number
  note: string
}

interface HealthDay {
  date: string
  sleepScore: number
  sleepDuration: number
  hrv: number
  restingHeartRate: number
  stressLevel: number
  workload: number
  recoveryScore: number
  steps: number
}

export interface CurvePoint {
  time: string
  readiness: number
  label: string
  zone: string
  interpretation: string
}

interface MentivaState {
  currentScreen: ScreenId
  today: {
    focusStart: string
    focusEnd: string
    blocks: TimeBlock[]
  }
  weekTrend: TrendDay[]
  checkins: Array<{ readinessScore: number; baselineScore: number; timestamp: string }>
  healthHistory: HealthDay[]
  planningEvents: PlanEvent[]
  showOnboarding: boolean
}

const todayKey = getDateKey(new Date())
let nextPlanEventId = 100

const baseReadinessCurve: CurvePoint[] = [
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

const seedHealthHistory: HealthDay[] = [
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

const state = reactive<MentivaState>({
  currentScreen: 'dashboard',
  today: {
    focusStart: '09:40',
    focusEnd: '12:10',
    blocks: [
      { time: '08:00', endTime: '09:00', type: 'routine', label: 'Morgen-Routine' },
      { time: '09:00', endTime: '09:40', type: 'routine', label: 'E-Mails & Messages' },
      { time: '09:40', endTime: '12:10', type: 'deepwork', label: 'Deep Work – Kernprojekt' },
      { time: '12:10', endTime: '13:00', type: 'routine', label: 'Mittagspause' },
      { time: '13:00', endTime: '14:30', type: 'meeting', label: 'Team-Meeting' },
      { time: '14:30', endTime: '18:00', type: 'routine', label: 'Admin & Follow-ups' }
    ]
  },
  weekTrend: [
    { day: 1, accuracy: 62, note: 'Baseline — erste Daten' },
    { day: 2, accuracy: 68, note: 'Erstes Pattern erkannt' },
    { day: 3, accuracy: 71, note: 'Stabilisierung' },
    { day: 4, accuracy: 76, note: 'Wochenende Effekt' },
    { day: 5, accuracy: 81, note: 'Gewöhnung wächst' },
    { day: 6, accuracy: 85, note: 'Hohe Konsistenz' },
    { day: 7, accuracy: 88, note: 'Beste Woche bisher!' }
  ],
  checkins: [],
  healthHistory: seedHealthHistory,
  planningEvents: createSeedPlanEvents(),
  showOnboarding: true
})

let lastSuccessMessage = ref('')
let showSuccessMessage = ref(false)

export function useMentivaDemo() {
  const latestCheckin = computed(() => state.checkins.slice(-1)[0] ?? null)
  const todayHealth = computed(() => state.healthHistory[state.healthHistory.length - 1])
  const last7HealthDays = computed(() => state.healthHistory.slice(-7))
  const previous7HealthDays = computed(() => state.healthHistory.slice(-14, -7))
  const todayPlanEvents = computed(() => getPlanEventsForDate(todayKey))

  const healthAverages = computed(() => {
    const last7 = last7HealthDays.value
    const previous7 = previous7HealthDays.value

    return {
      sleepScore: average(last7.map((day) => day.sleepScore)),
      sleepDuration: average(last7.map((day) => day.sleepDuration)),
      hrv: average(last7.map((day) => day.hrv)),
      hrvPrevious: average(previous7.map((day) => day.hrv)),
      stress: average(last7.map((day) => day.stressLevel)),
      workload: average(last7.map((day) => day.workload)),
      recovery: average(last7.map((day) => day.recoveryScore)),
      restingHeartRate: average(last7.map((day) => day.restingHeartRate)),
      steps: average(last7.map((day) => day.steps)),
      highWorkloadDays: last7.filter((day) => day.workload >= 75).length
    }
  })

  const readinessAdjustment = computed(() => {
    const averages = healthAverages.value
    const healthPressure = (averages.recovery - 60) * 0.22
      + (averages.sleepScore - 65) * 0.12
      - (averages.stress - 65) * 0.1
    const checkinPressure = latestCheckin.value ? (latestCheckin.value.readinessScore - 6) * 8 : 0
    const planPressure = Math.max(todayPlanEvents.value.length - 5, 0) * -2

    return clamp(healthPressure + checkinPressure + planPressure, -18, 14)
  })

  const forecastCurve = computed(() => baseReadinessCurve.map((point) => {
    const hour = Number(point.time.slice(0, 2))
    const afternoonPenalty = hour >= 16 && readinessAdjustment.value < 0 ? readinessAdjustment.value * 0.35 : 0
    const readiness = clamp(Math.round(point.readiness + readinessAdjustment.value + afternoonPenalty), 12, 98)

    return {
      ...point,
      readiness,
      zone: getReadinessZone(readiness),
      interpretation: getReadinessInterpretation(readiness)
    }
  }))

  const peakReadinessPoint = computed(() => forecastCurve.value.reduce((highest, point) => point.readiness > highest.readiness ? point : highest, forecastCurve.value[0]))
  const lowestReadinessPoint = computed(() => forecastCurve.value.reduce((lowest, point) => point.readiness < lowest.readiness ? point : lowest, forecastCurve.value[0]))
  const averageReadiness = computed(() => average(forecastCurve.value.map((point) => point.readiness)))

  const forecastSummary = computed(() => {
    const averageScore = averageReadiness.value
    const peakWindow = getWindowAroundPeak(peakReadinessPoint.value.time)
    const pressureReasons = [
      latestCheckin.value ? `Check-in ${latestCheckin.value.readinessScore.toFixed(1)}/10` : 'kein Check-in',
      `Erholung ${Math.round(healthAverages.value.recovery)}/100`,
      `${todayPlanEvents.value.length} Planungsblöcke`
    ]

    return {
      status: getReadinessStatus(averageScore),
      peakWindow,
      secondaryWindow: averageScore >= 65 ? '14:30-15:40' : '14:00-15:00',
      lowReadinessWindow: averageScore >= 65 ? '17:30-22:00' : '16:30-22:00',
      confidence: clamp(Math.round(68 + state.checkins.length * 5 + Math.min(state.healthHistory.length, 14)), 72, 94),
      confidenceReason: `Basierend auf ${state.healthHistory.length} Tagen Signalverlauf, ${state.checkins.length} Check-in${state.checkins.length === 1 ? '' : 's'} und deiner Planung.`,
      mainInterpretation: `Die Prognose kombiniert Gesundheitsdaten, Selbstbericht und Kalenderlast. Aktuelle Treiber: ${pressureReasons.join(', ')}.`,
      coreMessage: averageScore >= 70
        ? 'Schütze dein stärkstes Fokusfenster und nutze die stabile Kapazität bewusst.'
        : 'Plane weniger mentale Tiefe ein und verschiebe harte Denkarbeit in dein stärkstes Fenster.'
    }
  })

  const weeklyOutlook = computed(() => {
    const base = [64, 69, 76, 61, 72, 58, 67]
    const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

    return base.map((readiness, index) => {
      const adjusted = clamp(Math.round(readiness + readinessAdjustment.value * 0.35 - index * 0.4), 35, 92)

      return {
        day: days[index],
        readiness: adjusted,
        status: getReadinessStatus(adjusted),
        note: getWeeklyNote(adjusted)
      }
    })
  })

  const planningStatus = computed(() => {
    const focusMinutes = todayPlanEvents.value
      .filter((event) => event.type === 'deepwork')
      .reduce((total, event) => total + getDurationMinutes(event.time, event.endTime), 0)

    const items = [
      `Peak-Fokus: ${forecastSummary.value.peakWindow}`,
      `Fokus geplant: ${formatDuration(focusMinutes)}`,
      latestCheckin.value ? `Check-in: ${latestCheckin.value.readinessScore.toFixed(1)}/10` : 'Check-in offen'
    ]

    if (averageReadiness.value < 65) {
      items.push('Erholungsblock empfohlen')
    }

    return {
      count: items.length,
      title: averageReadiness.value >= 70 ? 'Plan wirkt stimmig' : 'Optimierungen erkannt',
      items
    }
  })

  function goTo(screen: ScreenId) {
    state.currentScreen = screen
    console.log(`Navigating to ${screen} screen`)
  }

  function addCheckin(readinessScore: number, baselineScore: number) {
    state.checkins.push({
      readinessScore,
      baselineScore,
      timestamp: new Date().toISOString()
    })
    // Show success message
    lastSuccessMessage.value = `Danke! Deine Vorhersage für morgen wird ${readinessScore > 7 ? 'noch' : ''} genauer.`
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 2000)
  }

  function addPlanEvent(event: Omit<PlanEvent, 'id'>) {
    const created = {
      id: nextPlanEventId++,
      ...event
    }

    state.planningEvents.push(created)

    return created
  }

  function getPlanEventsForDate(dateKey: string) {
    return state.planningEvents.filter((event) => event.date === dateKey)
  }

  function hideOnboarding() {
    state.showOnboarding = false
  }

  function isInFocusTime(): boolean {
    // Simulate current time for demo - use a fixed "now" that makes sense
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const currentTime = `${hours}:${minutes}`
    return currentTime >= state.today.focusStart && currentTime <= state.today.focusEnd
  }

  return {
    state,
    goTo,
    addCheckin,
    addPlanEvent,
    getPlanEventsForDate,
    hideOnboarding,
    isInFocusTime,
    latestCheckin,
    todayHealth,
    last7HealthDays,
    previous7HealthDays,
    healthAverages,
    forecastCurve,
    forecastSummary,
    weeklyOutlook,
    peakReadinessPoint,
    lowestReadinessPoint,
    averageReadiness,
    planningStatus,
    lastSuccessMessage,
    showSuccessMessage
  }
}

function createSeedPlanEvents(): PlanEvent[] {
  const today = new Date()
  const baseEvents = [
    { time: '08:00', endTime: '09:00', type: 'routine' as EventType, label: 'Morgen-Routine' },
    { time: '09:00', endTime: '09:40', type: 'routine' as EventType, label: 'E-Mails & Messages' },
    { time: '09:40', endTime: '12:10', type: 'deepwork' as EventType, label: 'Deep Work – Kernprojekt' },
    { time: '12:10', endTime: '13:00', type: 'routine' as EventType, label: 'Mittagspause' },
    { time: '13:00', endTime: '14:30', type: 'meeting' as EventType, label: 'Team-Meeting' },
    { time: '14:30', endTime: '18:00', type: 'routine' as EventType, label: 'Admin & Follow-ups' }
  ]

  return [
    ...baseEvents.map((event) => createPlanEvent(getDateKey(today), event.time, event.endTime, event.type, event.label, getDefaultNote(event.type))),
    createPlanEvent(getDateKey(addDays(today, -2)), '09:15', '10:45', 'deepwork', 'Konzept-Sprint', 'Mentiva blockt frühe Energie für anspruchsvolle Planung.'),
    createPlanEvent(getDateKey(addDays(today, -2)), '13:30', '14:15', 'meeting', 'Sync mit Design', 'Kurzer Abgleich zu offenen Entscheidungen.'),
    createPlanEvent(getDateKey(addDays(today, -1)), '08:30', '09:00', 'routine', 'Planung & Inbox', 'Leichte Routine vor der ersten Fokusphase.'),
    createPlanEvent(getDateKey(addDays(today, -1)), '10:00', '12:00', 'deepwork', 'Prototyp verfeinern', 'Geschützter Block für konzentrierte Produktarbeit.'),
    createPlanEvent(getDateKey(addDays(today, 1)), '09:30', '11:30', 'deepwork', 'Feature-Entwurf', 'Mentiva reserviert morgen den stärksten Fokusbereich.'),
    createPlanEvent(getDateKey(addDays(today, 1)), '15:00', '15:45', 'meeting', 'Review Call', 'Meeting liegt bewusst nach der Fokuszeit.'),
    createPlanEvent(getDateKey(addDays(today, 2)), '08:00', '08:45', 'routine', 'Wochenplanung', 'Ruhiger Start mit geringer kognitiver Last.'),
    createPlanEvent(getDateKey(addDays(today, 2)), '11:00', '12:30', 'deepwork', 'Analyse der Check-ins', 'Auswertung neuer Datenpunkte für bessere Vorschläge.'),
    createPlanEvent(getDateKey(addDays(today, 4)), '14:00', '15:00', 'meeting', 'Stakeholder Update', 'Kommunikation in einem niedrigeren Energie-Fenster.'),
    createPlanEvent(getDateKey(addDays(today, 5)), '10:30', '12:00', 'deepwork', 'Strategie-Dokument', 'Längerer Schreibblock mit wenig Kontextwechsel.')
  ]
}

function createPlanEvent(date: string, time: string, endTime: string, type: EventType, label: string, note: string) {
  return {
    id: nextPlanEventId++,
    date,
    time,
    endTime,
    type,
    label,
    note
  }
}

function getDefaultNote(type: EventType) {
  return {
    deepwork: 'Dieser Block liegt in einem Fokusfenster mit hoher mentaler Kapazität.',
    meeting: 'Dieser Block ist als Austausch geplant und vermeidet deine stärkste Deep-Work-Zeit.',
    routine: 'Diese Aufgabe eignet sich für Zeiten mit niedrigerer kognitiver Last.'
  }[type]
}

function getReadinessStatus(value: number) {
  if (value >= 78) {
    return 'Starke Erholung'
  }

  if (value >= 68) {
    return 'Stabil'
  }

  if (value >= 55) {
    return 'Moderate Belastung'
  }

  return 'Hohe Belastung'
}

function getReadinessZone(value: number) {
  if (value >= 80) {
    return 'Tiefe Denkarbeit'
  }

  if (value >= 70) {
    return 'Fokussierte Ausführung'
  }

  if (value >= 50) {
    return 'Routinefähigkeit'
  }

  return 'Regeneration'
}

function getReadinessInterpretation(value: number) {
  if (value >= 80) {
    return 'Starke mentale Tiefe und gute Entscheidungsqualität.'
  }

  if (value >= 70) {
    return 'Gute Phase für fokussierte, mittelkomplexe Arbeit.'
  }

  if (value >= 50) {
    return 'Brauchbar für Routine, Abstimmung und leichte Ausführung.'
  }

  return 'Erholung ist voraussichtlich wertvoller als weitere kognitive Last.'
}

function getWindowAroundPeak(time: string) {
  const start = Math.max(getMinutes(time) - 40, 6 * 60)
  const end = Math.min(getMinutes(time) + 105, 22 * 60)

  return `${formatTime(start)}-${formatTime(end)}`
}

function getWeeklyNote(readiness: number) {
  if (readiness >= 75) {
    return 'Gutes Fokuspotenzial.'
  }

  if (readiness >= 65) {
    return 'Solide kognitive Kapazität.'
  }

  if (readiness >= 55) {
    return 'Belastung bewusst dosieren.'
  }

  return 'Regeneration priorisieren.'
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return values.reduce((total, value) => total + value, 0) / values.length
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getDurationMinutes(startTime: string, endTime: string) {
  return getMinutes(endTime) - getMinutes(startTime)
}

function formatDuration(minutes: number) {
  if (minutes <= 0) {
    return '0 Min'
  }

  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  return hours > 0 ? `${hours} Std ${rest} Min` : `${rest} Min`
}

function getMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  return `${String(hours).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

function getDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function addDays(date: Date, days: number) {
  const value = new Date(date)

  value.setDate(value.getDate() + days)

  return value
}
