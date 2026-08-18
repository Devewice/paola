<script setup lang="ts">
import PaolaIcon from '@ui/PaolaIcon.vue'

defineProps<{
  url: string
}>()
</script>

<template>
  <div class="paola-share">
    <input class="paola-input" :value="url" readonly />
    <button type="button" class="paola-icon-btn" aria-label="Copiar enlace">
      <PaolaIcon name="copy" :circle="false" size="sm" />
    </button>
    <button type="button" class="paola-icon-btn" aria-label="Compartir">
      <PaolaIcon name="share" :circle="false" size="sm" />
    </button>
  </div>
</template>
