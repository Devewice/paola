<script setup lang="ts">
defineProps<{
  copy: string
  officialHref?: string
  officialLabel?: string
}>()
</script>

<template>
  <div class="edu-card">
    {{ copy }}
    <a v-if="officialHref" class="edu-card__official" :href="officialHref">{{ officialLabel ?? '→ Fuente oficial' }}</a>
  </div>
</template>
