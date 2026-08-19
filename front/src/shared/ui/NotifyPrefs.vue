<script setup lang="ts">
import Choice from '@ui/Choice.vue'

defineProps<{
  comment: boolean
  reply: boolean
  memory: boolean
  react: boolean
}>()

defineEmits<{
  'update:comment': [value: boolean]
  'update:reply': [value: boolean]
  'update:memory': [value: boolean]
  'update:react': [value: boolean]
}>()
</script>

<template>
  <div class="notify-prefs">
    <Choice :model-value="comment" kind="switch" label="Comentario publicado" @update:model-value="$emit('update:comment', $event)" />
    <Choice :model-value="reply" kind="switch" label="Paola respondió" @update:model-value="$emit('update:reply', $event)" />
    <Choice :model-value="memory" kind="switch" label="Nueva memoria del parche" @update:model-value="$emit('update:memory', $event)" />
    <Choice :model-value="react" kind="switch" label="Cada reacción" @update:model-value="$emit('update:react', $event)" />
  </div>
</template>
