<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLink from '@ui/AppLink.vue'
import Button from '@ui/Button.vue'

export type MegaHeaderLink = {
  readonly label: string
  readonly to?: string
  readonly href?: string
}

export type MegaHeaderColumn = {
  readonly title: string
  readonly copy?: string
  readonly links: readonly MegaHeaderLink[]
}

export type MegaHeaderItem = {
  readonly label: string
  readonly to: string
  readonly lead?: string
  readonly cta?: string
  readonly columns?: readonly MegaHeaderColumn[]
}

const props = withDefaults(
  defineProps<{
    items: readonly MegaHeaderItem[]
    logoSrc?: string
    accountTo?: string
    accountLabel?: string
    menuLabel?: string
    closeLabel?: string
    embed?: boolean
    whatsapp?: { href: string; label: string }
  }>(),
  { logoSrc: '/logo.png', accountLabel: 'Cuenta', menuLabel: 'Menú', closeLabel: 'Cerrar', embed: false },
)

const route = useRoute()
const openId = ref<string | null>(null)
const mobileOpen = ref(false)
const root = ref<HTMLElement | null>(null)
let leaveTimer = 0

const activeItem = computed(() => props.items.find((item) => item.label === openId.value) ?? null)

const panelColumns = computed((): readonly MegaHeaderColumn[] => {
  if (mobileOpen.value) {
    return props.items.flatMap((item) => item.columns ?? [])
  }
  return activeItem.value?.columns ?? []
})

const panelOpen = computed(() => Boolean(mobileOpen.value || activeItem.value?.columns?.length))

function isOn(item: MegaHeaderItem): boolean {
  if (item.to === '/') return route.path === '/'
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}

function cancelClose(): void {
  window.clearTimeout(leaveTimer)
}

function openPanel(label: string): void {
  cancelClose()
  const item = props.items.find((entry) => entry.label === label)
  openId.value = item?.columns?.length ? label : null
}

function scheduleClose(): void {
  if (mobileOpen.value) return
  window.clearTimeout(leaveTimer)
  leaveTimer = window.setTimeout(() => {
    openId.value = null
  }, 140)
}

function toggleMobile(): void {
  mobileOpen.value = !mobileOpen.value
  if (mobileOpen.value) openId.value = null
}

function closeAll(): void {
  openId.value = null
  mobileOpen.value = false
}

function onDocClick(event: MouseEvent): void {
  if (!root.value?.contains(event.target as Node)) closeAll()
}

function onKey(event: KeyboardEvent): void {
  if (event.key === 'Escape') closeAll()
}

watch(
  () => route.fullPath,
  () => closeAll(),
)

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  window.clearTimeout(leaveTimer)
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header
    ref="root"
    class="mega-header"
    :class="{ 'is-open': panelOpen, 'mega-header--embed': embed }"
    @mouseleave="scheduleClose"
  >
    <div class="mega-header__bar">
      <router-link class="mega-header__logo" to="/" aria-label="Paola, inicio">
        <img :src="logoSrc" alt="Paola — Rodando con propósito" width="48" height="48" />
      </router-link>

      <nav class="mega-header__nav" aria-label="Pestañas">
        <div
          v-for="item in items"
          :key="item.label"
          class="mega-header__item"
          @mouseenter="openPanel(item.label)"
        >
          <router-link
            :to="item.to"
            class="mega-header__link"
            :class="{ 'is-on': isOn(item), 'has-panel': Boolean(item.columns?.length) }"
            :aria-expanded="item.columns?.length ? openId === item.label : undefined"
            :aria-haspopup="item.columns?.length ? 'true' : undefined"
          >
            {{ item.label }}
          </router-link>
        </div>
      </nav>

      <div class="mega-header__cta">
        <Button v-if="accountTo" variant="ghost" size="sm" :to="accountTo">{{ accountLabel }}</Button>
        <Button
          v-if="whatsapp"
          size="sm"
          :href="whatsapp.href"
          target="_blank"
        >{{ whatsapp.label }}</Button>
        <button
          class="mega-header__burger"
          type="button"
          :aria-expanded="mobileOpen"
          aria-controls="mega-header-panel"
          @click.stop="toggleMobile"
        >
          {{ mobileOpen ? closeLabel : menuLabel }}
        </button>
      </div>
    </div>

    <div
      v-if="panelOpen"
      class="mega-header__veil"
      aria-hidden="true"
      @click="closeAll"
    />
    <div
      v-if="panelOpen"
      id="mega-header-panel"
      class="mega-header__panel"
      @mouseenter="cancelClose"
    >
      <div class="mega-header__panel-inner">
        <section v-if="activeItem && !mobileOpen" class="mega-header__featured">
          <slot name="widget" :item="activeItem">
            <h3>{{ activeItem.label }}</h3>
            <p v-if="activeItem.lead" class="sm" style="color: var(--muted); margin: 0 0 16px">{{ activeItem.lead }}</p>
            <Button size="sm" :to="activeItem.to">{{ activeItem.cta ?? `Ir a ${activeItem.label}` }}</Button>
          </slot>
        </section>
        <div class="mega-header__cols" :class="{ 'mega-header__cols--mobile': mobileOpen }">
          <section v-for="col in panelColumns" :key="col.title">
            <h5>{{ col.title }}</h5>
            <p v-if="col.copy" class="meta" style="margin: 0 0 10px">{{ col.copy }}</p>
            <ul>
              <li v-for="link in col.links" :key="link.label">
                <AppLink :to="link.to" :href="link.href">{{ link.label }}</AppLink>
              </li>
            </ul>
          </section>
          <section v-if="whatsapp">
            <h5>WhatsApp</h5>
            <p class="meta" style="margin: 0 0 10px">El chat del día a día. No se apaga.</p>
            <ul>
              <li>
                <AppLink :href="whatsapp.href" target="_blank">{{ whatsapp.label }}</AppLink>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </header>
</template>
