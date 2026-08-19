<script setup lang="ts">
defineProps<{
  files: readonly { name: string; width: string }[]
}>()
</script>

<template>
  <ul class="upload-queue">
    <li v-for="file in files" :key="file.name">
      {{ file.name }}
      <div class="upload-queue__bar"><span :style="{ width: file.width }" /></div>
    </li>
  </ul>
</template>
