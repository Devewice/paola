<script setup lang="ts">
import { computed } from 'vue'

/** Texto para títulos brocha: los números van en placa (la brocha no trae dígitos). */
const props = defineProps<{ text: string }>()

const parts = computed(() =>
  props.text
    .split(/(\d+)/)
    .filter(Boolean)
    .map((chunk) => ({ chunk, digits: /^\d+$/.test(chunk) })),
)
</script>

<template>
  <template v-for="(part, index) in parts" :key="index">
    <span v-if="part.digits" class="brush-num">{{ part.chunk }}</span>
    <template v-else>{{ part.chunk }}</template>
  </template>
</template>
