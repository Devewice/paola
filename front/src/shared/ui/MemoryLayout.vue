<script setup lang="ts">
defineProps<{
  km: string
  kmLabel?: string
  participantsTitle?: string
}>()
</script>

<template>
  <div class="memory-layout">
    <div>
      <slot name="main" />
    </div>
    <div class="memory-layout__side">
      <div class="km-banner"><strong>{{ km }}</strong>{{ kmLabel ?? 'Km esta salida' }}</div>
      <div class="arsenal-block" style="margin:0;padding:12px">
        <h4 style="font-size:11px;margin:0 0 8px">{{ participantsTitle ?? 'Participantes' }}</h4>
        <slot name="participants" />
      </div>
    </div>
  </div>
</template>
