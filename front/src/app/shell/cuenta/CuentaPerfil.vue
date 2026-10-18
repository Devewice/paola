<script setup lang="ts">
import CuentaDatos from '@app/shell/cuenta/CuentaDatos.vue'
import CuentaEmergencia from '@app/shell/cuenta/CuentaEmergencia.vue'
import CuentaMotos from '@app/shell/cuenta/CuentaMotos.vue'
import { useCuenta } from '@app/shell/cuenta/context.ts'

const { account, logout } = useCuenta()
</script>

<template>
  <div class="cuenta-perfil" data-reveal>
    <div class="cuenta-perfil__col">
      <CuentaDatos :account="account" @logout="logout" />
    </div>
    <div class="cuenta-perfil__col">
      <CuentaMotos :account="account" />
      <CuentaEmergencia :account="account" />
    </div>
  </div>
</template>

<style scoped>
.cuenta-perfil {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  align-items: start;
}

.cuenta-perfil__col {
  display: grid;
  gap: 20px;
  min-width: 0;
}

@media (max-width: 959px) {
  .cuenta-perfil,
  .cuenta-perfil__col {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
