<script setup lang="ts">
defineProps<{
  sections: readonly { title: string; copy: string }[]
  checkLabel?: string
}>()
</script>

<template>
  <article class="privacy-doc">
    <template v-for="section in sections" :key="section.title">
      <h4>{{ section.title }}</h4>
      <p class="meta" style="margin:0">{{ section.copy }}</p>
    </template>
    <label v-if="checkLabel" class="check" style="margin-top:12px">
      <input type="checkbox" /> {{ checkLabel }}
    </label>
  </article>
</template>
