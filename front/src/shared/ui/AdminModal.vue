<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { ADMIN_TOOLS_COPY } from '@ui/adminCopy.ts'

/** Confirmaciones y avisos del panel; va por encima del `AdminDrawer`. */
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    copy?: string
    tone?: 'default' | 'danger'
    closeLabel?: string
  }>(),
  { tone: 'default', closeLabel: ADMIN_TOOLS_COPY.close },
)

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

function close(): void {
  emit('update:modelValue', false)
}

function onKey(event: KeyboardEvent): void {
  if (event.key === 'Escape') close()
}

watch(
  () => props.modelValue,
  (open) => {
    if (typeof window === 'undefined') return
    if (open) window.addEventListener('keydown', onKey)
    else window.removeEventListener('keydown', onKey)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="admin-modal">
      <div v-if="modelValue" class="admin-modal" @click.self="close">
        <section
          class="admin-modal__box"
          :class="{ 'admin-modal__box--danger': tone === 'danger' }"
          role="alertdialog"
          aria-modal="true"
          :aria-label="title"
        >
          <header class="admin-modal__head">
            <h3>{{ title }}</h3>
            <button type="button" class="admin-drawer__close" :aria-label="closeLabel" @click="close">×</button>
          </header>
          <p v-if="copy" class="admin-modal__copy">{{ copy }}</p>
          <slot />
          <footer v-if="$slots.actions" class="admin-modal__actions">
            <slot name="actions" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
