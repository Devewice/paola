<script setup lang="ts">
defineProps<{
  title: string
  lead?: string
  count?: number
}>()
</script>

<template>
  <section class="admin-card admin-pane">
    <header class="admin-pane__head">
      <div class="admin-card__head">
        <h3>
          {{ title }}
          <span v-if="count !== undefined" class="admin-pane__count">{{ count }}</span>
        </h3>
        <p v-if="lead">{{ lead }}</p>
      </div>
      <div v-if="$slots.actions" class="admin-pane__actions">
        <slot name="actions" />
      </div>
    </header>
    <slot />
  </section>
</template>
