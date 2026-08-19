<script setup lang="ts">
import { ref } from 'vue'
import Button from '@ui/Button.vue'

defineProps<{
  threads: readonly { id: string; title: string; preview: string }[]
  activeTitle: string
}>()

const active = ref('0')
</script>

<template>
  <div class="chat-layout">
    <div class="chat-list">
      <button
        v-for="thread in threads"
        :key="thread.id"
        type="button"
        class="chat-list__item"
        :class="{ 'is-on': active === thread.id }"
        @click="active = thread.id"
      >{{ thread.title }}<span>{{ thread.preview }}</span></button>
    </div>
    <div class="chat-pane">
      <div class="chat-pane__head">{{ activeTitle }}</div>
      <div class="chat-pane__msgs">
        <slot />
      </div>
      <div class="chat-compose">
        <input type="text" placeholder="Mensaje…" />
        <Button size="sm">Enviar</Button>
      </div>
    </div>
  </div>
</template>
