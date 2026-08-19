<script setup lang="ts">
defineProps<{
  avatar?: string
  name?: string
  badge?: string
  meta?: string
  footnote?: string
}>()
</script>

<template>
  <div class="profile-public">
    <div class="profile-public__avatar">{{ avatar ?? 'A' }}</div>
    <div>
      <strong>{{ name ?? 'Alias placeholder' }}</strong>
      <span v-if="badge" class="integrante-badge" style="margin-left:6px">{{ badge }}</span>
      <p class="meta" style="margin:6px 0">{{ meta ?? 'Km opcional · — · moto opcional' }}</p>
      <p class="meta" style="margin:0">{{ footnote ?? 'Sin WhatsApp · sin correo · ficha mínima' }}</p>
    </div>
  </div>
</template>
