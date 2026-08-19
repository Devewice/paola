<script setup lang="ts">
defineProps<{
  modelValue: string
  reasons: readonly string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="reason-chips">
    <button
      v-for="reason in reasons"
      :key="reason"
      type="button"
      :class="{ 'is-on': modelValue === reason }"
      @click="emit('update:modelValue', reason)"
    >{{ reason }}</button>
  </div>
</template>
