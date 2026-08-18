<script setup lang="ts">
withDefaults(
  defineProps<{
    href?: string
    to?: string
    variant?: 'primary' | 'hero' | 'ghost' | 'dark' | 'danger' | 'brush'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    type?: 'button' | 'submit'
    target?: '_blank' | '_self'
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)

const relFor = (target?: '_blank' | '_self') => (target === '_blank' ? 'noopener noreferrer' : undefined)
</script>

<template>
  <router-link
    v-if="to"
    :to="to"
    class="paola-btn"
    :class="[`paola-btn--${variant}`, size !== 'md' ? `paola-btn--${size}` : '']"
  >
    <slot />
  </router-link>
  <a
    v-else-if="href"
    :href="href"
    :target="target"
    :rel="relFor(target)"
    class="paola-btn"
    :class="[`paola-btn--${variant}`, size !== 'md' ? `paola-btn--${size}` : '']"
  >
    <slot />
  </a>
  <button
    v-else
    :type="type"
    class="paola-btn"
    :class="[`paola-btn--${variant}`, size !== 'md' ? `paola-btn--${size}` : '']"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
