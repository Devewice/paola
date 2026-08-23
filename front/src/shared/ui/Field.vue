<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    error?: string
    hint?: string
    tone?: 'plain' | 'electric'
  }>(),
  { tone: 'plain' },
)
</script>

<template>
  <div class="field" :class="{ 'field--electric': tone === 'electric' }">
    <span class="field-label">{{ label }}</span>
    <slot />
    <p v-if="error" class="field-error">{{ error }}</p>
    <p v-else-if="hint" class="field-hint">{{ hint }}</p>
  </div>
</template>
