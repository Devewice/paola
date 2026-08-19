<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    defaultOpen?: boolean
  }>(),
  { defaultOpen: false },
)
</script>

<template>
  <details class="acc" :open="defaultOpen || undefined">
    <summary>{{ title }}</summary>
    <div class="acc-body">
      <slot />
    </div>
  </details>
</template>
