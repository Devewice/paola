<script setup lang="ts">
defineProps<{
  following?: boolean
  label?: string
}>()
</script>

<template>
  <button type="button" class="paola-btn paola-btn--ghost paola-btn--sm">
    {{ following ? 'Siguiendo' : (label ?? 'Seguir') }}
  </button>
</template>
