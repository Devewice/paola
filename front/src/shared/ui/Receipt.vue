<script setup lang="ts">
defineProps<{
  title?: string
  meta: string
  lines: readonly { label: string; value: string; discount?: boolean; total?: boolean }[]
}>()
</script>

<template>
  <div class="receipt">
    <div class="receipt__head">
      <img src="/kit-assets/logo.png" width="32" height="32" alt="" />
      <p style="margin: 0; font-family: var(--display)">{{ title ?? 'Paola Biker' }}</p>
      <p class="meta" style="margin: 4px 0 0">{{ meta }}</p>
    </div>
    <ul class="invoice-lines">
      <li v-for="line in lines" :key="line.label" :class="{ 'is-discount': line.discount }">
        <strong v-if="line.total">{{ line.label }}</strong>
        <span v-else>{{ line.label }}</span>
        <strong v-if="line.total">{{ line.value }}</strong>
        <span v-else>{{ line.value }}</span>
      </li>
    </ul>
  </div>
</template>
