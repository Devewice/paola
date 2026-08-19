<script setup lang="ts">
defineProps<{
  count?: string
  modelValue: 'grid' | 'list'
}>()

defineEmits<{
  'update:modelValue': [value: 'grid' | 'list']
}>()
</script>

<template>
  <div class="toolbar-row" style="margin-bottom:12px">
    <span>{{ count ?? '— productos' }}</span>
    <div class="view-toggle">
      <button type="button" :class="{ 'is-on': modelValue === 'grid' }" @click="$emit('update:modelValue', 'grid')">▦</button>
      <button type="button" :class="{ 'is-on': modelValue === 'list' }" @click="$emit('update:modelValue', 'list')">☰</button>
    </div>
  </div>
</template>
