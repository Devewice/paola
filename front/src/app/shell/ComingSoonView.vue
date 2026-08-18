<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import PaolaAficheHero from '@ui/PaolaAficheHero.vue'
import PaolaEmpty from '@ui/PaolaEmpty.vue'

const route = useRoute()
const bindReveal = usePageReveal()

const title = computed(() => String(route.meta.title ?? 'Próximamente'))
const copy = computed(() => {
  if (route.path === '/tu-voz') {
    return 'Todavía no hay un tip publicado. El hueco queda; no se fuerza una denuncia.'
  }
  return 'Próximamente. Esta pestaña todavía no tiene contenido.'
})
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <PaolaAficheHero :kicker="title" :title="title" plate="Loigca" data-reveal>
      <template #lead>{{ copy }}</template>
    </PaolaAficheHero>
    <PaolaEmpty compact data-reveal :title="title" :copy="copy" mascot-src="/mascota/lente.png" />
  </article>
</template>
