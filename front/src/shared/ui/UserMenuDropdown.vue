<script setup lang="ts">
import { ref } from 'vue'
import Button from '@ui/Button.vue'

defineProps<{
  label?: string
  links: readonly { label: string; href: string }[]
  signOutLabel?: string
}>()

const open = ref(false)
</script>

<template>
  <div class="user-menu-wrap" :class="{ 'is-open': open }">
    <Button variant="ghost" style="height:40px" @click="open = !open">{{ label ?? '☰ Cuenta' }}</Button>
    <div v-if="open" class="user-menu">
      <a v-for="link in links" :key="link.href + link.label" :href="link.href">{{ link.label }}</a>
      <button type="button">{{ signOutLabel ?? 'Salir' }}</button>
    </div>
  </div>
</template>
