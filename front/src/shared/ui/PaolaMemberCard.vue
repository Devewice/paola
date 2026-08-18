<script setup lang="ts">
const props = defineProps<{
  alias: string
  photoSrc?: string
  moto?: string
  instagramHref?: string
}>()

const initial = () => props.alias.trim().charAt(0).toUpperCase() || '?'
</script>

<template>
  <article class="paola-member">
    <img
      v-if="photoSrc"
      class="paola-member__avatar"
      :src="photoSrc"
      :alt="alias"
      width="56"
      height="56"
    />
    <span v-else class="paola-member__avatar" aria-hidden="true">{{ initial() }}</span>
    <div class="paola-member__body">
      <h3 class="paola-member__alias">{{ alias }}</h3>
      <p v-if="moto" class="paola-member__meta">{{ moto }}</p>
      <a
        v-if="instagramHref"
        class="paola-member__ig"
        :href="instagramHref"
        target="_blank"
        rel="noopener noreferrer"
      >
        Instagram
      </a>
    </div>
  </article>
</template>
