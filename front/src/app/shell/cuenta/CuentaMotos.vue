<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { CUENTA_LIMITS, CUENTA_MOTOS_COPY } from '@app/constants/cuenta.ts'
import type { CuentaAccount, UserMotorcycle } from '@app/shell/cuenta/useCuentaAccount.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Select from '@ui/Select.vue'
import './cuenta-card.css'

const OTHER = '__otra__'

const props = defineProps<{ account: CuentaAccount }>()

const copy = CUENTA_MOTOS_COPY
const { motorcycles, catalog, catalogFailed, busy } = props.account

const brand = ref('')
const modelId = ref('')
const customBrand = ref('')
const customModel = ref('')
const customCc = ref('')
const error = ref('')
const confirmId = ref('')

const brandOptions = computed(() => {
  const brands = [...new Set(catalog.value.map((item) => item.brand))].sort((a, b) => a.localeCompare(b, 'es'))
  return [
    ...brands.map((value) => ({ value, label: value })),
    { value: OTHER, label: copy.otherBrand, muted: true },
  ]
})

const modelOptions = computed(() => [
  ...catalog.value
    .filter((item) => item.brand === brand.value)
    .map((item) => ({ value: item.id, label: `${item.model} · ${item.cc} cc` })),
  { value: OTHER, label: copy.otherModel, muted: true },
])

const isOtherBrand = computed(() => brand.value === OTHER || catalogFailed.value)
const isOtherModel = computed(() => isOtherBrand.value || modelId.value === OTHER)
const picked = computed(() => catalog.value.find((item) => item.id === modelId.value))
const isFull = computed(() => motorcycles.value.length >= CUENTA_LIMITS.MOTORCYCLES_MAX)

const canAdd = computed(() => {
  if (busy.value || isFull.value) return false
  if (!isOtherModel.value) return Boolean(picked.value)
  const brandOk = isOtherBrand.value ? customBrand.value.trim() : brand.value
  return Boolean(brandOk && customModel.value.trim() && customCc.value.trim())
})

watch(brand, () => {
  modelId.value = ''
})

onMounted(() => {
  if (!catalog.value.length) void props.account.loadCatalog()
})

function label(moto: UserMotorcycle): string {
  return [moto.brand, moto.model].join(' ')
}

function reset(): void {
  brand.value = ''
  modelId.value = ''
  customBrand.value = ''
  customModel.value = ''
  customCc.value = ''
}

async function add(): Promise<void> {
  if (!canAdd.value) return
  error.value = ''
  const draft = picked.value && !isOtherModel.value
    ? { catalogId: picked.value.id }
    : {
        brand: isOtherBrand.value ? customBrand.value.trim() : brand.value,
        model: customModel.value.trim(),
        cc: Number(customCc.value.replace(/\D/g, '')),
      }
  const result = await props.account.addMotorcycle(draft)
  if (!result.ok) {
    error.value = result.detail
    return
  }
  reset()
}

async function remove(id: string): Promise<void> {
  if (confirmId.value !== id) {
    confirmId.value = id
    return
  }
  confirmId.value = ''
  error.value = ''
  const result = await props.account.removeMotorcycle(id)
  if (!result.ok) error.value = result.detail
}
</script>

<template>
  <section class="cuenta-card" aria-labelledby="cuenta-motos-title">
    <header class="cuenta-card__head">
      <span class="board-kicker">{{ copy.kicker }}</span>
      <h2 id="cuenta-motos-title" class="cuenta-card__title">{{ copy.title }}</h2>
      <p class="meta-text">{{ copy.lead }}</p>
    </header>

    <Alert v-if="error" tone="bad">{{ error }}</Alert>

    <ul v-if="motorcycles.length" class="cuenta-motos">
      <li v-for="(moto, index) in motorcycles" :key="moto.id" class="cuenta-moto">
        <div class="cuenta-moto__info">
          <strong>{{ label(moto) }}</strong>
          <span class="meta-text">
            <template v-if="moto.cc">{{ moto.cc }} cc</template>
            <span v-if="index === 0" class="cuenta-moto__main">{{ copy.main }}</span>
          </span>
        </div>
        <Button
          :variant="confirmId === moto.id ? 'danger' : 'ghost'"
          size="sm"
          :disabled="busy"
          @click="remove(moto.id)"
        >
          {{ confirmId === moto.id ? copy.removeConfirm : copy.remove }}
        </Button>
      </li>
    </ul>
    <p v-else class="meta-text cuenta-motos__empty">{{ copy.empty }}</p>

    <Alert v-if="isFull" tone="info">{{ copy.max }}</Alert>

    <form v-else class="cuenta-card__form cuenta-card__block" @submit.prevent="add">
      <Alert v-if="catalogFailed" tone="info">{{ copy.catalogFail }}</Alert>

      <div v-if="!catalogFailed" class="cuenta-motos__pick">
        <Select v-model="brand" :label="copy.brand" :options="brandOptions" />
        <Select
          v-if="brand && brand !== OTHER"
          v-model="modelId"
          :label="copy.model"
          :options="modelOptions"
        />
      </div>

      <div v-if="brand && isOtherModel" class="cuenta-motos__custom">
        <Field v-if="isOtherBrand" :label="copy.brand">
          <Input v-model="customBrand" :placeholder="copy.customBrand" />
        </Field>
        <Field :label="copy.model">
          <Input v-model="customModel" :placeholder="copy.customModel" />
        </Field>
        <Field :label="copy.cc">
          <Input v-model="customCc" type="number" :placeholder="copy.ccPlaceholder" />
        </Field>
      </div>

      <div class="cuenta-card__actions">
        <Button type="submit" size="sm" :disabled="!canAdd">{{ copy.add }}</Button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.cuenta-motos {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.cuenta-moto {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid rgba(72, 180, 252, 0.18);
  border-radius: 10px;
  background: rgba(5, 7, 12, 0.5);
}

.cuenta-moto__info {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.cuenta-moto__info strong {
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

.cuenta-moto__main {
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #48b4fc;
  border: 1px solid rgba(72, 180, 252, 0.45);
}

.cuenta-motos__empty {
  margin: 0;
}

.cuenta-motos__pick,
.cuenta-motos__custom {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.cuenta-motos__pick :deep(.list-select__menu) {
  max-height: 320px;
  overflow-y: auto;
}
</style>
