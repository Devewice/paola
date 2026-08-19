<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Button from '@ui/Button.vue'

defineProps<{
  label?: string
  items: readonly string[]
}>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function toggle(): void {
  open.value = !open.value
}

function onDocClick(event: MouseEvent): void {
  if (!root.value?.contains(event.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="root" class="drop" :class="{ open }">
    <Button variant="dark" @click.stop="toggle">{{ label ?? 'Menú drop ▾' }}</Button>
    <div class="drop-menu">
      <button v-for="item in items" :key="item" type="button">{{ item }}</button>
    </div>
  </div>
</template>
