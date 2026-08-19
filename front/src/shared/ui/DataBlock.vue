<script setup lang="ts">
defineProps<{
  label: string
  value?: string
  icon?: string
}>()
</script>

<template>
  <div class="data-block">
    <span v-if="icon || $slots.icon" class="icon" aria-hidden="true">
      <slot name="icon">{{ icon }}</slot>
    </span>
    <div>
      <p class="meta">{{ label }}</p>
      <strong v-if="value">{{ value }}</strong>
      <slot v-else />
    </div>
  </div>
</template>
