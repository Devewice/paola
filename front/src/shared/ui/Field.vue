<script setup lang="ts">
defineProps<{
  label: string
  error?: string
  hint?: string
}>()
</script>

<template>
  <div class="field">
    <span class="field-label">{{ label }}</span>
    <slot />
    <p v-if="error" class="field-error">{{ error }}</p>
    <p v-else-if="hint" class="field-hint">{{ hint }}</p>
  </div>
</template>
