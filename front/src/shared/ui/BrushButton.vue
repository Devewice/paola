<script setup lang="ts">
withDefaults(
  defineProps<{
    href?: string
    size?: 'md' | 'sm'
  }>(),
  { size: 'md' },
)
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    class="btn btn-primary btn-brush btn-brush--brochazo"
    :class="{ 'btn-sm': size === 'sm' }"
    :href="href"
    :type="href ? undefined : 'button'"
  >
    <span class="btn-brush__edge btn-brush__edge--clean" aria-hidden="true" />
    <span class="btn-brush__edge btn-brush__edge--paint" aria-hidden="true">
      <svg viewBox="0 0 100 48" preserveAspectRatio="none">
        <rect x="1.5" y="1.5" width="97" height="45" fill="none" stroke="#48B4FC" stroke-width="2.5" />
      </svg>
    </span>
    <span class="btn-brush__text"><slot /></span>
  </component>
</template>
