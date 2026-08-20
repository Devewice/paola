<script setup lang="ts">
import { getAppDependencies } from '@app/bootstrap.ts'
import PaolaView from '@modules/paola/presentation/PaolaView.vue'

const { paola } = getAppDependencies()
</script>

<template>
  <PaolaView :module="paola" />
</template>
