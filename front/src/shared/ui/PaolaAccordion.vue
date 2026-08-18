<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
}>()

const open = ref(false)
</script>

<template>
  <div class="paola-acc" :class="{ 'is-open': open }">
    <button type="button" @click="open = !open">{{ title }}</button>
    <div v-if="open" class="paola-acc__body">
      <slot />
    </div>
  </div>
</template>
