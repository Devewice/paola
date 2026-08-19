<script setup lang="ts">
defineProps<{
  title?: string
  items: readonly { title: string; meta: string; href: string }[]
  bare?: boolean
}>()
</script>

<template>
  <ul v-if="bare" class="action-list">
    <li v-for="item in items" :key="item.title">
      <a class="action-list__row" :href="item.href">
        <span class="action-list__body">
          <span class="action-list__title">{{ item.title }}</span>
          <span class="action-list__meta">{{ item.meta }}</span>
        </span>
        <span class="action-list__chev" aria-hidden="true">›</span>
      </a>
    </li>
  </ul>
  <div v-else class="settings-group">
    <p v-if="title" class="settings-group__title">{{ title }}</p>
    <ul class="action-list" style="border: 0; border-radius: 0">
      <li v-for="item in items" :key="item.title">
        <a class="action-list__row" :href="item.href">
          <span class="action-list__body">
            <span class="action-list__title">{{ item.title }}</span>
            <span class="action-list__meta">{{ item.meta }}</span>
          </span>
          <span class="action-list__chev">›</span>
        </a>
      </li>
    </ul>
  </div>
</template>
