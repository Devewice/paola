<script setup lang="ts">
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaChip from '@ui/PaolaChip.vue'
import PaolaIcon from '@ui/PaolaIcon.vue'

withDefaults(
  defineProps<{
    title: string
    meta: string
    featured?: boolean
    status?: 'abierto' | 'lleno' | 'cerrado' | 'realizado'
  }>(),
  { status: 'abierto' },
)
</script>

<template>
  <article class="paola-ride" :class="{ 'paola-ride--featured': featured }">
    <div class="paola-ride__media">Foto</div>
    <div class="paola-ride__body">
      <PaolaChip :tone="status">{{ status }}</PaolaChip>
      <h3 class="paola-ride__title">{{ title }}</h3>
      <p class="paola-ride__meta">
        <PaolaIcon name="pin" size="sm" :circle="false" />
        {{ meta }}
      </p>
      <PaolaButton size="sm">Apúntese pa rodar</PaolaButton>
    </div>
  </article>
</template>
