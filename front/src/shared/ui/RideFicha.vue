<script setup lang="ts">
defineProps<{
  voice?: 'loigca' | 'incauta' | 'armargura'
  voiceLabel?: string
  title?: string
  fields?: readonly { label: string; value: string }[]
}>()
</script>

<template>
  <div class="ride-ficha">
    <span v-if="voice" :class="`voice-badge voice-badge--${voice}`">{{ voiceLabel ?? voice }}</span>
    <h4 v-if="title" style="margin:8px 0 0;font-family:var(--display)">{{ title }}</h4>
    <dl v-if="fields?.length" class="ride-ficha__grid">
      <div v-for="field in fields" :key="field.label">
        <dt>{{ field.label }}</dt>
        <dd>{{ field.value }}</dd>
      </div>
    </dl>
    <slot />
  </div>
</template>
