<script setup lang="ts">
defineProps<{
  items: readonly { id: string; label: string; checked?: boolean }[]
}>()
</script>

<template>
  <ul class="checklist">
    <li v-for="item in items" :key="item.id">
      <input :id="item.id" type="checkbox" :checked="item.checked" />
      <label class="checklist__text" :for="item.id">{{ item.label }}</label>
    </li>
  </ul>
</template>
