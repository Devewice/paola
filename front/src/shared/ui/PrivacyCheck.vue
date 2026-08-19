<script setup lang="ts">
import Choice from '@ui/Choice.vue'

defineProps<{
  modelValue: boolean
  label: string
  to: string
  linkLabel: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div class="paola-privacy-check">
    <Choice
      :model-value="modelValue"
      kind="check"
      :label="label"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <router-link class="paola-privacy-check__link" :to="to">{{ linkLabel }}</router-link>
  </div>
</template>

<style scoped>
.paola-privacy-check {
  display: grid;
  gap: 4px;
}

.paola-privacy-check__link {
  margin-left: 30px;
  font-size: 13px;
  color: var(--paola-cyan, #48b4fc);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.paola-privacy-check__link:hover {
  color: var(--paola-blue, #0088f8);
}
</style>
