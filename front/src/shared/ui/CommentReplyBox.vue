<script setup lang="ts">
import { ref } from 'vue'
import Button from '@ui/Button.vue'

const reply = ref('')
</script>

<template>
  <div class="comment-reply-box">
    <textarea v-model="reply" placeholder="Tu respuesta…" maxlength="280"></textarea>
    <Button size="sm">Enviar</Button>
  </div>
</template>

