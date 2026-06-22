<template>
  <div class="relative group">

    <div
      :class="[
        'flex items-center gap-4 p-5 rounded-2xl transition-all duration-200',
        'hover:scale-[1.02] active:scale-[0.98] cursor-pointer',
        'shadow-md hover:shadow-lg border-l-4 bg-slate-900/40 backdrop-blur-md',
        typeStyles[type].border
      ]"
    >

      <!-- time -->
      <div class="text-left flex-shrink-0">
        <div class="font-bold text-lg leading-none text-slate-100">
          {{ time }}
        </div>
        <div class="text-xs text-slate-400 mt-1">
          {{ endTime }}
        </div>
      </div>

      <!-- content -->
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-sm text-slate-100 truncate">
          {{ label }}
        </div>
        <div class="text-xs mt-0.5 text-slate-400 capitalize">
          {{ type }}
        </div>
      </div>

      <!-- accent dot -->
      <div
        :class="[
          'w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-125',
          typeStyles[type].accent
        ]"
      />

    </div>

    <!-- left indicator -->
    <div
      :class="[
        'absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl',
        typeStyles[type].bar
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
    border: 'border-amber-400/60',
    bar: 'bg-amber-400',
    accent: 'bg-amber-400'
  },
  meeting: {
    border: 'border-slate-600/60',
    bar: 'bg-slate-500',
    accent: 'bg-slate-500'
  },
  routine: {
    border: 'border-slate-700/50',
    bar: 'bg-slate-600',
    accent: 'bg-slate-600'
  }
}
</script>