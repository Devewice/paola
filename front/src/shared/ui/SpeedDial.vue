<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  actions: readonly { label: string; icon: string }[]
}>()

const open = ref(false)
</script>

<template>
  <div class="speed-dial" :class="{ 'is-open': open }">
    <div v-if="open" class="speed-dial__items">
      <button v-for="action in actions" :key="action.label" type="button">{{ action.icon }}</button>
    </div>
    <button type="button" class="speed-dial__main" @click="open = !open">+</button>
  </div>
</template>
