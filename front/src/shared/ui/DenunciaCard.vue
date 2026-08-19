<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    meta: string
    status?: string
    compact?: boolean
  }>(),
  { compact: false },
)
</script>

<template>
  <article class="denuncia-card">
    <span v-if="status" class="denuncia-card__status">{{ status }}</span>
    <h3 v-if="!compact" class="denuncia-card__title">{{ title }}</h3>
    <p v-if="compact" style="margin: 0">
      <strong>{{ title }}</strong>
      · {{ meta }}
    </p>
    <p v-else class="denuncia-card__meta">{{ meta }}</p>
    <p v-if="!compact">
      Constancia comunitaria. No es denuncia penal. Moderación. Sin linchamiento, menores ni doxxing.
    </p>
  </article>
</template>
