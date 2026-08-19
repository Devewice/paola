<script setup lang="ts">
defineProps<{
  copy: string
}>()
</script>

<template>
  <div class="login-strip">
    <span>{{ copy }}</span>
    <slot />
  </div>
</template>
