<template>
  <div class="where-we-talk">
    <div class="where-we-talk__col where-we-talk__col--wa">
      <strong>WhatsApp</strong>
      <slot name="wa">
        <p class="meta" style="margin: 8px 0">El chat del día a día. No se apaga cuando existe la web.</p>
      </slot>
    </div>
    <div class="where-we-talk__col where-we-talk__col--web">
      <strong>Web</strong>
      <slot name="web">
        <p class="meta" style="margin: 8px 0">Aquí quedan las rodadas, el cupo, la tienda, Tu voz y las comunidades.</p>
      </slot>
    </div>
  </div>
</template>
