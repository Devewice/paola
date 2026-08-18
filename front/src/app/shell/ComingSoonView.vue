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
  if (route.path === '/tienda') {
    return 'Aún no hay prendas ni colaboraciones en estantería. Cuando haya algo de verdad, se ve aquí.'
  }
  return 'Próximamente. Esta pestaña todavía no tiene contenido.'
})
const plate = computed(() => (route.path === '/tienda' ? 'Tienda' : 'Loigca'))
const mascot = computed(() =>
  route.path === '/tienda' ? '/mascota/tumbada.png' : '/mascota/lente.png',
)
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <PaolaAficheHero :kicker="title" :title="title" :plate="plate" data-reveal>
      <template #lead>{{ copy }}</template>
    </PaolaAficheHero>
    <PaolaEmpty
      compact
      data-reveal
      :title="title"
      :copy="copy"
      :mascot-src="mascot"
    />
  </article>
</template>
