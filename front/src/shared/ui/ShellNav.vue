<script setup lang="ts">
defineProps<{
  modelValue: string
  tabs: readonly { id: string; label: string; href?: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="shell-header">
    <img src="/kit-assets/logo.png" width="32" height="32" alt="" />
    <nav style="flex: 1">
      <a
        v-for="tab in tabs"
        :key="tab.id"
        :href="tab.href ?? '#'"
        :class="{ 'is-on': modelValue === tab.id }"
        @click.prevent="emit('update:modelValue', tab.id)"
      >{{ tab.label }}</a>
    </nav>
  </div>
</template>
