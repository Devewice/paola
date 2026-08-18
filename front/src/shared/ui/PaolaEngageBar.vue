<script setup lang="ts">
import PaolaIcon from '@ui/PaolaIcon.vue'
</script>

<template>
  <div class="paola-share" aria-label="Reacciones">
    <button type="button" class="paola-icon-btn" aria-label="Me late">
      <PaolaIcon name="heart" :circle="false" size="sm" />
    </button>
    <button type="button" class="paola-icon-btn" aria-label="Estuve ahí">
      <PaolaIcon name="camera" :circle="false" size="sm" />
    </button>
    <button type="button" class="paola-icon-btn" aria-label="Compartir">
      <PaolaIcon name="share" :circle="false" size="sm" />
    </button>
  </div>
</template>
