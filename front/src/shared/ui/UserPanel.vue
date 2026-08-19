<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  tabs: readonly { id: string; label: string }[]
  panels: readonly { id: string; content: string }[]
}>()

const active = ref('tickets')
</script>

<template>
  <div class="user-panel">
    <nav class="user-panel__nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="{ 'is-on': active === tab.id }"
        @click="active = tab.id"
      >{{ tab.label }}</button>
    </nav>
    <div
      v-for="panel in panels"
      :key="panel.id"
      class="user-panel__body"
      :class="{ 'is-on': active === panel.id }"
    >
      <slot :name="panel.id">{{ panel.content }}</slot>
    </div>
  </div>
</template>
