<script setup lang="ts">
defineProps<{
  label: string
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button type="button" class="fab" :aria-label="label" @click="emit('click')">
    <slot>{{ label }}</slot>
  </button>
</template>
