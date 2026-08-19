<script setup lang="ts">
defineProps<{
  kicker: string
  title: string
  copy: string
}>()
</script>

<template>
  <div class="hero-split">
    <div class="hero-split__media" aria-hidden="true" />
    <div class="hero-split__body">
      <p class="meta" style="margin: 0">{{ kicker }}</p>
      <h3 class="kit" style="margin: 0">{{ title }}</h3>
      <p class="sm" style="color: var(--muted); margin: 0">{{ copy }}</p>
      <slot />
    </div>
  </div>
</template>
