<script setup lang="ts">
defineProps<{
  slots: readonly string[]
  note?: string
}>()
</script>

<template>
  <div>
    <div class="integrantes">
      <span v-for="(slot, index) in slots" :key="index">{{ slot }}</span>
    </div>
    <p v-if="note" class="meta" style="margin-top:8px">{{ note }}</p>
  </div>
</template>
