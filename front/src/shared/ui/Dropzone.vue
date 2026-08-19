<script setup lang="ts">
defineProps<{
  title?: string
  hint?: string
}>()
</script>

<template>
  <div class="dropzone">
    <p>{{ title ?? 'Arrastra evidencia aquí' }}</p>
    <span>{{ hint ?? 'o usa Elegir archivo en Formularios' }}</span>
  </div>
</template>
