<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { COMING_SOON_DEFAULT_TITLE } from '@app/constants/copy.ts'
import PageVacant from '@ui/PageVacant.vue'

const route = useRoute()
const title = computed(() => String(route.meta.title ?? COMING_SOON_DEFAULT_TITLE))
</script>

<template>
  <PageVacant :title="title" />
</template>
