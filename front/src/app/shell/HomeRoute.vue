<script setup lang="ts">
import { getAppDependencies } from '@app/bootstrap.ts'
import HomeView from '@modules/home/presentation/HomeView.vue'

const { home } = getAppDependencies()
</script>

<template>
  <HomeView :module="home" />
</template>
