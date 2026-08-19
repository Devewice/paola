<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    defaultOpen?: boolean
  }>(),
  { defaultOpen: false },
)

const open = ref(props.defaultOpen)
</script>

<template>
  <div class="collapse-card" :class="{ 'is-open': open }">
    <button type="button" class="collapse-card__head" @click="open = !open">{{ title }}</button>
    <div class="collapse-card__body">
      <slot />
    </div>
  </div>
</template>
