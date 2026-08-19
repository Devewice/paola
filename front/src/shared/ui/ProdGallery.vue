<script setup lang="ts">
defineProps<{
  modelValue: string
  views: readonly string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="prod-gallery">
    <div class="prod-gallery__main">{{ modelValue }}</div>
    <div class="prod-gallery__thumbs">
      <button
        v-for="(view, index) in views"
        :key="view"
        type="button"
        :class="{ 'is-on': modelValue === view }"
        @click="emit('update:modelValue', view)"
      >{{ index + 1 }}</button>
    </div>
  </div>
</template>
