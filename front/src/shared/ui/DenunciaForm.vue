<script setup lang="ts">
import { ref } from 'vue'
import VoiceBadge from '@ui/VoiceBadge.vue'
import Field from '@ui/Field.vue'
import Textarea from '@ui/Textarea.vue'
import Input from '@ui/Input.vue'
import FilePicker from '@ui/FilePicker.vue'
import Choice from '@ui/Choice.vue'
import Button from '@ui/Button.vue'

const what = ref('')
const where = ref('')
const disclaimer = ref(false)
</script>

<template>
  <form class="denuncia-form">
    <VoiceBadge voice="armargura" />
    <Field label="Qué pasó">
      <Textarea v-model="what" placeholder="Alcantarilla, abuso, calle…" />
    </Field>
    <Field label="Dónde / cuándo">
      <Input v-model="where" type="text" placeholder="Barrio · fecha" />
    </Field>
    <FilePicker label="Evidencia" />
    <Choice v-model="disclaimer" kind="check" label="Leí aviso: no denuncia penal · no doxxing" />
    <Button>Enviar a moderación</Button>
  </form>
</template>
