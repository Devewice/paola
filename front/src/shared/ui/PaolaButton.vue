<script setup lang="ts">
withDefaults(
  defineProps<{
    href?: string
    to?: string
    variant?: 'primary' | 'hero' | 'ghost' | 'dark' | 'danger' | 'brush'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    type?: 'button' | 'submit'
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)
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
