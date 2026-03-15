<script setup>
import { ref } from 'vue'
import Registro from './components/Registro.vue'
import Login from './components/Login.vue'
import './assets/global.css' // Importa o CSS global aqui

const telaAtual = ref('cadastro')
</script>

<template>
  <div class="main-container">
    <Registro v-if="telaAtual === 'cadastro'" @irParaLogin="telaAtual = 'login'" />
    <Login v-else @irParaCadastro="telaAtual = 'cadastro'" />
  </div>
</template>