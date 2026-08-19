<script setup lang="ts">
defineProps<{
  items: readonly {
    label: string
    active?: boolean
    expanded?: boolean
    children?: readonly { label: string }[]
  }[]
}>()
</script>

<template>
  <ul class="tree-nav">
    <li v-for="item in items" :key="item.label" :class="{ 'is-active': item.active }">
      <button type="button">{{ item.expanded ? '▾' : '▸' }} {{ item.label }}</button>
      <ul v-if="item.children?.length">
        <li v-for="child in item.children" :key="child.label">
          <button type="button">{{ child.label }}</button>
        </li>
      </ul>
    </li>
  </ul>
</template>
