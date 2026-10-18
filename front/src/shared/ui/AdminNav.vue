<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  items: readonly { id: string; label: string; hint?: string; badge?: number }[]
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <nav class="admin-nav" :aria-label="label">
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      class="admin-nav__item"
      :class="{ 'is-on': modelValue === item.id }"
      :aria-current="modelValue === item.id ? 'page' : undefined"
      @click="emit('update:modelValue', item.id)"
    >
      <span class="admin-nav__label">
        {{ item.label }}
        <span v-if="item.badge" class="admin-nav__badge">{{ item.badge }}</span>
      </span>
      <span v-if="item.hint" class="admin-nav__hint">{{ item.hint }}</span>
    </button>
  </nav>
</template>
