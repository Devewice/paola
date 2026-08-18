<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PaolaEmpty from '@ui/PaolaEmpty.vue'

const route = useRoute()
const title = computed(() => route.meta.title)
</script>

<template>
  <PaolaEmpty :title="title" />
</template>
