<script setup lang="ts">
import Button from '@ui/Button.vue'

withDefaults(
  defineProps<{
    modelValue?: string
    hint: string
    placeholder?: string
    disabled?: boolean
    maxLength?: number
    avatar?: string
    head: string
    ctaLabel?: string
  }>(),
  { modelValue: '', placeholder: 'Sumá al recuerdo…', maxLength: 400, avatar: '?', ctaLabel: 'Publicar' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="comment-compose">
    <div class="comment-compose__head">
      <span class="comment-compose__avatar">{{ avatar }}</span>
      <span class="meta">{{ head }}</span>
    </div>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :disabled="disabled"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <div class="comment-compose__foot">
      <span class="comment-compose__hint">{{ hint }}</span>
      <Button :disabled="disabled">{{ ctaLabel }}</Button>
    </div>
  </div>
</template>
