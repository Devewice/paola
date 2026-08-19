<script setup lang="ts">
withDefaults(
  defineProps<{
    items: readonly string[]
    ordered?: boolean
  }>(),
  { ordered: false },
)
</script>

<template>
  <component :is="ordered ? 'ol' : 'ul'" class="list list-block">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </component>
</template>
