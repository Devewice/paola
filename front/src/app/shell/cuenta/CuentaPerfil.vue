<script setup lang="ts">
import CuentaDatos from '@app/shell/cuenta/CuentaDatos.vue'
import CuentaMotos from '@app/shell/cuenta/CuentaMotos.vue'
import { useCuenta } from '@app/shell/cuenta/context.ts'

const { account, logout } = useCuenta()
</script>

<template>
  <div class="cuenta-perfil" data-reveal>
    <CuentaDatos :account="account" @logout="logout" />
    <CuentaMotos :account="account" />
  </div>
</template>

<style scoped>
.cuenta-perfil {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  align-items: start;
}

@media (max-width: 959px) {
  .cuenta-perfil {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
