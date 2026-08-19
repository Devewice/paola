<script setup lang="ts">
withDefaults(
  defineProps<{
    mine?: boolean
    body?: string
    photoSrc?: string
    voiceSrc?: string
    pinned?: boolean
    time?: string
    pinLabel?: string
  }>(),
  { body: '', pinLabel: 'Aviso de Paola' },
)
</script>

<template>
  <div class="chat-bubble" :class="mine ? 'chat-bubble--me' : 'chat-bubble--them'">
    <strong v-if="pinned" style="font-size: 11px; color: var(--cyan)">{{ pinLabel }}</strong>
    <template v-if="pinned"><br /></template>
    <template v-if="body">{{ body }}</template>
    <img v-if="photoSrc" class="paola-chat__photo" :src="photoSrc" alt="" />
    <audio v-if="voiceSrc" class="paola-chat__voice" :src="voiceSrc" controls />
    <span v-if="time" class="chat-bubble__time">{{ time }}</span>
  </div>
</template>
