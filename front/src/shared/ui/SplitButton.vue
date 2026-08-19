<script setup lang="ts">
import Button from '@ui/Button.vue'
</script>

<template>
  <div class="split-btn">
    <Button><slot /></Button>
    <button type="button" class="split-btn__more" aria-label="Más">▾</button>
  </div>
</template>
