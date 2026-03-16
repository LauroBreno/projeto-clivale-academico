<script setup>
import { ref } from 'vue'
import Registro from './components/Registro.vue'
import Login from './components/Login.vue'
import TelaCliente from './components/TelaCliente.vue'
import './assets/global.css' // Importa o CSS global aqui
const telaAtual = ref('cliente')

const logarUsuario = (cargo) => {
  if (cargo === 'Admin') {
    telaAtual.value = 'painel-adm';
  } else {
    telaAtual.value = 'cliente';
  }
};

</script>

<template>
  <div class="main-container">
    <Registro v-if="telaAtual === 'cadastro'" @irParaLogin="telaAtual = 'login'" />
    <Login v-else-if="telaAtual === 'login'" @irParaCadastro="telaAtual = 'cadastro'"
    @loginSucesso="logarUsuario" />
    <TelaCliente v-else-if="telaAtual === 'cliente'"
    @sair="telaAtual = 'login'" />
  </div>
</template>

<style scoped>

</style>