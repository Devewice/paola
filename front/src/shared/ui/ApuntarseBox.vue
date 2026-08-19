<script setup lang="ts">
defineProps<{
  blocked?: boolean
  title?: string
  copy?: string
}>()
</script>

<template>
  <div class="apuntarse-box" :class="{ 'is-blocked': blocked }">
    <slot />
    <template v-if="blocked">
      <strong>{{ title ?? 'Cupo lleno' }}</strong>
      <p v-if="copy" class="meta" style="margin:8px 0 0">{{ copy }}</p>
    </template>
  </div>
</template>
