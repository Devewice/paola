<script setup lang="ts">
import Icon from '@ui/Icon.vue'

defineProps<{
  url: string
  whatsapp?: boolean
  anchor?: boolean
}>()
</script>

<template>
  <div class="share-row">
    <input class="input" :value="url" readonly />
    <button type="button" class="icon-btn" aria-label="Copiar enlace">
      <Icon name="copy" :circle="false" size="sm" />
    </button>
    <button v-if="whatsapp" type="button" class="icon-btn icon-btn--wa" aria-label="Compartir por WhatsApp">
      <Icon name="share" :circle="false" size="sm" />
    </button>
    <button v-else type="button" class="icon-btn" aria-label="Compartir">
      <Icon name="share" :circle="false" size="sm" />
    </button>
    <button v-if="anchor" type="button" class="icon-btn" aria-label="Copiar enlace a comentarios">
      <Icon name="link" :circle="false" size="sm" />
    </button>
  </div>
</template>
