<script setup lang="ts">
import Button from '@ui/Button.vue'

defineProps<{
  meta?: string
  style?: string | Record<string, string>
}>()
</script>

<template>
  <div class="pager-text" :style="style">
    <Button variant="ghost" size="sm">← Anterior</Button>
    <span class="meta">{{ meta ?? 'Memorias · pág. 2 de 5' }}</span>
    <Button variant="ghost" size="sm">Siguiente →</Button>
  </div>
</template>
