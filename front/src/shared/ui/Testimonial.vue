<script setup lang="ts">
defineProps<{
  quote: string
  who: string
  initial?: string
}>()
</script>

<template>
  <div class="testimonial">
    <blockquote>«{{ quote }}»</blockquote>
    <div class="testimonial__who">
      <div class="avatar" style="width: 32px; height: 32px; font-size: 11px">{{ initial ?? who.charAt(0) }}</div>
      {{ who }}
    </div>
  </div>
</template>
