<script setup lang="ts">
</script>

<template>
  <div class="home-dash">
    <div class="home-dash__cell home-dash__cell--wide">
      <slot name="hero" />
    </div>
    <div class="home-dash__cell"><slot name="km" /></div>
    <div class="home-dash__cell"><slot name="memory" /></div>
    <div class="home-dash__cell"><slot name="voice" /></div>
    <div class="home-dash__cell"><slot name="paola" /></div>
  </div>
</template>
