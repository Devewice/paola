<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string
    href?: string
    target?: '_blank' | '_self'
  }>(),
  {},
)

const relFor = (target?: '_blank' | '_self') => (target === '_blank' ? 'noopener noreferrer' : undefined)
</script>

<template>
  <router-link v-if="to" :to="to">
    <slot />
  </router-link>
  <a
    v-else-if="href"
    :href="href"
    :target="target"
    :rel="relFor(target)"
  >
    <slot />
  </a>
  <span v-else>
    <slot />
  </span>
</template>
