<script setup lang="ts">
defineProps<{
  modelValue: string
  options: readonly { id: string; icon: string; title: string; copy?: string }[]
  secureNote?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div>
    <div class="pay-picker">
      <button
        v-for="option in options"
        :key="option.id"
        type="button"
        class="pay-option"
        :class="{ 'is-on': modelValue === option.id }"
        @click="emit('update:modelValue', option.id)"
      >
        <span class="pay-option__icon">{{ option.icon }}</span>
        <div>
          <strong>{{ option.title }}</strong>
          <p v-if="option.copy" class="meta" style="margin:4px 0 0">{{ option.copy }}</p>
        </div>
      </button>
    </div>
    <p v-if="secureNote" class="pay-secure" style="margin-top:10px">{{ secureNote }}</p>
  </div>
</template>
