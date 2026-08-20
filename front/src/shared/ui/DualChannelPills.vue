<script setup lang="ts">
withDefaults(
  defineProps<{
    web?: string
    wa?: string
  }>(),
  {
    web: 'Web',
    wa: 'WhatsApp',
  },
)
</script>

<template>
  <div class="dual-channel">
    <span class="dual-channel__pill dual-channel__pill--web">{{ web }}</span>
    <span class="dual-channel__pill dual-channel__pill--wa">{{ wa }}</span>
  </div>
</template>
