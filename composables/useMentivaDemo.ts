import { reactive, ref } from 'vue'

interface TimeBlock {
  time: string
  endTime: string
  type: 'deepwork' | 'meeting' | 'routine'
  label: string
}

interface TrendDay {
  day: number
  accuracy: number
  note: string
}

interface MentivaState {
  currentScreen: 'dashboard' | 'checkin' | 'week' | 'calendar'
  today: {
    focusStart: string
    focusEnd: string
    blocks: TimeBlock[]
  }
  weekTrend: TrendDay[]
  checkins: Array<{ energy: number; sleep: number; timestamp: string }>
  showOnboarding: boolean
}

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
  showOnboarding: true
})

let lastSuccessMessage = ref('')
let showSuccessMessage = ref(false)

export function useMentivaDemo() {
  function goTo(screen: 'dashboard' | 'checkin' | 'week' | 'calendar') {
    state.currentScreen = screen
  }

  function addCheckin(energy: number, sleep: number) {
    state.checkins.push({
      energy,
      sleep,
      timestamp: new Date().toISOString()
    })
    // Show success message
    lastSuccessMessage.value = `Danke! Deine Vorhersage für morgen wird ${energy > 7 ? 'noch' : ''} genauer.`
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 2000)
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
    hideOnboarding,
    isInFocusTime,
    lastSuccessMessage,
    showSuccessMessage
  }
}
