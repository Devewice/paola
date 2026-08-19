<script setup lang="ts">
defineProps<{
  items: readonly { id: string; label: string; on: boolean }[]
}>()

const emit = defineEmits<{
  toggle: [id: string]
}>()
</script>

<template>
  <ul class="settings-list">
    <li v-for="item in items" :key="item.id">
      <span>{{ item.label }}</span>
      <button
        type="button"
        class="toggle"
        :class="{ 'is-on': item.on }"
        :aria-label="item.on ? 'Activar' : 'Desactivar'"
        @click="emit('toggle', item.id)"
      />
    </li>
  </ul>
</template>
