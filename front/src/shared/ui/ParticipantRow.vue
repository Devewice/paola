<script setup lang="ts">
defineProps<{
  avatar: string
  alias: string
  vehicle?: string
  instagram?: string
  instagramHref?: string
}>()
</script>

<template>
  <div class="participant-row">
    <span class="member-card__avatar" style="width:32px;height:32px;font-size:11px">{{ avatar }}</span>
    {{ alias }}
    <template v-if="vehicle"> · <span class="vehicle-tag">{{ vehicle }}</span></template>
    <template v-if="instagram">
      · <a v-if="instagramHref" class="ig-credit" :href="instagramHref">{{ instagram }}</a>
      <span v-else>{{ instagram }}</span>
    </template>
  </div>
</template>
