<script setup lang="ts">
import { POST_REACTION } from '@shared/http/constants.ts'
import Icon from '@ui/Icon.vue'

withDefaults(
  defineProps<{
    likes?: number
    there?: number
    fire?: number
    commentsLabel?: string
  }>(),
  {},
)

const emit = defineEmits<{
  react: [reaction: string]
  share: []
}>()

const late = POST_REACTION.LATE
const ahi = POST_REACTION.AHI
</script>

<template>
  <div class="engage-bar" aria-label="Reacciones">
    <div class="reaction-bar">
      <button type="button" class="is-on" @click="emit('react', late)">
        <Icon name="heart" :circle="false" size="sm" tone="cyan" />
        <template v-if="likes != null">{{ likes }}</template>
      </button>
      <button type="button" @click="emit('react', ahi)">
        <Icon name="camera" :circle="false" size="sm" />
        <template v-if="there != null">{{ there }}</template>
      </button>
      <button v-if="fire != null" type="button">
        <Icon name="fire" :circle="false" size="sm" tone="cyan" />
        {{ fire }}
      </button>
      <button v-else type="button" aria-label="Compartir" @click="emit('share')">
        <Icon name="share" :circle="false" size="sm" />
      </button>
    </div>
    <span v-if="commentsLabel" class="meta">{{ commentsLabel }}</span>
  </div>
</template>
