<script setup lang="ts">
import { ref } from 'vue'
import { SHOP_COPY } from '@modules/shop/constants/copy.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Modal from '@ui/Modal.vue'
import PasswordField from '@ui/PasswordField.vue'

const props = defineProps<{
  modelValue: boolean
  busy?: boolean
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  register: [draft: { alias: string; email: string; password: string }]
  login: [draft: { email: string; password: string }]
}>()

const copy = SHOP_COPY
const mode = ref<'register' | 'login'>('register')
const alias = ref('')
const email = ref('')
const password = ref('')

function submit() {
  if (mode.value === 'register') {
    emit('register', {
      alias: alias.value.trim(),
      email: email.value.trim(),
      password: password.value,
    })
    return
  }
  emit('login', {
    email: email.value.trim(),
    password: password.value,
  })
}
</script>

<template>
  <Modal
    :model-value="modelValue"
    :title="copy.deckRegisterTitle"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p class="meta" style="margin: 0 0 16px">{{ copy.deckRegisterLead }}</p>
    <div class="row" style="gap: 8px; margin-bottom: 16px">
      <Button
        size="sm"
        :variant="mode === 'register' ? 'primary' : 'ghost'"
        @click="mode = 'register'"
      >{{ copy.deckRegisterCta }}</Button>
      <Button
        size="sm"
        :variant="mode === 'login' ? 'primary' : 'ghost'"
        @click="mode = 'login'"
      >{{ copy.deckLoginCta }}</Button>
    </div>
    <div class="stack">
      <Field v-if="mode === 'register'" :label="copy.deckAlias">
        <Input v-model="alias" autocomplete="nickname" />
      </Field>
      <Field :label="copy.deckEmail">
        <Input v-model="email" type="email" autocomplete="email" />
      </Field>
      <PasswordField id="deck-auth-pass" v-model="password" :label="copy.deckPassword" />
      <Alert v-if="error || props.error" tone="bad">{{ error || props.error }}</Alert>
      <Button size="sm" :disabled="busy" @click="submit">
        {{ mode === 'register' ? copy.deckSubmitRegister : copy.deckSubmitLogin }}
      </Button>
    </div>
  </Modal>
</template>
