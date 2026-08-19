<script setup lang="ts">
import Select from '@ui/Select.vue'

defineProps<{
  count?: string
  sortModel: string
  sortOptions: readonly { value: string; label: string }[]
  style?: string | Record<string, string>
}>()

defineEmits<{
  'update:sortModel': [value: string]
}>()
</script>

<template>
  <div class="sort-toolbar" :style="style">
    <p class="meta">{{ count ?? '3 rodadas' }}</p>
    <Select :model-value="sortModel" :options="sortOptions" @update:model-value="$emit('update:sortModel', $event)" />
  </div>
</template>
