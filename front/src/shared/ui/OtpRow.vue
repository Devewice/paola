<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    length?: number
  }>(),
  { length: 4 },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const digits = () => Array.from({ length: props.length }, (_, i) => props.modelValue[i] ?? '')

function onInput(index: number, event: Event): void {
  const char = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(-1)
  const next = digits().map((d, i) => (i === index ? char : d)).join('').slice(0, props.length)
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="otp-row">
    <input
      v-for="(digit, index) in digits()"
      :key="index"
      type="text"
      maxlength="1"
      inputmode="numeric"
      :aria-label="`Dígito ${index + 1}`"
      :value="digit"
      @input="onInput(index, $event)"
    />
  </div>
</template>
