<script setup lang="ts">
defineProps<{
  units: readonly { value: string; label: string }[]
  note?: string
}>()
</script>

<template>
  <div>
    <div class="countdown" aria-label="Cuenta regresiva">
      <div v-for="unit in units" :key="unit.label" class="countdown__unit">
        <strong>{{ unit.value }}</strong>
        <span>{{ unit.label }}</span>
      </div>
    </div>
    <p v-if="note" class="meta" style="margin: 10px 0 0; text-align: center">{{ note }}</p>
  </div>
</template>
