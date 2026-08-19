<script setup lang="ts">
defineProps<{
  title: string
  outing: string
  note?: string
}>()
</script>

<template>
  <div class="print-ticket">
    <strong>{{ title }}</strong><br />
    Ticket #0000<br />
    {{ outing }}
    <hr />
    Presentar en salida · no transferible sin aviso
    <hr />
    <small>{{ note ?? 'Placeholder · sistema propio cupo' }}</small>
  </div>
</template>
