<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: number
    max?: number
  }>(),
  { max: 5 },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <div class="rating-row">
    <button
      v-for="star in max"
      :key="star"
      type="button"
      :class="{ 'is-on': star <= modelValue }"
      :aria-label="`${star} ${star === 1 ? 'estrella' : 'estrellas'}`"
      @click="emit('update:modelValue', star)"
    >★</button>
  </div>
</template>
