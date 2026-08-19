<script setup lang="ts">
withDefaults(
  defineProps<{
    author: string
    body: string
    time?: string
    avatar?: string
    pinned?: boolean
    pending?: boolean
    edited?: string
    memberBadge?: string
  }>(),
  { avatar: '' },
)

const initial = (name: string) => name.trim().charAt(0).toUpperCase() || '?'
</script>

<template>
  <div v-if="pinned" class="comment-item--pinned">
    <p class="comment-pin-label">Fijado · Paola</p>
    <article class="comment-item">
      <div class="comment-item__avatar">{{ avatar || initial(author) }}</div>
      <div>
        <div class="comment-item__head">
          <span class="comment-item__author">{{ author }}</span>
          <span v-if="memberBadge" class="integrante-badge">{{ memberBadge }}</span>
          <span v-if="time" class="comment-item__time">{{ time }}</span>
        </div>
        <div class="comment-item__body">
          <p v-if="!$slots.body">{{ body }}</p>
          <slot name="body" />
        </div>
        <slot />
      </div>
    </article>
  </div>
  <article v-else class="comment-item" :class="{ 'comment-item--pending': pending }">
    <div class="comment-item__avatar">{{ avatar || initial(author) }}</div>
    <div>
      <div class="comment-item__head">
        <span class="comment-item__author">{{ author }}</span>
        <span v-if="memberBadge" class="integrante-badge">{{ memberBadge }}</span>
        <span v-if="time" class="comment-item__time">{{ time }}</span>
      </div>
      <div class="comment-item__body">
        <p v-if="!$slots.body">{{ body }}</p>
        <slot name="body" />
      </div>
      <span v-if="edited" class="comment-edited">{{ edited }}</span>
      <div v-if="$slots.actions" class="comment-item__actions">
        <slot name="actions" />
      </div>
      <slot />
    </div>
  </article>
</template>
