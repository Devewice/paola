<script setup lang="ts">
import { ref } from 'vue'
import Button from '@ui/Button.vue'

defineProps<{
  title?: string
  items: readonly { title: string; meta: string; unread?: boolean }[]
}>()

const open = ref(false)
</script>

<template>
  <div class="notif-wrap" :class="{ 'is-open': open }">
    <Button variant="ghost" style="height:40px" @click="open = !open">🔔 Avisos</Button>
    <div v-if="open" class="notif-panel">
      <div class="notif-panel__head">{{ title ?? 'Notificaciones' }}</div>
      <div
        v-for="item in items"
        :key="item.title"
        class="notif-panel__item"
        :class="{ 'is-unread': item.unread }"
      >
        <strong>{{ item.title }}</strong>
        <p class="meta" style="margin:4px 0 0">{{ item.meta }}</p>
      </div>
    </div>
  </div>
</template>
