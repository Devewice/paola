<script setup lang="ts">
defineProps<{
  href: string
  label?: string
  hint?: string
}>()
</script>

<template>
  <div class="skip-link-demo">
    <a class="skip-link" :href="href">{{ label ?? 'Saltar al contenido' }}</a>
    <p class="meta" style="margin: 0; font-size: 12px">{{ hint ?? 'Tab para ver skip link · foco cian' }}</p>
  </div>
</template>
