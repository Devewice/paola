<script setup lang="ts">
defineProps<{
  items: readonly { title: string; meta: string; checked?: boolean }[]
  kind?: 'radio' | 'checkbox'
  name?: string
}>()
</script>

<template>
  <ul class="choice-list">
    <li v-for="item in items" :key="item.title">
      <label class="choice-list__row">
        <input :type="kind ?? 'radio'" :name="kind === 'radio' ? name : undefined" :checked="item.checked" />
        <span class="choice-list__body">
          <span class="choice-list__title">{{ item.title }}</span>
          <span class="choice-list__meta">{{ item.meta }}</span>
        </span>
      </label>
    </li>
  </ul>
</template>
