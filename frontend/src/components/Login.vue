<template>
  <div class="card-clivale login-adjust">
    <div class="logo-wrapper">
      <img src="../assets/clivale.png" alt="Logo Clivale" class="logo-img">
    </div>

    <div class="welcome-section">
      <h2>Olá! Que bom te ver.</h2>
      <p>Acesse sua conta para continuar.</p>
    </div>

    <form @submit.prevent="fazerLogin" class="form-content login-form">
      <div class="inputs-group">
        <div class="floating-group">
          <input type="email" v-model="email" required placeholder=" ">
          <label>E-mail</label>
        </div>

        <div class="input-wrapper floating-group">
          <input :type="showPass ? 'text' : 'password'" v-model="senha" required placeholder=" ">
          <label>Senha</label>
          <span class="inner-icon" @click="showPass = !showPass">
            {{ showPass ? 'Ocultar' : 'Mostrar' }}
          </span>
        </div>
      </div>

      <div class="footer-actions">
        <button type="submit" class="btn-main">ENTRAR NA CONTA</button>
      </div>
    </form>
    
    <p @click="$emit('irParaCadastro')" class="toggle-page">
      Não tem conta? <strong>Cadastre-se aqui</strong>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const senha = ref('');
const showPass = ref(false);
const emit = defineEmits(['irParaCadastro', 'loginSucesso']);

const fazerLogin = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/usuarios/login', {
      email: email.value,
      senha: senha.value
    });

  if (res.status === 200) {
    const cargo = res.data.cargo;
    // 'admin' ou 'Cliente'

    alert("Bem-vindo, " + res.data.usuario.nome);
    emit('loginSucesso', { cargo: cargo, usuario: res.data.usuario });
  }
  } catch (err) {
    alert(err.response?.data?.message || "Erro ao fazer login");
  }
};
</script>

<style scoped>
.form-content {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: auto;
}

.login-adjust {
  display: flex;
  flex-direction: column;
}

.welcome-section {
  text-align: center;
  margin-top: 5px;
  margin-bottom: 15px;
}

.welcome-section h2 {
  color: #002D5E;
  font-size: 18px;
  font-weight: 800;
  margin-top: 10px;
  margin-bottom: 10px;
}

.welcome-section p {
  color: #94a3b8;
  font-size: 14px;
}

.footer-actions {
  margin-top: 40px;
  padding-bottom: 5px;
}
</style>