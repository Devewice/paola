<script setup lang="ts">
import Select from '@ui/Select.vue'

defineProps<{
  count?: string
  sortModel: string
  sortLabel?: string
  sortOptions: readonly { value: string; label: string; muted?: boolean }[]
  style?: string | Record<string, string>
}>()

defineEmits<{
  'update:sortModel': [value: string]
}>()
</script>

<template>
  <div class="sort-toolbar" :style="style">
    <p class="meta">{{ count ?? '3 rodadas' }}</p>
    <div class="sort-toolbar__drops">
      <Select
        :label="sortLabel"
        :model-value="sortModel"
        :options="sortOptions"
        @update:model-value="$emit('update:sortModel', $event)"
      />
      <slot />
    </div>
  </div>
</template>
