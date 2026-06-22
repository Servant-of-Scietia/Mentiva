<template>
  <div :class="containerClass">
    <!-- Large M letter -->
    <div class="relative">
      <h1 class="text-8xl font-black tracking-tighter" :class="textClass" style="line-height: 0.9; letter-spacing: -0.05em;">
        M
      </h1>
      <!-- Underline accent -->
      <div class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" style="width: 60px; margin-top: -8px;"></div>
    </div>
    
    <!-- Mentiva text -->
    <p class="text-5xl font-black tracking-tight" :class="textClass" style="letter-spacing: -0.02em;">
      Mentiva
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'dark',
  size: 'lg'
})

const containerClass = computed(() => {
  const base = 'flex flex-col items-center justify-center'
  const bgClass = props.variant === 'dark' 
    ? 'bg-gradient-to-br from-slate-950 to-slate-900'
    : 'bg-white'
  
  const sizeClass = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
  }[props.size]
  
  return `${base} ${bgClass} ${sizeClass}`
})

const textClass = computed(() => {
  return props.variant === 'dark' ? 'text-white' : 'text-slate-900'
})
</script>
