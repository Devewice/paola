<script setup lang="ts">
defineProps<{
  following?: boolean
  label?: string
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button type="button" class="follow-btn" :class="{ 'is-on': following }" @click="emit('click')">
    {{ following ? 'Siguiendo' : (label ?? 'Seguir') }}
  </button>
</template>
