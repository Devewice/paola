<script setup lang="ts">
defineProps<{
  title?: string
  copy?: string
}>()
</script>

<template>
  <aside class="paola-wa" aria-label="WhatsApp">
    <div>
      <p class="paola-empty__kicker">WhatsApp</p>
      <p>{{ title ?? 'Únete al parche' }}</p>
      <p class="paola-ride__meta">{{ copy ?? 'Número · próximamente' }}</p>
    </div>
  </aside>
</template>
