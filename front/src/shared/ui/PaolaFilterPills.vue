<script setup lang="ts">
defineProps<{
  modelValue: string
  pills: readonly { id: string; label: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="paola-pills" role="group">
    <button
      v-for="pill in pills"
      :key="pill.id"
      type="button"
      class="paola-chip"
      :class="modelValue === pill.id ? 'paola-chip--abierto' : 'paola-chip--cerrado'"
      @click="emit('update:modelValue', pill.id)"
    >
      {{ pill.label }}
    </button>
  </div>
</template>
