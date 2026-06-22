<template>
  <div class="h-full overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-24 text-slate-100">
    <header class="sticky top-0 z-20 border-b border-slate-800/60 bg-slate-950/85 p-5 backdrop-blur-md">
      <div class="mb-4 flex items-center gap-3">
        <div class="text-2xl font-black text-slate-100">M</div>
        <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Mentiva</p>
        <div class="ml-2 h-px flex-1 bg-gradient-to-r from-amber-500/60 to-transparent"></div>
      </div>

      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h1 class="text-2xl font-black leading-tight text-slate-100">Kalender</h1>
          <p class="mt-1 truncate text-sm text-slate-400">{{ selectedDayLabel }}</p>
        </div>

        <button
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-xl font-black text-slate-950 shadow-lg shadow-amber-500/20 transition active:scale-95"
          aria-label="Termin hinzufuegen"
          @click="toggleComposer"
        >
          +
        </button>
      </div>

      <div class="mt-4 flex items-center gap-2">
        <button
          type="button"
          class="rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-300 transition active:scale-95"
          @click="selectToday"
        >
          Heute
        </button>

        <div class="flex min-w-0 flex-1 rounded-xl border border-slate-800/60 bg-slate-900/70 p-1">
          <button
            v-for="view in views"
            :key="view"
            type="button"
            class="min-w-0 flex-1 rounded-lg px-2 py-1.5 text-xs font-bold transition"
            :class="activeView === view ? 'bg-amber-400 text-slate-950' : 'text-slate-400'"
            @click="activeView = view"
          >
            {{ view }}
          </button>
        </div>

        <div class="flex shrink-0 rounded-xl border border-slate-800/60 bg-slate-900/70">
          <button
            type="button"
            class="h-9 w-9 text-xl font-bold text-slate-300 transition active:scale-95"
            aria-label="Vorheriger Tag"
            @click="moveSelectedDay(-1)"
          >
            ‹
          </button>
          <button
            type="button"
            class="h-9 w-9 text-xl font-bold text-slate-300 transition active:scale-95"
            aria-label="Naechster Tag"
            @click="moveSelectedDay(1)"
          >
            ›
          </button>
        </div>
      </div>
    </header>

    <main class="space-y-4 p-5">
      <section class="grid grid-cols-7 gap-1 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-2 backdrop-blur-md">
        <button
          v-for="day in weekDays"
          :key="day.key"
          type="button"
          class="flex h-14 min-w-0 flex-col items-center justify-center rounded-xl transition active:scale-95"
          :class="day.isSelected ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800/60'"
          @click="selectDate(day.date)"
        >
          <span class="text-[10px] font-bold uppercase" :class="day.isSelected ? 'text-slate-950/70' : 'text-slate-500'">
            {{ day.weekday }}
          </span>
          <span class="mt-0.5 text-lg font-black leading-none">{{ day.day }}</span>
          <span class="mt-1 flex h-1.5 gap-0.5">
            <span
              v-for="event in day.previewEvents"
              :key="event.id"
              class="h-1.5 w-1.5 rounded-full"
              :class="day.isSelected ? 'bg-slate-950/70' : getEventDot(event.type)"
            />
          </span>
        </button>
      </section>

      <Transition name="expand">
        <section
          v-if="showComposer"
          class="rounded-2xl border border-amber-400/30 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/20"
        >
          <div class="mb-4 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <h2 class="text-sm font-black text-slate-100">Neuer Termin</h2>
              <p class="truncate text-xs text-slate-400">{{ selectedDayShort }}</p>
            </div>
            <button
              type="button"
              class="text-sm font-bold text-slate-500 transition hover:text-slate-300"
              @click="showComposer = false"
            >
              Schliessen
            </button>
          </div>

          <form class="space-y-3" @submit.prevent="addEvent">
            <input
              v-model="draft.label"
              type="text"
              class="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-400"
              placeholder="Titel"
            />

            <div class="grid grid-cols-2 gap-2">
              <input
                v-model="draft.time"
                type="time"
                class="min-w-0 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-400"
              />
              <input
                v-model="draft.endTime"
                type="time"
                class="min-w-0 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-400"
              />
            </div>

            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="type in eventTypes"
                :key="type.value"
                type="button"
                class="rounded-xl border px-2 py-2 text-xs font-bold transition active:scale-95"
                :class="draft.type === type.value ? type.activeClass : 'border-slate-700 bg-slate-950/50 text-slate-400'"
                @click="draft.type = type.value"
              >
                {{ type.label }}
              </button>
            </div>

            <button
              type="submit"
              class="w-full rounded-xl bg-amber-400 py-3 text-sm font-black text-slate-950 transition active:scale-[0.98]"
            >
              Termin hinzufuegen
            </button>
          </form>
        </section>
      </Transition>

      <section
        v-if="activeView === 'Monat'"
        class="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 backdrop-blur-md"
      >
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-sm font-black text-slate-200">{{ monthLabel }}</h2>
          <span class="text-xs font-bold text-amber-400">{{ selectedDayEvents.length }} Termine</span>
        </div>

        <div class="mb-2 grid grid-cols-7 text-center text-[10px] font-bold uppercase text-slate-500">
          <span v-for="day in shortWeekdays" :key="day">{{ day }}</span>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="date in monthDates"
            :key="date.key"
            type="button"
            class="flex h-10 min-w-0 flex-col items-center justify-center rounded-xl text-xs transition active:scale-95"
            :class="[
              date.isSelected ? 'bg-amber-400 font-black text-slate-950' : 'hover:bg-slate-800/60',
              date.inMonth && !date.isSelected ? 'text-slate-300' : '',
              !date.inMonth ? 'text-slate-700' : ''
            ]"
            @click="selectDate(date.value)"
          >
            <span>{{ date.day }}</span>
            <span
              v-if="date.eventCount"
              class="mt-0.5 h-1 w-1 rounded-full"
              :class="date.isSelected ? 'bg-slate-950/70' : 'bg-amber-400'"
            />
          </button>
        </div>
      </section>

      <section
        v-else-if="activeView === 'Woche'"
        class="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 backdrop-blur-md"
      >
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-sm font-black text-slate-200">Wochenueberblick</h2>
          <span class="text-xs font-bold text-slate-500">{{ weekEventCount }} Termine</span>
        </div>

        <div class="space-y-2">
          <button
            v-for="day in weekDays"
            :key="`week-${day.key}`"
            type="button"
            class="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition active:scale-[0.99]"
            :class="day.isSelected ? 'border-amber-400/50 bg-amber-400/10' : 'border-slate-800/60 bg-slate-950/30'"
            @click="selectDate(day.date)"
          >
            <span class="w-10 text-center">
              <span class="block text-[10px] font-bold uppercase text-slate-500">{{ day.weekday }}</span>
              <span class="block text-lg font-black text-slate-200">{{ day.day }}</span>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-bold text-slate-200">{{ getDaySummary(day.date) }}</span>
              <span class="mt-0.5 block text-xs text-slate-500">{{ getEventsForDate(day.date).length }} Termine geplant</span>
            </span>
          </button>
        </div>
      </section>

      <section class="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md">
        <div class="flex items-center justify-between border-b border-slate-800/60 px-4 py-3">
          <div class="min-w-0">
            <h2 class="truncate text-sm font-black text-slate-200">{{ selectedDayShort }}</h2>
            <p class="text-xs text-slate-500">{{ selectedDayEvents.length }} Termine · {{ focusDuration }} Fokus</p>
          </div>

          <div class="flex gap-2">
            <button
              v-for="calendar in calendars"
              :key="calendar.label"
              type="button"
              class="h-8 w-8 rounded-xl border transition active:scale-95"
              :class="calendar.enabled ? calendar.activeClass : 'border-slate-800 bg-slate-950/40 opacity-40'"
              :aria-label="calendar.label"
              @click="calendar.enabled = !calendar.enabled"
            >
              <span class="sr-only">{{ calendar.label }}</span>
            </button>
          </div>
        </div>

        <div class="relative h-[520px] bg-slate-950/30">
          <div class="absolute left-0 top-0 bottom-0 w-12 border-r border-slate-800/60 text-[10px] text-slate-600">
            <div
              v-for="hour in timelineHours"
              :key="hour"
              class="h-[52px] pr-1 pt-1 text-right"
            >
              {{ String(hour).padStart(2, '0') }}
            </div>
          </div>

          <div class="absolute left-12 right-0 top-0 bottom-0">
            <div
              v-for="hour in timelineHours"
              :key="hour"
              class="h-[52px] border-b border-slate-800/50"
            />

            <div
              v-if="isTodaySelected && nowPosition >= 0 && nowPosition <= 100"
              class="absolute left-0 right-2 z-10 flex items-center"
              :style="{ top: `${nowPosition}%` }"
            >
              <span class="-ml-1 h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span class="h-px flex-1 bg-amber-400" />
            </div>

            <button
              v-for="(event, idx) in selectedDayEvents"
              :key="event.id"
              type="button"
              class="absolute left-2 right-2 overflow-hidden rounded-xl border-l-4 px-3 py-2 text-left shadow-lg shadow-slate-950/20 transition active:scale-[0.99]"
              :class="getEventStyle(event.type)"
              :style="{
                ...getEventPosition(event.time, event.endTime),
                animation: 'eventIn 0.28s ease-out both',
                animationDelay: `${idx * 45}ms`
              }"
              @click="selectedEvent = event"
            >
              <p class="truncate text-xs font-black">{{ event.label }}</p>
              <p class="mt-0.5 text-[11px] opacity-75">{{ event.time }} - {{ event.endTime }}</p>
            </button>

            <div
              v-if="selectedDayEvents.length === 0"
              class="absolute inset-0 flex items-center justify-center px-8 text-center text-sm text-slate-500"
            >
              Keine Termine. Tippe auf +, um diesen Tag zu planen.
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 backdrop-blur-md">
        <div class="mb-3 flex items-center justify-between gap-3">
          <h2 class="text-sm font-black text-slate-200">Agenda</h2>
          <span class="truncate text-xs font-bold text-slate-500">{{ selectedEvent?.label || 'Kein Termin ausgewaehlt' }}</span>
        </div>

        <div v-if="selectedDayEvents.length" class="space-y-2">
          <button
            v-for="event in selectedDayEvents"
            :key="`agenda-${event.id}`"
            type="button"
            class="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition active:scale-[0.99]"
            :class="selectedEvent?.id === event.id ? 'border-amber-400/50 bg-amber-400/10' : 'border-slate-800/60 bg-slate-950/30'"
            @click="selectedEvent = event"
          >
            <span class="w-11 text-xs font-black text-amber-400">{{ event.time }}</span>
            <span class="h-9 w-1 rounded-full" :class="getEventAccent(event.type)" />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-bold text-slate-200">{{ event.label }}</span>
              <span class="mt-0.5 block text-xs text-slate-500">{{ event.endTime }} Ende · {{ getTypeLabel(event.type) }}</span>
            </span>
          </button>
        </div>

        <div
          v-if="selectedEvent"
          class="mt-4 rounded-xl border border-slate-800/60 bg-slate-950/50 p-3"
        >
          <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Details</p>
          <h3 class="mt-2 text-base font-black text-slate-100">{{ selectedEvent.label }}</h3>
          <p class="mt-1 text-sm text-slate-400">{{ selectedEvent.time }} - {{ selectedEvent.endTime }} · {{ getTypeLabel(selectedEvent.type) }}</p>
          <p class="mt-3 text-xs leading-relaxed text-slate-500">{{ selectedEvent.note }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useMentivaDemo } from '../../composables/useMentivaDemo'

type CalendarView = 'Tag' | 'Woche' | 'Monat'
type EventType = 'deepwork' | 'meeting' | 'routine'
type CalendarEvent = {
  id: number
  date: string
  time: string
  endTime: string
  type: EventType
  label: string
  note: string
}

const { state } = useMentivaDemo()

const today = new Date()
const views: CalendarView[] = ['Tag', 'Woche', 'Monat']
const shortWeekdays = ['M', 'D', 'M', 'D', 'F', 'S', 'S']
const timelineHours = Array.from({ length: 11 }, (_, index) => index + 8)

const activeView = ref<CalendarView>('Tag')
const selectedDate = ref(new Date())
const showComposer = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)
const now = ref(new Date())
const nextEventId = ref(100)

const draft = reactive({
  label: '',
  time: '10:00',
  endTime: '11:00',
  type: 'deepwork' as EventType
})

const eventTypes = [
  { value: 'deepwork' as EventType, label: 'Fokus', activeClass: 'border-amber-400/60 bg-amber-400/20 text-amber-300' },
  { value: 'meeting' as EventType, label: 'Meeting', activeClass: 'border-cyan-400/60 bg-cyan-400/15 text-cyan-300' },
  { value: 'routine' as EventType, label: 'Routine', activeClass: 'border-slate-500/70 bg-slate-700/50 text-slate-200' }
]

const calendars = reactive([
  { label: 'Fokus', type: 'deepwork' as EventType, enabled: true, activeClass: 'border-amber-400/60 bg-amber-400/30' },
  { label: 'Meetings', type: 'meeting' as EventType, enabled: true, activeClass: 'border-cyan-400/60 bg-cyan-400/25' },
  { label: 'Routinen', type: 'routine' as EventType, enabled: true, activeClass: 'border-slate-500/70 bg-slate-600/50' }
])

const events = ref<CalendarEvent[]>(createSeedEvents())

const selectedKey = computed(() => getDateKey(selectedDate.value))

const selectedDayLabel = computed(() => selectedDate.value.toLocaleDateString('de-DE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
}))

const selectedDayShort = computed(() => selectedDate.value.toLocaleDateString('de-DE', {
  weekday: 'short',
  day: 'numeric',
  month: 'short'
}))

const monthLabel = computed(() => selectedDate.value.toLocaleDateString('de-DE', {
  month: 'long',
  year: 'numeric'
}))

const enabledTypes = computed(() => calendars
  .filter((calendar) => calendar.enabled)
  .map((calendar) => calendar.type)
)

const selectedDayEvents = computed(() => getEventsForDate(selectedDate.value)
  .filter((event) => enabledTypes.value.includes(event.type))
  .sort((first, second) => getMinutes(first.time) - getMinutes(second.time))
)

const weekDays = computed(() => {
  const start = startOfWeek(selectedDate.value)

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(start, index)
    const dayEvents = getEventsForDate(date)

    return {
      date,
      key: getDateKey(date),
      weekday: date.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', ''),
      day: date.getDate(),
      isSelected: isSameDay(date, selectedDate.value),
      previewEvents: dayEvents.slice(0, 3)
    }
  })
})

const weekEventCount = computed(() => weekDays.value.reduce((total, day) => total + getEventsForDate(day.date).length, 0))

const monthDates = computed(() => {
  const first = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), 1)
  const start = startOfWeek(first)

  return Array.from({ length: 42 }, (_, index) => {
    const value = addDays(start, index)

    return {
      value,
      key: getDateKey(value),
      day: value.getDate(),
      inMonth: value.getMonth() === selectedDate.value.getMonth(),
      isSelected: isSameDay(value, selectedDate.value),
      eventCount: getEventsForDate(value).length
    }
  })
})

const focusDuration = computed(() => {
  const minutes = selectedDayEvents.value
    .filter((event) => event.type === 'deepwork')
    .reduce((total, event) => total + getDurationMinutes(event.time, event.endTime), 0)

  if (minutes === 0) {
    return '0 Min'
  }

  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  return hours > 0 ? `${hours} Std ${rest} Min` : `${rest} Min`
})

const isTodaySelected = computed(() => isSameDay(selectedDate.value, new Date()))

const nowPosition = computed(() => {
  const minutes = now.value.getHours() * 60 + now.value.getMinutes()
  const dayStart = timelineHours[0] * 60
  const dayEnd = (timelineHours[timelineHours.length - 1] + 1) * 60

  return ((minutes - dayStart) / (dayEnd - dayStart)) * 100
})

watch(selectedKey, () => {
  selectedEvent.value = selectedDayEvents.value[0] ?? null
  draft.time = state.today.focusStart
  draft.endTime = state.today.focusEnd
})

watch(selectedDayEvents, (dayEvents) => {
  if (!dayEvents.some((event) => event.id === selectedEvent.value?.id)) {
    selectedEvent.value = dayEvents[0] ?? null
  }
}, { immediate: true })

function createSeedEvents(): CalendarEvent[] {
  const baseEvents = state.today.blocks.map((block, index) => ({
    id: index + 1,
    date: getDateKey(today),
    time: block.time,
    endTime: block.endTime,
    type: block.type,
    label: block.label,
    note: getDefaultNote(block.type)
  }))

  return [
    ...baseEvents,
    createEvent(-2, '09:15', '10:45', 'deepwork', 'Konzept-Sprint', 'Mentiva blockt fruehe Energie fuer anspruchsvolle Planung.'),
    createEvent(-2, '13:30', '14:15', 'meeting', 'Sync mit Design', 'Kurzer Abgleich zu offenen Entscheidungen.'),
    createEvent(-1, '08:30', '09:00', 'routine', 'Planung & Inbox', 'Leichte Routine vor der ersten Fokusphase.'),
    createEvent(-1, '10:00', '12:00', 'deepwork', 'Prototyp verfeinern', 'Geschuetzter Block fuer konzentrierte Produktarbeit.'),
    createEvent(1, '09:30', '11:30', 'deepwork', 'Feature-Entwurf', 'Mentiva reserviert morgen den staerksten Fokusbereich.'),
    createEvent(1, '15:00', '15:45', 'meeting', 'Review Call', 'Meeting liegt bewusst nach der Fokuszeit.'),
    createEvent(2, '08:00', '08:45', 'routine', 'Wochenplanung', 'Ruhiger Start mit geringer kognitiver Last.'),
    createEvent(2, '11:00', '12:30', 'deepwork', 'Analyse der Check-ins', 'Auswertung neuer Datenpunkte fuer bessere Vorschlaege.'),
    createEvent(4, '14:00', '15:00', 'meeting', 'Stakeholder Update', 'Kommunikation in einem niedrigeren Energie-Fenster.'),
    createEvent(5, '10:30', '12:00', 'deepwork', 'Strategie-Dokument', 'Laengerer Schreibblock mit wenig Kontextwechsel.')
  ]
}

function createEvent(dayOffset: number, time: string, endTime: string, type: EventType, label: string, note: string): CalendarEvent {
  return {
    id: nextEventId.value++,
    date: getDateKey(addDays(today, dayOffset)),
    time,
    endTime,
    type,
    label,
    note
  }
}

function toggleComposer() {
  showComposer.value = !showComposer.value
  draft.time = state.today.focusStart
  draft.endTime = state.today.focusEnd
}

function addEvent() {
  const label = draft.label.trim()

  if (!label || getMinutes(draft.endTime) <= getMinutes(draft.time)) {
    return
  }

  const event: CalendarEvent = {
    id: nextEventId.value++,
    date: selectedKey.value,
    time: draft.time,
    endTime: draft.endTime,
    type: draft.type,
    label,
    note: getDefaultNote(draft.type)
  }

  events.value = [...events.value, event]
  selectedEvent.value = event
  draft.label = ''
  showComposer.value = false
}

function selectToday() {
  selectDate(new Date())
}

function selectDate(date: Date) {
  selectedDate.value = new Date(date)
}

function moveSelectedDay(direction: number) {
  selectDate(addDays(selectedDate.value, direction))
}

function getEventsForDate(date: Date) {
  const key = getDateKey(date)

  return events.value.filter((event) => event.date === key)
}

function getDaySummary(date: Date) {
  const dayEvents = getEventsForDate(date)

  if (dayEvents.length === 0) {
    return 'Freier Tag'
  }

  return dayEvents
    .slice()
    .sort((first, second) => getMinutes(first.time) - getMinutes(second.time))[0].label
}

function getEventPosition(startTime: string, endTime: string) {
  const dayStart = timelineHours[0] * 60
  const dayEnd = (timelineHours[timelineHours.length - 1] + 1) * 60
  const total = dayEnd - dayStart
  const start = getMinutes(startTime)
  const end = getMinutes(endTime)

  return {
    top: `${Math.max(((start - dayStart) / total) * 100, 0)}%`,
    height: `${Math.max(((end - start) / total) * 100, 8)}%`
  }
}

function getEventStyle(type: EventType) {
  return {
    deepwork: 'border-amber-400 bg-amber-400/15 text-amber-100',
    meeting: 'border-cyan-400 bg-cyan-400/10 text-cyan-100',
    routine: 'border-slate-500 bg-slate-800/80 text-slate-200'
  }[type]
}

function getEventAccent(type: EventType) {
  return {
    deepwork: 'bg-amber-400',
    meeting: 'bg-cyan-400',
    routine: 'bg-slate-500'
  }[type]
}

function getEventDot(type: EventType) {
  return {
    deepwork: 'bg-amber-400',
    meeting: 'bg-cyan-400',
    routine: 'bg-slate-500'
  }[type]
}

function getTypeLabel(type: EventType) {
  return {
    deepwork: 'Fokus',
    meeting: 'Meeting',
    routine: 'Routine'
  }[type]
}

function getDefaultNote(type: EventType) {
  return {
    deepwork: 'Dieser Termin liegt in einem Fokusfenster mit hoher mentaler Kapazitaet.',
    meeting: 'Dieser Termin ist als Austausch geplant und vermeidet deine staerkste Deep-Work-Zeit.',
    routine: 'Diese Aufgabe eignet sich fuer Zeiten mit niedrigerer kognitiver Last.'
  }[type]
}

function getDurationMinutes(startTime: string, endTime: string) {
  return getMinutes(endTime) - getMinutes(startTime)
}

function getMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

function getDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function startOfWeek(date: Date) {
  const value = new Date(date)
  const day = value.getDay() || 7

  value.setDate(value.getDate() - day + 1)
  value.setHours(0, 0, 0, 0)

  return value
}

function addDays(date: Date, days: number) {
  const value = new Date(date)

  value.setDate(value.getDate() + days)

  return value
}

function isSameDay(first: Date, second: Date) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate()
}
</script>

<style scoped>
@keyframes eventIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.expand-enter-active,
.expand-leave-active {
  overflow: hidden;
  transition: all 0.22s ease;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-4px);
}
</style>
