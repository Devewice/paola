<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'
import { MOTION, staggerReveal, usePaolaGsap } from '@shared/motion/index.ts'

const scope = ref<HTMLElement | null>(null)
const notifications = ref([
  'Comentario publicado · placeholder',
  'Paola respondió en tu hilo',
])

usePaolaGsap(() => {
  if (!scope.value) return
  staggerReveal(scope.value.querySelectorAll('.motion-demo-card'))
}, scope)

function replayStagger(): void {
  if (!scope.value) return
  const cards = scope.value.querySelectorAll('.motion-demo-card')
  gsap.set(cards, { y: MOTION.offset.y, opacity: 0 })
  staggerReveal(cards)
}

function addNotification(): void {
  const time = new Date().toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  })
  notifications.value.unshift(`Nueva notificación · ${time}`)
}
</script>

<template>
  <v-card variant="outlined" rounded="lg" class="mb-8">
    <v-card-text>
      <p class="text-overline text-primary mb-1">Motion · GSAP + AutoAnimate</p>
      <h2 class="text-h5 font-weight-bold mb-2">Misma biblioteca que el kit HTML</h2>
      <p class="text-body-2 text-medium-emphasis mb-6" style="max-width: 42rem">
        Entradas escalonadas con GSAP, listas con AutoAnimate y tokens en
        <code>src/shared/motion/tokens.ts</code> (reveal {{ MOTION.duration.reveal }}s,
        stagger {{ MOTION.stagger.cards }}s).
      </p>

      <div ref="scope" class="motion-demo-grid mb-6">
        <v-card
          v-for="n in 3"
          :key="n"
          class="motion-demo-card"
          variant="tonal"
          rounded="lg"
        >
          <v-card-text class="py-4">
            <div class="text-subtitle-2 font-weight-medium">Rodada placeholder {{ n }}</div>
            <p class="text-caption text-medium-emphasis mb-0 mt-1">
              Entrada stagger · power2.out
            </p>
          </v-card-text>
        </v-card>
      </div>

      <div class="d-flex flex-wrap ga-3 mb-6">
        <v-btn color="primary" variant="flat" @click="replayStagger">
          Repetir stagger
        </v-btn>
        <v-btn variant="outlined" @click="addNotification">
          Añadir notificación
        </v-btn>
      </div>

      <p class="text-caption text-medium-emphasis mb-2">Lista con AutoAnimate (panel fase 30)</p>
      <ul v-auto-animate class="motion-notify-list pa-0">
        <li v-for="(item, index) in notifications" :key="`${item}-${index}`">
          {{ item }}
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.motion-demo-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.motion-notify-list {
  list-style: none;
  margin: 0;
}

.motion-notify-list li {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  margin-bottom: 8px;
  font-size: 14px;
}
</style>
