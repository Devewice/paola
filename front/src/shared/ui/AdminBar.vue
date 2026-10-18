<script setup lang="ts">
import { ref } from 'vue'
import AppLink from '@ui/AppLink.vue'

defineProps<{
  label: string
  who?: string
  editing: boolean
  editLabel: string
  editHint?: string
  createLabel?: string
  createItems?: readonly { label: string; to: string }[]
  links?: readonly { label: string; to: string }[]
}>()

const emit = defineEmits<{ 'update:editing': [value: boolean] }>()

const menu = ref<HTMLDetailsElement | null>(null)

function closeMenu(): void {
  if (menu.value) menu.value.open = false
}
</script>

<template>
  <div class="admin-bar" role="region" :aria-label="label">
    <div class="admin-bar__inner">
      <span class="admin-bar__brand">
        <strong>{{ label }}</strong>
        <span v-if="who" class="admin-bar__who">{{ who }}</span>
      </span>

      <label class="admin-bar__toggle" :title="editHint">
        <input
          type="checkbox"
          :checked="editing"
          @change="emit('update:editing', ($event.target as HTMLInputElement).checked)"
        />
        <span class="admin-bar__switch" aria-hidden="true" />
        <span>{{ editLabel }}</span>
      </label>

      <details v-if="createItems?.length" ref="menu" class="admin-bar__menu">
        <summary class="admin-bar__link">+ {{ createLabel }}</summary>
        <div class="admin-bar__drop">
          <AppLink v-for="item in createItems" :key="item.to" :to="item.to" @click="closeMenu">
            {{ item.label }}
          </AppLink>
        </div>
      </details>

      <span class="admin-bar__spacer" />

      <AppLink v-for="item in links" :key="item.to" class="admin-bar__link" :to="item.to">
        {{ item.label }}
      </AppLink>
    </div>
  </div>
</template>
