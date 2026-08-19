<script setup lang="ts">
defineProps<{
  name: string
  meta: string
  initial?: string
}>()
</script>

<template>
  <div class="profile-head">
    <div class="profile-head__cover" />
    <div class="profile-head__body">
      <div class="profile-head__avatar">{{ initial ?? name.charAt(0) }}</div>
      <div>
        <p class="profile-head__name">{{ name }}</p>
        <p class="meta" style="margin: 0">{{ meta }}</p>
      </div>
    </div>
  </div>
</template>
