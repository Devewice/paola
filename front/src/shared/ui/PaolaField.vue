<script setup lang="ts">
defineProps<{
  label: string
  error?: string
}>()
</script>

<template>
  <label class="paola-field">
    <span class="paola-field__label">{{ label }}</span>
    <slot />
    <span v-if="error" class="paola-field-error">{{ error }}</span>
  </label>
</template>
