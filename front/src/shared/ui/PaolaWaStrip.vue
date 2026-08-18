<script setup lang="ts">
defineProps<{
  title?: string
  copy?: string
}>()
</script>

<template>
  <aside class="paola-wa" aria-label="WhatsApp">
    <div class="paola-wa__body">
      <p class="paola-empty__kicker">WhatsApp</p>
      <p class="paola-wa__title">{{ title ?? 'Únete al parche' }}</p>
      <p class="paola-ride__meta">{{ copy ?? 'Número · próximamente' }}</p>
      <div v-if="$slots.default" class="paola-wa__cta">
        <slot />
      </div>
    </div>
  </aside>
</template>
