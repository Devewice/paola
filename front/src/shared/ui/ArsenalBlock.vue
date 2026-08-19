<script setup lang="ts">
defineProps<{
  title?: string
  style?: string | Record<string, string>
}>()
</script>

<template>
  <div class="arsenal-block" :style="style">
    <h4 v-if="title">{{ title }}</h4>
    <slot />
  </div>
</template>
