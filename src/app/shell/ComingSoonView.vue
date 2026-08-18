<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta.title)
</script>

<template>
  <v-container class="py-12" style="max-width: 40rem">
    <p class="text-overline text-primary mb-2">Paola</p>
    <h1 class="text-h4 font-weight-bold mb-4">{{ title }}</h1>
    <p class="text-body-1 text-medium-emphasis mb-0">
      Próximamente. Esta pestaña todavía no tiene contenido.
    </p>
  </v-container>
</template>
