<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'thick' | 'thin'
    style?: string | Record<string, string>
  }>(),
  { variant: 'thick' },
)
</script>

<template>
  <div
    class="brush-divider"
    :class="{ 'brush-divider--thin': variant === 'thin' }"
    :style="style"
    aria-hidden="true"
  >
    <svg v-if="variant === 'thick'" viewBox="0 0 800 28" preserveAspectRatio="none">
      <use href="#brush-divider-thick" />
    </svg>
    <svg v-else viewBox="0 0 800 12" preserveAspectRatio="none">
      <g fill="none" stroke-linecap="round">
        <path stroke="#0088F8" stroke-width="3" d="M0,6 L36,5 M46,7 L88,4 M98,6 L148,3 M158,7 L208,4 M218,6 L268,5 M278,3 L328,6 M338,4 L388,7 M398,5 L448,6 M458,4 L508,7 M518,5 L568,6 M578,4 L628,7 M638,5 L688,6 M698,4 L748,7 M758,5 L800,6"/>
        <path stroke="#48B4FC" stroke-width="1.5" opacity="0.5" d="M4,8 L40,7 M50,9 L92,6 M102,8 L152,5 M162,9 L212,6 M222,8 L272,7 M282,5 L332,8 M342,6 L392,9 M402,7 L452,8 M462,6 L512,9 M522,7 L572,8 M582,6 L632,9 M642,7 L692,8 M702,6 L752,9 M762,7 L800,8"/>
      </g>
    </svg>
  </div>
</template>
