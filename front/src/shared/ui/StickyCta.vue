<script setup lang="ts">
defineProps<{
  copy: string
}>()
</script>

<template>
  <div class="sticky-cta-demo">
    <div class="sticky-cta-demo__bar">
      <p><strong>{{ copy }}</strong></p>
      <slot />
    </div>
  </div>
</template>
