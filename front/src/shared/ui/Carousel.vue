<script setup lang="ts">
defineProps<{
  slides: readonly string[]
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <div class="carousel">
    <div
      v-for="(slide, index) in slides"
      :key="slide"
      class="carousel__slide"
      :class="{ 'is-on': modelValue === index }"
    >
      <h4>{{ slide }}</h4>
    </div>
    <div class="carousel__dots">
      <button
        v-for="(slide, index) in slides"
        :key="`dot-${slide}`"
        type="button"
        class="carousel__dot"
        :class="{ 'is-on': modelValue === index }"
        :aria-label="`Slide ${index + 1}`"
        @click="emit('update:modelValue', index)"
      />
    </div>
  </div>
</template>
