<script setup lang="ts">
import IconBtn from '@ui/IconBtn.vue'

defineProps<{
  code: string
}>()
</script>

<template>
  <div class="code-copy">
    <code>{{ code }}</code>
    <IconBtn name="copy" label="Copiar código" />
  </div>
</template>
