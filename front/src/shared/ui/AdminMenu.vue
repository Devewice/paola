<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { AdminMenuItem } from '@ui/adminCopy.ts'

/** Caja de herramientas: acciones secundarias de una fila del panel. */
defineProps<{
  label: string
  items: readonly AdminMenuItem[]
}>()

const emit = defineEmits<{ select: [id: string] }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function pick(item: AdminMenuItem): void {
  if (item.disabled) return
  open.value = false
  emit('select', item.id)
}

function onDocClick(event: MouseEvent): void {
  if (!root.value?.contains(event.target as Node)) open.value = false
}

function onKey(event: KeyboardEvent): void {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div ref="root" class="admin-menu" :class="{ 'is-open': open }">
    <button
      type="button"
      class="btn btn-ghost btn-sm admin-menu__toggle"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click.stop="open = !open"
    >
      {{ label }}
      <span class="admin-menu__caret" aria-hidden="true">▾</span>
    </button>
    <div v-if="open" class="admin-menu__list" role="menu">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        role="menuitem"
        class="admin-menu__item"
        :class="{ 'admin-menu__item--danger': item.tone === 'danger' }"
        :disabled="item.disabled"
        @click="pick(item)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
