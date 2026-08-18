<script setup lang="ts">
import { getAppDependencies } from '@app/bootstrap.ts'
import PaolaAllianceStrip from '@ui/PaolaAllianceStrip.vue'

const { club } = getAppDependencies()
const alliances = club.getAlliances()
</script>

<template>
  <PaolaAllianceStrip :alliances="alliances" />
</template>
