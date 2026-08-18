<script setup lang="ts">
import PaolaAlert from '@ui/PaolaAlert.vue'
import PaolaButton from '@ui/PaolaButton.vue'
</script>

<template>
  <article class="paola-comparendo">
    <p class="paola-empty__kicker">Moto Loigca</p>
    <h3 class="paola-ride__title">Comparendo</h3>
    <p class="paola-ride__meta">Educación vial. Esto no es un trámite ni una autoridad.</p>
    <PaolaAlert tone="warn">
      Paola no representa comparendos. El enlace oficial va aquí cuando esté definido.
    </PaolaAlert>
    <PaolaButton variant="ghost" size="sm">Sitio oficial · próximamente</PaolaButton>
  </article>
</template>
