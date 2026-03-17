<script setup>
import { ref } from "vue";
import Registro from "./components/Registro.vue";
import Login from "./components/Login.vue";
import TelaCliente from "./components/TelaCliente.vue";
import TelaSecretaria from "./components/TelaSecretaria.vue";
import "./assets/global.css"; // Importa o CSS global aqui
const telaAtual = ref("login");
const usuarioLogado = ref(null);

const logarUsuario = (dados) => {
  usuarioLogado.value = dados.usuario;
  if (dados.cargo.toLowerCase() === "admin") {
    telaAtual.value = "painel-adm";
  } else {
    telaAtual.value = "cliente";
  }
};
</script>

<template>
  <div class="main-container">
    <Registro
      v-if="telaAtual === 'cadastro'"
      @irParaLogin="telaAtual = 'login'"
    />
    <Login
      v-else-if="telaAtual === 'login'"
      @irParaCadastro="telaAtual = 'cadastro'"
      @loginSucesso="logarUsuario"
    />
    <TelaCliente
      v-else-if="telaAtual === 'cliente'"
      @sair="telaAtual = 'login'"
    />
    <TelaSecretaria
      v-else-if="telaAtual === 'painel-adm'"
      :usuario="usuarioLogado"
      @sair="telaAtual = 'login'"
    />
  </div>
</template>

<style scoped></style>