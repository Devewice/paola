<script setup lang="ts">
defineProps<{
  asideTitle: string
  asideCopy: string
  mainCopy?: string
}>()
</script>

<template>
  <div class="rm-layout">
    <div class="rm-layout__main">
      <slot name="nav" />
      <p v-if="mainCopy" class="meta" style="margin: 0">{{ mainCopy }}</p>
      <slot />
    </div>
    <aside class="rm-layout__aside">
      <h5>{{ asideTitle }}</h5>
      <p class="meta" style="margin: 0; font-size: 11px">{{ asideCopy }}</p>
    </aside>
  </div>
</template>
