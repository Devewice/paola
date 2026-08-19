<script setup lang="ts">
import { computed, ref } from 'vue'

withDefaults(
  defineProps<{
    label?: string
    accept?: string
  }>(),
  { label: 'Elegir archivo', accept: 'image/*,.pdf' },
)

const emit = defineEmits<{
  change: [file: File | null]
}>()

const fileName = ref('')
const inputId = `file-${Math.random().toString(36).slice(2, 8)}`
const displayName = computed(() => fileName.value || 'Ningún archivo seleccionado')

function onChange(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  fileName.value = file?.name ?? ''
  emit('change', file)
}
</script>

<template>
  <div class="file-picker">
    <input class="file-picker__input" :id="inputId" type="file" :accept="accept" @change="onChange" />
    <label class="file-picker__btn" :for="inputId">{{ label }}</label>
    <span class="file-picker__name" :class="{ 'is-filled': Boolean(fileName) }">{{ displayName }}</span>
  </div>
</template>
