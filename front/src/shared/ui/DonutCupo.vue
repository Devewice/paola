<script setup lang="ts">
defineProps<{
  label?: string
  footnote?: string
}>()
</script>

<template>
  <div class="donut"><span>{{ label ?? '12/20' }}</span></div>
  <p v-if="footnote" class="meta" style="text-align:center;margin:10px 0 0">{{ footnote }}</p>
</template>
