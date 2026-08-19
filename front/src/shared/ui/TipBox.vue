<script setup lang="ts">
defineProps<{
  tip: string
}>()
</script>

<template>
  <div class="tip-box">
    <slot />
    <span class="tip-box__popup">{{ tip }}</span>
  </div>
</template>
