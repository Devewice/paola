<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import Button from '@ui/Button.vue'
import RideCard from '@ui/RideCard.vue'
import { MOTION } from '@shared/motion/tokens.ts'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'

gsap.registerPlugin(ScrollTrigger)

const staggerRoot = ref<HTMLElement | null>(null)
const scrollRoot = ref<HTMLElement | null>(null)
const [notifyList] = useAutoAnimate<HTMLElement>()

function runStaggerDemo(): void {
  const cards = staggerRoot.value?.querySelectorAll('.motion-ride-card')
  if (!cards?.length) return
  if (prefersReducedMotion()) {
    gsap.set(cards, { opacity: 1, y: 0, clearProps: 'transform' })
    return
  }
  gsap.fromTo(
    cards,
    { y: MOTION.offset.y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: MOTION.duration.reveal,
      stagger: MOTION.stagger.cards,
      ease: MOTION.ease.enter,
    },
  )
}

function replayStagger(): void {
  const cards = staggerRoot.value?.querySelectorAll('.motion-ride-card')
  if (!cards?.length) return
  gsap.set(cards, { y: MOTION.offset.y, opacity: 0 })
  runStaggerDemo()
}

function addNotification(): void {
  const list = notifyList.value
  if (!list) return
  const li = document.createElement('li')
  const time = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  li.textContent = `Notificación placeholder · ${time}`
  list.insertBefore(li, list.firstChild)
}

onMounted(() => {
  runStaggerDemo()
  if (prefersReducedMotion()) {
    gsap.set(scrollRoot.value?.querySelectorAll('.motion-reveal-block') ?? [], { opacity: 1, y: 0 })
    return
  }
  gsap.utils.toArray<HTMLElement>(scrollRoot.value?.querySelectorAll('.motion-reveal-block') ?? []).forEach((block) => {
    gsap.from(block, {
      scrollTrigger: { trigger: block, start: 'top 88%', once: true },
      y: 20,
      opacity: 0,
      duration: MOTION.duration.reveal,
      ease: MOTION.ease.enter,
    })
  })
})
</script>

<template>
  <div class="grid grid-2" style="margin-bottom:24px">
    <div class="card">
      <p class="motion-stack-label">GSAP · stagger rodadas</p>
      <div ref="staggerRoot" class="motion-demo-grid">
        <RideCard class="motion-ride-card" title="Anapoima · placeholder" meta="84 km · cupo —" hide-cta />
        <RideCard class="motion-ride-card" title="Primera rodada" meta="Próximamente" hide-cta />
        <RideCard class="motion-ride-card" title="Memoria parche" meta="Cronológico" hide-cta />
      </div>
      <Button size="sm" @click="replayStagger">Repetir entrada</Button>
    </div>

    <div class="card">
      <p class="motion-stack-label">AutoAnimate · panel notificaciones</p>
      <ul ref="notifyList" class="motion-notify-list">
        <li>Comentario publicado · placeholder</li>
        <li>Te respondieron en tu hilo</li>
      </ul>
      <Button variant="ghost" size="sm" style="margin-top:12px" @click="addNotification">Simular notificación</Button>
    </div>
  </div>

  <div class="card">
    <p class="motion-stack-label">GSAP ScrollTrigger · reveal al scroll</p>
    <p class="meta" style="margin:0 0 12px">Una vez por bloque · sin parallax circo · respeta <code>prefers-reduced-motion</code></p>
    <div ref="scrollRoot" class="motion-scroll-zone">
      <div class="motion-reveal-block">Bloque Inicio · tablero del día</div>
      <div class="motion-reveal-block">Bloque Parchese · próxima rodada</div>
      <div class="motion-reveal-block">Bloque Comunidad · feed cronológico (fase 39)</div>
    </div>
  </div>
</template>
