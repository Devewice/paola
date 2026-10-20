<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { ADMIN_TOOLS_COPY } from '@ui/adminCopy.ts'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    lead?: string
    closeLabel?: string
    /** Editores largos y tableros de datos. */
    wide?: boolean
  }>(),
  { closeLabel: ADMIN_TOOLS_COPY.close, wide: false },
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
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('admin-drawer-open', open)
    if (open) window.addEventListener('keydown', onKey)
    else window.removeEventListener('keydown', onKey)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  window.removeEventListener('keydown', onKey)
  if (props.modelValue) document.documentElement.classList.remove('admin-drawer-open')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="admin-drawer">
      <div v-if="modelValue" class="admin-drawer" @click.self="close">
        <aside
          class="admin-drawer__panel"
          :class="{ 'admin-drawer__panel--wide': wide }"
          role="dialog" aria-modal="true" :aria-label="title">
          <header class="admin-drawer__head">
            <div class="admin-drawer__titles">
              <h3>{{ title }}</h3>
              <p v-if="lead">{{ lead }}</p>
            </div>
            <button type="button" class="admin-drawer__close" :aria-label="closeLabel" @click="close">×</button>
          </header>
          <div class="admin-drawer__body">
            <slot />
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>
