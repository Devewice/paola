<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  tabs: readonly { id: string; label: string }[]
  footnote?: string
}>()

const tab = ref('login')
</script>

<template>
  <div class="auth-panel">
    <div class="auth-tabs">
      <button
        v-for="item in tabs"
        :key="item.id"
        type="button"
        :class="{ 'is-on': tab === item.id }"
        @click="tab = item.id"
      >{{ item.label }}</button>
    </div>
    <slot :active="tab" />
    <p v-if="footnote" class="meta" style="margin:12px 0 0">{{ footnote }}</p>
  </div>
</template>
