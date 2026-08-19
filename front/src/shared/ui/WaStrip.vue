<script setup lang="ts">
defineProps<{
  title?: string
  copy?: string
}>()
</script>

<template>
  <aside class="wa-strip" aria-label="WhatsApp">
    <p>
      <strong>{{ title ?? 'Únete al parche' }}</strong>
      <br />
      {{ copy ?? 'Escríbele a Paola por WhatsApp.' }}
    </p>
    <div v-if="$slots.default">
      <slot />
    </div>
  </aside>
</template>
