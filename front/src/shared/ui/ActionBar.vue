<template>
  <div class="action-bar">
    <span v-if="$slots.info" class="action-bar__info">
      <slot name="info" />
    </span>
    <slot />
  </div>
</template>
