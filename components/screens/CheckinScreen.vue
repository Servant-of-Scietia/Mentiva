<template>
  <div class="h-full overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 pb-24 text-slate-100">
    <header class="mb-5">
      <div class="mb-4 flex items-center gap-3">
        <div class="text-2xl font-black text-slate-100">M</div>
        <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Mentiva</p>
        <div class="ml-2 h-px flex-1 bg-gradient-to-r from-amber-500/60 to-transparent"></div>
      </div>

      <h1 class="text-3xl font-black leading-tight text-slate-100">Check-in</h1>
      <p class="mt-2 text-sm leading-relaxed text-slate-400">6 kurze Fragen. Dauert weniger als 30 Sekunden.</p>
    </header>

    <Transition name="fade" mode="out-in">
      <main v-if="!checkIn.submitted" key="form" class="space-y-4">
        <section class="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
          <p class="text-sm leading-relaxed text-amber-100">
            Deine Angaben helfen Mentiva, die heutige Leistungsprognose an deinen aktuellen Zustand anzupassen.
          </p>
        </section>

        <section class="space-y-3">
          <article
            v-for="slider in sliders"
            :key="slider.key"
            class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md"
          >
            <div class="mb-4 flex items-start justify-between gap-3">
              <label :for="slider.key" class="text-sm font-bold leading-snug text-slate-100">{{ slider.label }}</label>
              <span class="shrink-0 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm font-black text-amber-300">
                {{ checkIn[slider.key] }}/10
              </span>
            </div>

            <input
              :id="slider.key"
              v-model.number="checkIn[slider.key]"
              type="range"
              min="1"
              max="10"
              class="mentiva-slider h-3 w-full cursor-pointer appearance-none rounded-full"
            />

            <div class="mt-3 flex justify-between text-xs font-bold text-slate-500">
              <span>{{ slider.low }}</span>
              <span>{{ slider.high }}</span>
            </div>
          </article>
        </section>

        <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
          <h2 class="text-sm font-black text-slate-100">Was spielt heute eine Rolle?</h2>
          <div class="mt-3 flex flex-wrap gap-2">
            <button
              v-for="tag in contextTags"
              :key="tag"
              type="button"
              class="rounded-full border px-3 py-2 text-xs font-bold transition active:scale-95"
              :class="isTagSelected(tag) ? 'border-amber-400/50 bg-amber-400/15 text-amber-300' : 'border-slate-800/60 bg-slate-950/35 text-slate-400'"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </section>

        <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
          <label for="checkin-note" class="text-sm font-black text-slate-100">Noch etwas?</label>
          <textarea
            id="checkin-note"
            v-model="checkIn.note"
            rows="3"
            class="mt-3 max-h-24 w-full resize-none rounded-xl border border-slate-800/60 bg-slate-950/50 px-3 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-400"
            placeholder="z. B. schlecht geschlafen, wichtige Deadline, sehr motiviert"
          />
        </section>

        <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs font-bold uppercase tracking-widest text-slate-500">Aktueller Zustand</p>
              <h2 class="mt-1 text-xl font-black text-amber-400">{{ readinessLabel }}</h2>
            </div>
            <span class="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-lg font-black text-amber-300">
              {{ formattedReadinessScore }}/10
            </span>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-slate-400">
            Mentiva nutzt deine Angaben für die heutige Prognose.
          </p>
        </section>

        <button
          type="button"
          class="w-full rounded-2xl bg-amber-400 py-4 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20 transition active:scale-[0.98]"
          @click="handleSubmit"
        >
          Check-in speichern
        </button>
      </main>

      <main v-else key="success" class="space-y-4">
        <section class="rounded-2xl border border-amber-400/25 bg-slate-900/60 p-5 shadow-lg shadow-slate-950/30 backdrop-blur-md">
          <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Gespeichert</p>
          <h2 class="mt-2 text-2xl font-black text-slate-100">Check-in gespeichert</h2>
          <p class="mt-3 text-sm leading-relaxed text-slate-400">Mentiva passt deine heutige Prognose an.</p>
        </section>

        <section class="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
          <h3 class="text-sm font-black text-slate-100">Zusammenfassung</h3>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <div
              v-for="item in summaryItems"
              :key="item.label"
              class="rounded-xl border border-slate-800/60 bg-slate-950/45 px-3 py-3"
            >
              <p class="text-[10px] font-bold uppercase text-slate-500">{{ item.label }}</p>
              <p class="mt-1 text-sm font-black text-slate-100">{{ item.value }}</p>
            </div>
          </div>
        </section>

        <button
          type="button"
          class="w-full rounded-2xl border border-slate-800/60 bg-slate-900/50 py-4 text-sm font-black text-amber-300 transition active:scale-[0.98]"
          @click="checkIn.submitted = false"
        >
          Erneut bearbeiten
        </button>
      </main>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useMentivaDemo } from '../../composables/useMentivaDemo'

type SliderKey = 'energy' | 'focus' | 'stress' | 'motivation'

const { addCheckin } = useMentivaDemo()

const checkIn = reactive<{
  energy: number
  focus: number
  stress: number
  motivation: number
  selectedTags: string[]
  note: string
  submitted: boolean
}>({
  energy: 6,
  focus: 6,
  stress: 4,
  motivation: 6,
  selectedTags: [],
  note: '',
  submitted: false
})

const sliders: Array<{ key: SliderKey; label: string; low: string; high: string }> = [
  { key: 'energy', label: 'Wie viel Energie hast du gerade?', low: 'wenig', high: 'viel' },
  { key: 'focus', label: 'Wie gut kannst du dich gerade konzentrieren?', low: 'schlecht', high: 'sehr gut' },
  { key: 'stress', label: 'Wie gestresst fühlst du dich gerade?', low: 'gar nicht', high: 'sehr' },
  { key: 'motivation', label: 'Wie motiviert bist du gerade?', low: 'wenig', high: 'sehr' }
]

const contextTags = [
  'Wenig Schlaf',
  'Viel zu tun',
  'Zeitdruck',
  'Gute Laune',
  'Schlechte Laune',
  'Müde',
  'Unruhig',
  'Klarer Kopf',
  'Sport gemacht',
  'Koffein',
  'Krank/angeschlagen',
  'Ungewöhnlicher Tag'
]

const readinessScore = computed(() => (
  checkIn.energy * 0.3
  + checkIn.focus * 0.3
  + checkIn.motivation * 0.25
  + (11 - checkIn.stress) * 0.15
))

const formattedReadinessScore = computed(() => readinessScore.value.toFixed(1))

const readinessLabel = computed(() => {
  if (readinessScore.value >= 8) {
    return 'stark'
  }

  if (readinessScore.value >= 6) {
    return 'stabil'
  }

  if (readinessScore.value >= 4) {
    return 'angespannt'
  }

  return 'niedrig'
})

const summaryItems = computed(() => [
  { label: 'Energie', value: `${checkIn.energy}/10` },
  { label: 'Fokus', value: `${checkIn.focus}/10` },
  { label: 'Stress', value: `${checkIn.stress}/10` },
  { label: 'Motivation', value: `${checkIn.motivation}/10` },
  { label: 'Aktueller Zustand', value: readinessLabel.value }
])

function toggleTag(tag: string) {
  if (isTagSelected(tag)) {
    checkIn.selectedTags = checkIn.selectedTags.filter((item) => item !== tag)
    return
  }

  checkIn.selectedTags.push(tag)
}

function isTagSelected(tag: string) {
  return checkIn.selectedTags.includes(tag)
}

function handleSubmit() {
  addCheckin(checkIn.energy, 11 - checkIn.stress)
  checkIn.submitted = true
}
</script>

<style scoped>
.mentiva-slider {
  background: linear-gradient(to right, #f59e0b, #475569);
}

.mentiva-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 26px;
  height: 26px;
  border-radius: 9999px;
  background: #f59e0b;
  border: 3px solid #0f172a;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.35);
}

.mentiva-slider::-moz-range-thumb {
  width: 26px;
  height: 26px;
  border-radius: 9999px;
  background: #f59e0b;
  border: 3px solid #0f172a;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.35);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
