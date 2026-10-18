<script setup lang="ts">
defineProps<{
  active: boolean
}>()
</script>

<template>
  <div class="admin-spot" :class="{ 'is-on': active }">
    <div v-if="active" class="admin-spot__tools">
      <slot name="tools" />
    </div>
    <slot />
  </div>
</template>
