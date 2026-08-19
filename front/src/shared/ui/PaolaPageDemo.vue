<script setup lang="ts">
import PaolaBlock from '@ui/PaolaBlock.vue'
</script>

<template>
  <div class="paola-page">
    <PaolaBlock voice="armargura" voice-label="Armargura" title="La razón" copy="Texto placeholder · relato personal" />
    <PaolaBlock title="¿Quién es Paola?" copy="Placeholder · no inventar biografía" />
    <div class="arsenal-grid arsenal-grid--2" style="gap: 12px; margin: 0">
      <PaolaBlock title="¿Por qué?" copy="—" />
      <PaolaBlock title="¿Para qué?" copy="—" />
    </div>
    <PaolaBlock voice="loigca" voice-label="Loigca · contacto">
      <div class="paola-contact">
        <a href="#"><span class="icon" style="width: 36px; height: 36px">W</span>WhatsApp · próx.</a>
        <a href="#"><span class="icon" style="width: 36px; height: 36px">@</span>Correo · próx.</a>
        <span><span class="icon" style="width: 36px; height: 36px">▶</span>Video · próx.</span>
      </div>
      <p class="meta" style="margin: 12px 0 0">Redes · links por definir</p>
    </PaolaBlock>
  </div>
</template>
