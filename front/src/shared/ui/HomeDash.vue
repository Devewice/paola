<script setup lang="ts">
</script>

<template>
  <div class="home-dash">
    <div class="home-dash__cell home-dash__cell--next">
      <slot name="next" />
    </div>
    <div class="home-dash__cell home-dash__cell--pulse">
      <slot name="pulse" />
    </div>
    <div class="home-dash__aside">
      <slot name="aside" />
    </div>
  </div>
</template>
