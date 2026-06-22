<template>
  <div class="relative group">
    <div
      :class="[
        'flex items-center gap-4 p-5 rounded-2xl transition-all duration-200',
        'hover:scale-[1.02] active:scale-[0.98] cursor-pointer',
        'shadow-md hover:shadow-lg border-l-4',
        typeStyles[type].bg
      ]"
    >
      <div class="text-left flex-shrink-0">
        <div class="font-bold text-lg leading-none" :class="typeStyles[type].text">{{ time }}</div>
        <div class="text-xs opacity-60 mt-1" :class="typeStyles[type].text">{{ endTime }}</div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="font-semibold text-sm truncate" :class="typeStyles[type].text">{{ label }}</div>
        <div class="text-xs opacity-70 capitalize mt-0.5" :class="typeStyles[type].text">{{ type }}</div>
      </div>

      <div
        :class="[
          'w-3 h-3 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform duration-200',
          typeStyles[type].accent
        ]"
      />
    </div>

    <div
      :class="[
        'absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl',
        typeStyles[type].border
      ]"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  time: string
  endTime: string
  type: 'deepwork' | 'meeting' | 'routine'
  label: string
}>()

const typeStyles = {
  deepwork: {
    bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
    text: 'text-amber-900',
    accent: 'bg-amber-400 group-hover:bg-amber-500',
    border: 'bg-amber-400'
  },
  meeting: {
    bg: 'bg-gradient-to-r from-slate-100 to-slate-200',
    text: 'text-slate-700',
    accent: 'bg-slate-400 group-hover:bg-slate-500',
    border: 'bg-slate-400'
  },
  routine: {
    bg: 'bg-gradient-to-r from-neutral-100 to-neutral-200',
    text: 'text-neutral-600',
    accent: 'bg-neutral-400 group-hover:bg-neutral-500',
    border: 'bg-neutral-400'
  }
}
</script>
