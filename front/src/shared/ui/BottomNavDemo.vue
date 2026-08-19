<script setup lang="ts">
import BottomNav from '@ui/BottomNav.vue'

defineProps<{
  tabs: readonly { href: string; icon: string; label: string; active?: boolean; badge?: boolean }[]
  preview?: string
}>()
</script>

<template>
  <div class="bottom-nav-demo">
    <p class="sm" style="padding:16px;margin:0;color:var(--muted)">{{ preview ?? 'Vista previa contenido…' }}</p>
    <BottomNav :tabs="tabs" />
  </div>
</template>
