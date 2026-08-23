<script setup lang="ts">
import { ref } from 'vue'
import Icon from '@ui/Icon.vue'
import InputElectricFrame from '@ui/InputElectricFrame.vue'

withDefaults(
  defineProps<{
    modelValue: string
    label: string
    id?: string
    tone?: 'plain' | 'electric'
  }>(),
  { tone: 'plain' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const visible = ref(false)
</script>

<template>
  <div class="field pass-field" :class="{ 'field--electric': tone === 'electric' }">
    <label :for="id ?? 'pass-field'">{{ label }}</label>
    <div class="pass-field__row" :class="{ 'input-electric': tone === 'electric' }">
      <InputElectricFrame v-if="tone === 'electric'" />
      <input
        class="input"
        :class="{ 'input--electric': tone === 'electric' }"
        :id="id ?? 'pass-field'"
        :type="visible ? 'text' : 'password'"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button
        type="button"
        class="pass-field__toggle"
        :aria-label="visible ? 'Ocultar clave' : 'Ver clave'"
        @click="visible = !visible"
      >
        <Icon :name="visible ? 'eye-off' : 'eye'" size="sm" tone="cyan" :circle="false" />
      </button>
    </div>
  </div>
</template>
