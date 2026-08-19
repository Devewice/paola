<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label: string
  kind?: 'check' | 'radio' | 'switch'
  name?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div v-if="kind === 'switch'" class="check check--switch">
    <span>{{ label }}</span>
    <label class="switch">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <span />
    </label>
  </div>
  <label v-else :class="kind === 'radio' ? 'radio' : 'check'">
    <input
      :type="kind === 'radio' ? 'radio' : 'checkbox'"
      :name="name"
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    {{ label }}
  </label>
</template>
