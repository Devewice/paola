<script setup lang="ts">
import { dismissToast, toastState, TOAST_COPY } from './toast.ts'
</script>

<template>
  <div class="toast-stack" aria-live="polite">
    <div
      v-for="item in toastState.items"
      :key="item.id"
      class="toast"
      :class="`toast--${item.tone}`"
      role="status"
    >
      <div class="toast__body">
        <p class="toast__title">{{ item.title }}</p>
        <p class="toast__msg">{{ item.message }}</p>
      </div>
      <button
        type="button"
        class="toast__close"
        :aria-label="TOAST_COPY.close"
        @click="dismissToast(item.id)"
      >
        ×
      </button>
    </div>
  </div>
</template>
