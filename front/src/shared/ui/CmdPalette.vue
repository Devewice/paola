<script setup lang="ts">
defineProps<{
  modelValue: boolean
  placeholder?: string
  items: readonly string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div v-if="modelValue" class="cmd-palette-bg is-on" role="dialog" aria-modal="true" aria-label="Buscar" @click.self="emit('update:modelValue', false)">
    <div class="cmd-palette">
      <input type="search" :placeholder="placeholder ?? 'Buscar…'" />
      <ul>
        <li v-for="(item, index) in items" :key="item">
          <button type="button" :class="{ 'is-on': index === 0 }" @click="emit('update:modelValue', false)">{{ item }}</button>
        </li>
      </ul>
    </div>
  </div>
</template>
