<script setup lang="ts">
import { NOT_FOUND_COPY } from '@app/constants/copy.ts'
import PageVacant from '@ui/PageVacant.vue'

const copy = NOT_FOUND_COPY
</script>

<template>
  <PageVacant :title="copy.title" :kicker="copy.kicker" :copy="copy.lead" />
</template>
