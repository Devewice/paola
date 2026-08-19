<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: number
    max?: number
  }>(),
  { max: 10 },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <div>
    <div class="nps-scale">
      <button
        v-for="n in max + 1"
        :key="n - 1"
        type="button"
        :class="{ 'is-on': modelValue === n - 1 }"
        @click="emit('update:modelValue', n - 1)"
      >{{ n - 1 }}</button>
    </div>
    <div class="nps-labels"><span>Nada probable</span><span>Muy probable</span></div>
  </div>
</template>
