<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <button
    type="button"
    class="wish-btn"
    :class="{ 'is-on': modelValue }"
    aria-label="Favorito"
    @click="$emit('update:modelValue', !modelValue)"
  >
    {{ modelValue ? '♥' : '♡' }}
  </button>
</template>
