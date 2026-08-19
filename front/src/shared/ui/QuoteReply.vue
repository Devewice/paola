<script setup lang="ts">
defineProps<{
  author?: string
  quote?: string
}>()
</script>

<template>
  <div class="quote-reply">
    En respuesta a <strong>{{ author ?? 'Alias' }}</strong>: «{{ quote ?? 'Tip de lluvia…' }}»
  </div>
</template>
