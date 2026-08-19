<script setup lang="ts">
defineProps<{
  label?: string
  style?: string | Record<string, string>
}>()
</script>

<template>
  <div class="afiche-block" :style="style">
    <p v-if="label" class="meta" style="margin-bottom:12px">{{ label }}</p>
    <slot />
  </div>
</template>
