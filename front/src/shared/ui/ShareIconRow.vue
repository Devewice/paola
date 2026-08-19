<script setup lang="ts">
import Icon from '@ui/Icon.vue'

defineProps<{
  showAnchor?: boolean
  showNative?: boolean
}>()
</script>

<template>
  <div class="share-row">
    <button type="button" class="icon-btn" aria-label="Copiar enlace">
      <Icon name="copy" :circle="false" size="sm" />
    </button>
    <button type="button" class="icon-btn icon-btn--wa" aria-label="Compartir por WhatsApp">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3a8.5 8.5 0 0 0-7.3 12.9L4 21l5.2-1.4A8.5 8.5 0 1 0 12 3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M9.2 10.2c.2.5.9 2.1 2.4 3.1 1.5 1 2.7 1.1 3.1 1.2.4.1 1-.4 1.2-.9.2-.5.2-.9.1-1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
    <button v-if="showAnchor !== false" type="button" class="icon-btn" aria-label="Copiar enlace con ancla">
      <Icon name="link" :circle="false" size="sm" />
    </button>
    <button v-if="showNative !== false" type="button" class="icon-btn" aria-label="Compartir nativo">
      <Icon name="share" :circle="false" size="sm" />
    </button>
  </div>
</template>
