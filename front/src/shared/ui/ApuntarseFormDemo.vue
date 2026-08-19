<script setup lang="ts">
import { ref } from 'vue'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'

const nombre = ref('')
const wa = ref('')
const moto = ref('')
</script>

<template>
  <form class="stack" style="gap: 12px" @submit.prevent>
    <Field label="Nombre">
      <Input id="rm-nombre" v-model="nombre" placeholder="Tu nombre" />
    </Field>
    <Field label="WhatsApp">
      <Input id="rm-wa" v-model="wa" type="tel" placeholder="+57 …" />
    </Field>
    <Field label="Moto (opcional)">
      <Input id="rm-moto" v-model="moto" placeholder="Marca / modelo" />
    </Field>
    <Button type="submit">Reservar cupo</Button>
  </form>
</template>
