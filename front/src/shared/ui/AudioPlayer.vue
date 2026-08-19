<script setup lang="ts">
defineProps<{
  time?: string
  note?: string
}>()
</script>

<template>
  <div>
    <div class="audio-player">
      <button type="button" class="audio-player__btn" aria-label="Play">▶</button>
      <div class="audio-player__bar"><span /></div>
      <span class="audio-player__time">{{ time ?? '0:00 / —:—' }}</span>
    </div>
    <p v-if="note" class="meta" style="margin-top: 8px">{{ note }}</p>
  </div>
</template>
