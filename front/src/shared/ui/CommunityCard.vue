<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    meta: string
    cover?: string
  }>(),
  { cover: '' },
)

const initial = (name: string) => name.trim().charAt(0).toUpperCase() || '?'
</script>

<template>
  <article class="community-card">
    <div class="community-card__head">
      <div class="community-card__cover">{{ cover || initial(title) }}</div>
      <div>
        <strong>{{ title }}</strong>
        <p class="meta" style="margin: 4px 0 0">{{ meta }}</p>
        <slot name="channels" />
      </div>
    </div>
    <slot />
    <div v-if="$slots.actions" class="community-card__actions">
      <slot name="actions" />
    </div>
  </article>
</template>
