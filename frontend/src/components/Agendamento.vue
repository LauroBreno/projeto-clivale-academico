<template>
  <div class="agendamento-root">
    <header class="main-agend-fixo">
      <div class="header-content-agend">
        <div class="logo-container-agend" 
        @click="$emit('voltar')">
          <img
            src="../assets/clivale.png"
            alt="Logo Clivale"
            class="logo-agend"
          />
        </div>
        <div
          class="user-menu-agend"
          @mouseenter="showMenu = true"
          @mouseleave="showMenu = false"
        >
          <div class="user-info-agend">
            <span class="welcome-text-agend">Olá, <strong>Lauro</strong>!</span>
            <span class="sub-phrase-agend"
              >Agende sua saúde com facilidade.</span
            >
          </div>
          <div class="avatar-circle-agend">L</div>
          <transition name="fade">
            <div v-if="showMenu" class="dropdown-menu-agend">
              <div class="dropdown-item">Meu Perfil</div>
              <div class="dropdown-item">Consultas</div>
              <div class="dropdown-item">Exames</div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item logout" @click="$emit('sair')">
                Sair
              </div>
            </div>
          </transition>
        </div>
      </div>
    </header>

      <section class="scheduling-container">
        <div class="toggle-container">
          <div class="toggle-box" @click="isExame = !isExame">
            <div class="toggle-slider" :class="{ 'is-right': isExame }"></div>
            <span class="toggle-label" :class="{ active: !isExame }"
              >Consultas</span
            >
            <span class="toggle-label" :class="{ active: isExame }"
              >Exames</span
            >
          </div>
        </div>

        <div class="title-wrapper">
          <transition name="slide-up" mode="out-in">
            <h2 :key="isExame" class="page-main-title">
              {{ isExame ? "Marcar Novo Exame" : "Marcar Nova Consulta" }}
            </h2>
          </transition>
          <p class="page-sub-title">
            Selecione os detalhes abaixo para confirmar seu horário.
          </p>
        </div>

        <div class="scheduling-grid">
          <div class="card-style">
            <div class="input-group">
              <label>Unidade de Atendimento</label>
              <select v-model="form.unidade" class="styled-select">
                <option value="Bahia">Shopping da Bahia</option>
                <option value="Salvador">Shopping Salvador</option>
              </select>
            </div>

            <div class="input-group">
              <label>{{
                isExame ? "Tipo de Exame" : "Especialidade Médica"
              }}</label>
              <select
                v-model="form.servico"
                class="styled-select"
                @change="verificarRetorno"
              >
                <option v-for="opt in opcoesFiltradas" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>
            </div>

            <div class="input-group">
              <label>Escolha a Data</label>
              <input
                type="date"
                v-model="form.data"
                class="styled-select"
                :min="today"
              />
            </div>
          </div>

          <div class="card-style">
            <label>Horários Disponíveis</label>
            <div class="time-grid">
              <button
                v-for="h in horarios"
                :key="h.hora"
                class="time-slot"
                :class="{ occupied: h.ocupado, selected: form.hora === h.hora }"
                :disabled="h.ocupado"
                @click="form.hora = h.hora"
              >
                {{ h.hora }}
                <span class="slot-status" v-if="h.ocupado">Ocupado</span>
              </button>
            </div>
            <div class="vagas-indicator-bar" :class="vagasStatus.classe">
              <span class="dot"></span>
              {{ vagasStatus.texto }}
            </div>
            <div class="weather-alert-container">
              <div class="weather-alert-card rain" v-if="climaPrevisto.chuva">
                <CloudRainIcon :size="20" />
                <div class="weather-text">
                  <strong>Atenção:</strong> Previsão de chuva para Salvador.
                  Planeje seu trajeto!
                  <p class="weather-obs">
                    * A previsão pode mudar conforme a data se aproxima.
                  </p>
                </div>
              </div>

              <div class="weather-alert-card clear" v-else>
                <SunIcon :size="20" />
                <div class="weather-text">
                  <strong>Tempo Bom:</strong> Sem previsão de chuva para agora.
                  <p class="weather-obs">
                    * Lembre-se: previsões para datas futuras podem sofrer
                    alterações.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="action-footer">
          <button class="btn-cancel" @click="$emit('voltar')">Voltar</button>
          <button class="btn-confirm" @click="abrirModalConfirmacao">
            {{ isRetorno ? "SOLICITAR RETORNO" : "CONFIRMAR AGENDAMENTO" }}
          </button>
        </div>
      </section>

    <transition name="fade">
      <div class="modal-overlay" v-if="showModal">
        <div class="modal-card">
          <h3>Confirmar Agendamento</h3>
          <div class="modal-details">
            <p><strong>Paciente:</strong> Lauro Breno</p>
            <p>
              <strong>Tipo:</strong> {{ isExame ? "Exame" : "Consulta" }} -
              {{ form.servico }}
            </p>
            <p><strong>Local:</strong> Shopping {{ form.unidade }}</p>
            <p><strong>Data:</strong> {{ form.data }} às {{ form.hora }}</p>
          </div>
          <div class="modal-actions">
            <button @click="showModal = false" class="btn-modal-back">
              Editar
            </button>
            <button @click="finalizarAgendamento" class="btn-modal-go">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { CloudRainIcon, ChevronRightIcon, SunIcon } from "lucide-vue-next";
import axios from "axios";

const isExame = ref(false);
const isRetorno = ref(false);
const showModal = ref(false);
const today = new Date().toISOString().split("T")[0];
const climaPrevisto = ref({ chuva: false });
const showMenu = ref(false);
const form = ref({ unidade: "Bahia", servico: "", data: today, hora: "" });
const API_KEY = "28f89a82845689fde71baf81ba052fd2";

const horarios = ref([
  { hora: "08:00", ocupado: false },
  { hora: "08:30", ocupado: true },
  { hora: "09:00", ocupado: false },
  { hora: "09:30", ocupado: false },
  { hora: "10:00", ocupado: true },
  { hora: "10:30", ocupado: false },
  { hora: "11:00", ocupado: false },
  { hora: "11:30", ocupado: true },
  { hora: "14:00", ocupado: false },
  { hora: "14:30", ocupado: true },
  { hora: "15:00", ocupado: false },
  { hora: "15:30", ocupado: false },
  { hora: "16:00", ocupado: true },
  { hora: "16:30", ocupado: false },
  { hora: "17:00", ocupado: false },
]);

const checarPrevisaoReal = async () => {
  try {
    const cidade = "Salvador";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${API_KEY}&lang=pt_br`;

    const resposta = await axios.get(url);

    const codigoClima = resposta.data.weather[0].id;
    const descricao = resposta.data.weather[0].description;

    // Se o ID for menor que 600 (chuva/tempestade) ou a descrição tiver "chuva"
    const temChuva = codigoClima < 600 || descricao.toLowerCase().includes("chuva");

    climaPrevisto.value = { 
      chuva: temChuva 
    };
    
    console.log("Status Chuva:", temChuva, "Descrição:", descricao);
  } catch (error) {
    console.error("Erro ao buscar clima:", error);
  }
};

// Faz o sistema buscar assim que você entra na tela
onMounted(() => {
  checarPrevisaoReal();
});

const opcoesFiltradas = computed(() => {
  return isExame.value
    ? ["Raio-X", "Hemograma", "Ultrassom", "Eletrocardiograma"]
    : ["Cardiologia", "Clínico Geral", "Ortopedia", "Dermatologia"];
});

const vagasStatus = computed(() => {
  const livres = horarios.value.filter((h) => !h.ocupado).length;
  if (livres === 0) return { texto: "Sem vagas para este dia", classe: "red" };
  if (livres < 5)
    return { texto: "Poucas vagas disponíveis", classe: "orange" };
  return { texto: "Muitas vagas disponíveis", classe: "green" };
});

const verificarRetorno = () => {
  // Se for Cardiologia, vira retorno
  isRetorno.value = form.value.servico === "Cardiologia";
};

const abrirModalConfirmacao = () => {
  if (!form.value.hora || !form.value.servico) {
    alert("Selecione o serviço e o horário primeiro!");
    return;
  }
  showModal.value = true;
};

const finalizarAgendamento = () => {
  alert("Agendamento realizado com sucesso!");
  showModal.value = false;
};

defineEmits(["sair", "voltar"]);
</script>

<style scoped src="../assets/agendamento.css"></style>
