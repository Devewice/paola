<script setup lang="ts">
defineProps<{
  title: string
  meta: string
}>()
</script>

<template>
  <article class="paola-denuncia">
    <p class="paola-empty__kicker">Paola Armargura</p>
    <h3 class="paola-ride__title">{{ title }}</h3>
    <p class="paola-ride__meta">{{ meta }}</p>
    <p>Constancia comunitaria. No es denuncia penal. Moderación. Sin linchamiento, menores ni doxxing.</p>
  </article>
</template>
