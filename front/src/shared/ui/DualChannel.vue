<template>
  <div class="where-we-talk">
    <div class="where-we-talk__col where-we-talk__col--wa">
      <strong>WhatsApp</strong>
      <slot name="wa">
        <p class="meta" style="margin: 8px 0">El grupo del día a día.</p>
      </slot>
    </div>
    <div class="where-we-talk__col where-we-talk__col--web">
      <strong>Web</strong>
      <slot name="web">
        <p class="meta" style="margin: 8px 0">Las rodadas, el cupo y la tienda.</p>
      </slot>
    </div>
  </div>
</template>
