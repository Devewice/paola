<script setup lang="ts">
const props = withDefaults(
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

function btnClass(): string[] {
  const classes = ['btn']
  if (props.variant === 'ghost') classes.push('btn-ghost')
  else if (props.variant === 'dark') classes.push('btn-dark')
  else if (props.variant === 'danger') classes.push('btn-danger')
  else classes.push('btn-primary')
  if (props.variant === 'hero') classes.push('btn-primary--hero')
  if (props.variant === 'brush') classes.push('btn-brush', 'btn-brush--brochazo')
  if (props.size === 'sm') classes.push('btn-sm')
  if (props.size === 'lg') classes.push('btn-lg')
  return classes
}
</script>

<template>
  <router-link v-if="to" :to="to" :class="btnClass()">
    <template v-if="variant === 'brush'">
      <span class="btn-brush__edge btn-brush__edge--clean" aria-hidden="true" />
      <span class="btn-brush__edge btn-brush__edge--paint" aria-hidden="true">
        <svg viewBox="0 0 100 48" preserveAspectRatio="none">
          <rect x="1.5" y="1.5" width="97" height="45" fill="none" stroke="#48B4FC" stroke-width="2.5" />
        </svg>
      </span>
      <span class="btn-brush__text"><slot /></span>
    </template>
    <slot v-else />
  </router-link>
  <a
    v-else-if="href"
    :href="href"
    :target="target"
    :rel="relFor(target)"
    :class="btnClass()"
  >
    <template v-if="variant === 'brush'">
      <span class="btn-brush__edge btn-brush__edge--clean" aria-hidden="true" />
      <span class="btn-brush__edge btn-brush__edge--paint" aria-hidden="true">
        <svg viewBox="0 0 100 48" preserveAspectRatio="none">
          <rect x="1.5" y="1.5" width="97" height="45" fill="none" stroke="#48B4FC" stroke-width="2.5" />
        </svg>
      </span>
      <span class="btn-brush__text"><slot /></span>
    </template>
    <slot v-else />
  </a>
  <button v-else :type="type" :class="btnClass()" :disabled="disabled">
    <template v-if="variant === 'brush'">
      <span class="btn-brush__edge btn-brush__edge--clean" aria-hidden="true" />
      <span class="btn-brush__edge btn-brush__edge--paint" aria-hidden="true">
        <svg viewBox="0 0 100 48" preserveAspectRatio="none">
          <rect x="1.5" y="1.5" width="97" height="45" fill="none" stroke="#48B4FC" stroke-width="2.5" />
        </svg>
      </span>
      <span class="btn-brush__text"><slot /></span>
    </template>
    <slot v-else />
  </button>
</template>
