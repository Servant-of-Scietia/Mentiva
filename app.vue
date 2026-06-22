<template>
  <div>
    <!-- Logo Splash Screen -->
    <MentivaLogoSplash />
    
    <!-- Main App -->
    <div class="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <PhoneShell />
    </div>
  </div>
</template>

<script setup lang="ts">
import PhoneShell from './components/PhoneShell.vue'
import MentivaLogoSplash from './components/MentivaLogoSplash.vue'
</script>

<style>
html,
body {
  background-color: #f3f4f6;
}
</style>
