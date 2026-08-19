<script setup lang="ts">
defineProps<{
  title?: string
  meta?: string
  linkHref?: string
  linkLabel?: string
}>()
</script>

<template>
  <div class="home-dash__cell" style="min-height:auto;padding:14px;background:var(--navy)">
    <h4 style="font-family:var(--display);font-size:12px;color:var(--cyan);margin:0 0 8px">{{ title ?? 'De tus comunidades' }}</h4>
    <p class="meta" style="margin:0 0 8px">{{ meta ?? '2 posts nuevos · sin scroll infinito' }}</p>
    <a :href="linkHref ?? '#comunidad'" style="color:var(--cyan);font-size:13px">{{ linkLabel ?? 'Ver feed →' }}</a>
  </div>
</template>
