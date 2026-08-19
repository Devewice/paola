<script setup lang="ts">
defineProps<{
  title: string
  copy?: string
}>()
</script>

<template>
  <div class="unete-block">
    <h4>{{ title }}</h4>
    <p v-if="copy" class="meta" style="margin:0 0 12px">{{ copy }}</p>
    <slot />
  </div>
</template>
