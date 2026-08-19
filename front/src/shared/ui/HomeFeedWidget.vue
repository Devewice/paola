<script setup lang="ts">
import Button from '@ui/Button.vue'

defineProps<{
  title?: string
  meta?: string
  linkHref?: string
  to?: string
  linkLabel?: string
}>()
</script>

<template>
  <div class="home-dash__cell" style="min-height: auto">
    <h4>{{ title ?? 'De tus comunidades' }}</h4>
    <p v-if="meta" class="meta" style="margin: 0 0 8px">{{ meta }}</p>
    <p v-else-if="!$slots.default" class="meta" style="margin: 0 0 8px">
      2 posts nuevos · sin scroll infinito
    </p>
    <div v-if="$slots.default" class="stack" style="margin-bottom: 12px">
      <slot />
    </div>
    <Button v-if="to" variant="ghost" size="sm" :to="to">{{ linkLabel ?? 'Ver feed →' }}</Button>
    <a
      v-else
      :href="linkHref ?? '#comunidad'"
      style="color: var(--cyan); font-size: 13px"
    >{{ linkLabel ?? 'Ver feed →' }}</a>
  </div>
</template>
