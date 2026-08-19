<script setup lang="ts">
import { getAppDependencies } from '@app/bootstrap.ts'
import AllianceStrip from '@ui/AllianceStrip.vue'

const { club } = getAppDependencies()
const alliances = club.getAlliances()
</script>

<template>
  <AllianceStrip :alliances="alliances" />
</template>
