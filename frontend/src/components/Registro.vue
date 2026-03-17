<template>
  <div class="card-clivale">
    <div class="logo-wrapper">
      <img src="../assets/clivale.png" alt="Clivale Mais" class="logo-img" />
    </div>

    <div class="stepper-wrapper-outer">
      <p class="stepper-phrase">VOCÊ ESTÁ EM:</p>
      <div class="stepper-container">
        <div class="stepper-labels">
          <span :class="{ active: step === 1 }" @click="step = 1">1. IDENTIFICAÇÃO</span>
          <span :class="{ active: step === 2 }" @click="validarEtapa1">2. ENDEREÇO</span>
          <span :class="{ active: step === 3 }" @click="validarEtapa2">3. FINALIZAÇÃO</span>
        </div>
      </div>
    </div>

    <form @submit.prevent="finalizar" class="form-content">
      <div class="steps-body">
        <div v-show="step === 1" class="inputs-group">
          <div class="floating-group">
            <input type="text" v-model="form.nome" placeholder=" " required />
            <label>Nome Completo *</label>
          </div>
          <div class="floating-group">
            <input type="text" v-model="form.cpf" placeholder=" " maxlength="14" @input="mascararCPF" required />
            <label>CPF *</label>
          </div>
          <div class="floating-group">
            <input type="email" v-model="form.email" placeholder=" " required />
            <label>E-mail *</label>
          </div>
          <div class="floating-group">
            <input type="text" v-model="form.nascimento" placeholder=" " maxlength="10" @input="mascararData" required />
            <label>Data de Nascimento *</label>
          </div>
        </div>

        <div v-show="step === 2" class="inputs-group">
          <div class="input-wrapper floating-group">
            <input type="text" v-model="form.cep" placeholder=" " maxlength="9" :disabled="cepBloqueado" @input="mascararCEP" required />
            <label>CEP *</label>
            <button v-if="cepBloqueado" type="button" @click="editarCep" class="inner-icon">Editar</button>
          </div>
          <div class="floating-group">
            <input type="text" :value="form.rua && form.bairro ? `${form.rua}, ${form.bairro}` : ''" placeholder=" " disabled />
            <label>Rua e Bairro</label>
          </div>
          <div class="floating-group">
            <input type="text" v-model="form.cidadeEstado" placeholder=" " disabled />
            <label>Cidade/Estado</label>
          </div>
          <div class="floating-group">
            <input type="text" v-model="form.numeroComplemento" placeholder=" " />
            <label>Número / Complemento (Opcional)</label>
          </div>
        </div>

        <div v-show="step === 3" class="inputs-group">
          <div class="floating-group">
            <input type="text" v-model="form.tel1" placeholder=" " maxlength="15" @input="e => mascararTel(e, 'tel1')" required />
            <label>Telefone 1 (WhatsApp) *</label>
          </div>
          <div class="floating-group">
            <input type="text" v-model="form.tel2" placeholder=" " maxlength="15" @input="e => mascararTel(e, 'tel2')" />
            <label>Telefone 2 (Opcional)</label>
          </div>
          <div class="input-wrapper floating-group">
            <input :type="showPass ? 'text' : 'password'" v-model="form.senha" placeholder=" " required />
            <label>Senha *</label>
            <span class="inner-icon" @click="showPass = !showPass">{{ showPass ? 'Ocultar' : 'Mostrar' }}</span>
          </div>
          <div class="floating-group">
            <input :type="showPass ? 'text' : 'password'" v-model="form.confirmarSenha" placeholder=" " required />
            <label>Confirmar Senha *</label>
          </div>
        </div>
      </div>

      <div class="footer-actions">
        <button v-if="step < 3" type="button" class="btn-main" @click="proximo">PRÓXIMO</button>
        <button v-if="step === 3" type="submit" class="btn-main">FINALIZAR CADASTRO</button>
        <button v-if="step > 1" type="button" class="btn-back" @click="step--">VOLTAR</button>
      </div>
    </form>

    <p v-if="step === 1" class="toggle-page" @click="$emit('irParaLogin')">Já tem conta? <strong>Faça Login</strong></p>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import axios from 'axios'

const step = ref(1)
const showPass = ref(false)
const cepBloqueado = ref(false)
const emit = defineEmits(['irParaLogin'])

const form = reactive({
  nome: '', cpf: '', email: '', nascimento: '',
  cep: '', rua: '', bairro: '', cidadeEstado: '', numeroComplemento: '',
  tel1: '', tel2: '', senha: '', confirmarSenha: ''
})

// MÁSCARAS
const mascararCPF = (e) => {
  let v = e.target.value.replace(/\D/g, "");
  v = v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  form.cpf = v;
}

const mascararData = (e) => {
  let v = e.target.value.replace(/\D/g, "");
  v = v.replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2");
  form.nascimento = v;
}

const mascararTel = (e, campo) => {
  let v = e.target.value.replace(/\D/g, "");
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  form[campo] = v;
}

const mascararCEP = (e) => {
  let v = e.target.value.replace(/\D/g, "");
  v = v.replace(/(\d{5})(\d)/, "$1-$2");
  form.cep = v;
}

// LÓGICA DE CEP
watch(() => form.cep, async (val) => {
  const clean = val.replace(/\D/g, '');
  if (clean.length === 8) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        form.rua = data.logradouro; 
        form.bairro = data.bairro;
        form.cidadeEstado = `${data.localidade}/${data.uf}`;
        cepBloqueado.value = true;
      }
    } catch (e) { console.error("Erro Viacep"); }
  }
});

const editarCep = () => { 
  cepBloqueado.value = false; 
  form.cep = ''; form.rua = ''; form.bairro = ''; form.cidadeEstado = ''; 
}

const validarEtapa1 = () => {
  if (!form.nome.includes(' ')) return alert("Nome completo obrigatório.");
  if (form.cpf.length < 14) return alert("CPF incompleto.");
  step.value = 2;
}

const validarEtapa2 = () => {
  if (!form.cep) return alert("CEP é obrigatório.");
  step.value = 3;
}

const proximo = () => {
  if (step.value === 1) validarEtapa1();
  else if (step.value === 2) validarEtapa2();
}

const finalizar = async () => {
  if (form.senha !== form.confirmarSenha) return alert("As senhas não batem.");
  try {
    const payload = { ...form, ruaBairro: `${form.rua}, ${form.bairro}` };
    await axios.post('http://localhost:5000/api/usuarios/registrar', payload);
    alert("Cadastro realizado!");
    emit('irParaLogin');
  } catch (err) { alert("Erro ao cadastrar"); }
}
</script>

<style scoped>

.form-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.steps-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 220px; 
}

.inputs-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-actions {
  margin-top: 20px; 
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.btn-back {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 5px;
}
</style>