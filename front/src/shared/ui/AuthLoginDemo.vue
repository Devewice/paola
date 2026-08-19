<script setup lang="ts">
import { ref } from 'vue'
import Button from '@ui/Button.vue'
import Input from '@ui/Input.vue'

const email = ref('')
const password = ref('')
</script>

<template>
  <div class="stack" style="gap: 12px">
    <Input v-model="email" type="email" placeholder="Correo" />
    <Input v-model="password" type="password" placeholder="Contraseña" />
    <Button>Continuar</Button>
  </div>
</template>
