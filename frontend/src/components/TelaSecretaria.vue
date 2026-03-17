<template>
  <div class="dashboard-wrapper">
    <header class="dashboard-header fixed-header">
      <div class="header-content">
        <div class="logo-text">
          <span class="logo-clivale">CLIVALE</span
          ><span class="logo-mais">MAIS</span>
          <span class="badge-admin-tag">ADMINISTRATIVO</span>
        </div>

        <div class="weather-display" v-if="clima">
          <div class="weather-pill" :class="{ 'is-rainy': clima.chuva }">
            <CloudRainIcon v-if="clima.chuva" :size="18" />
            <SunIcon v-else :size="18" />
            <span>Salvador, {{ clima.temp }}°C</span>
            <button
              v-if="clima.chuva"
              @click="avisarPacientes"
              class="weather-alert-btn"
            >
              Notificar Chuva
            </button>
          </div>
        </div>

        <div class="header-right">
          <div class="admin-profile-container">
            <span class="admin-welcome"
              >Olá, {{ usuario?.nome || "Secretaria" }}</span
            >
            <div
              class="avatar-menu"
              @mouseover="showMenu = true"
              @mouseleave="showMenu = false"
            >
              <div class="admin-avatar">S</div>

              <transition name="fade">
                <div v-if="showMenu" class="dropdown-menu">
                  <div class="menu-item"><UserIcon :size="16" /> Perfil</div>
                  <div class="menu-item">
                    <MessageSquareIcon :size="16" /> Chat
                  </div>
                  <div class="menu-item">
                    <FileTextIcon :size="16" /> Solicitações
                  </div>
                  <div class="menu-divider"></div>
                  <div class="menu-item logout" @click="$emit('sair')">
                    <LogOutIcon :size="16" /> Sair
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="admin-content">
      <div class="content-header-main">
        <div class="title-group">
          <h1>Painel de Atendimentos</h1>
          <p>
            Gerencie as chegadas e notificações dos pacientes em tempo real.
          </p>
        </div>

        <div class="filters-bar">
          <select v-model="filtros.unidade" class="styled-input-action">
            <option value="">Todas as Unidades</option>
            <option value="Bahia">Shopping da Bahia</option>
            <option value="Salvador">Shopping Salvador</option>
          </select>

          <select v-model="filtros.turno" class="styled-input-action">
            <option value="">Todos os Turnos</option>
            <option value="Manhã">Manhã</option>
            <option value="Tarde">Tarde</option>
          </select>

          <div class="search-input-wrapper">
            <SearchIcon :size="16" class="search-icon-fixed" />
            <input
              type="text"
              v-model="filtros.busca"
              placeholder="Buscar por Nome ou CPF..."
              class="styled-input-action is-search"
            />
          </div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th width="40">
                <input
                  type="checkbox"
                  @change="selecionarTodos"
                  v-model="todosSelecionados"
                />
              </th>
              <th width="100">Horário</th>
              <th>Paciente</th>
              <th>Especialidade</th>
              <th>Médico</th>
              <th width="120">Status</th>
              <th class="actions-header-aligned">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in pacientesFiltrados"
              :key="p.id"
              :class="{ 'row-selected': p.selecionado }"
            >
              <td><input type="checkbox" v-model="p.selecionado" /></td>
              <td>
                <strong>{{ p.horario }}</strong>
              </td>
              <td>
                <div class="paciente-info">
                  <span class="nome-single-line">{{
                    formatarNome(p.nome)
                  }}</span>
                </div>
              </td>
              <td>{{ p.especialidade }}</td>
              <td>{{ p.medico }}</td>
              <td>
                <span :class="['status-badge', p.status.toLowerCase()]">
                  {{ p.status }}
                </span>
              </td>
              <td class="actions-cell-fixed">
                <div class="actions-wrapper-swapper">
                  <button class="btn-view" @click="verDetalhes(p)">
                    Ver Card
                  </button>
                  <button
                    class="btn-checkin"
                    @click="confirmarPresenca(p)"
                    v-if="p.status !== 'Presente'"
                  >
                    Check-in
                  </button>
                  <div v-else class="btn-placeholder"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  CloudRainIcon,
  SunIcon,
  SearchIcon,
  UserIcon,
  MessageSquareIcon,
  FileTextIcon,
  LogOutIcon,
} from "lucide-vue-next";

const showMenu = ref(false);
const clima = ref({ temp: 28, chuva: true });

const pacientes = ref([
  {
    id: 1,
    horario: "08:30",
    nome: "Lauro Breno Santos Silva",
    cpf: "***.***.111-11",
    especialidade: "Cardiologia",
    medico: "Dr. Silva",
    status: "Aguardando",
    selecionado: false,
    unidade: "Shopping da Bahia",
    turno: "Manhã",
  },
  {
    id: 2,
    horario: "09:15",
    nome: "Maria Souza Oliveira",
    cpf: "***.***.222-11",
    especialidade: "Clínico Geral",
    medico: "Dra. Ana",
    status: "Presente",
    selecionado: false,
    unidade: "Salvador Shopping",
    turno: "Manhã",
  },
  {
    id: 3,
    horario: "14:00",
    nome: "João Pedro de Alcântara",
    cpf: "***.***.333-22",
    especialidade: "Ortopedia",
    medico: "Dr. Marcos",
    status: "Aguardando",
    selecionado: false,
    unidade: "Shopping da Bahia",
    turno: "Tarde",
  },
]);

const formatarNome = (nomeCompleto) => {
  const nomes = nomeCompleto.trim().split(/\s+/);
  if (nomes.length <= 1) return nomeCompleto;
  return `${nomes[0]} ${nomes[nomes.length - 1]}`;
};

const filtros = ref({ unidade: "", turno: "", busca: "" });
const todosSelecionados = ref(false);

const pacientesFiltrados = computed(() => {
  return pacientes.value.filter((p) => {
    const matchUnidade = filtros.value.unidade
      ? p.unidade === filtros.value.unidade
      : true;
    const matchTurno = filtros.value.turno
      ? p.turno === filtros.value.turno
      : true;
    const matchBusca =
      p.nome.toLowerCase().includes(filtros.value.busca.toLowerCase()) ||
      p.cpf.includes(filtros.value.busca);
    return matchUnidade && matchTurno && matchBusca;
  });
});

const confirmarPresenca = (p) => {
  p.status = "Presente";
};
const avisarPacientes = () => {
  const selecionados = pacientes.value.filter((p) => p.selecionado);
  if (selecionados.length === 0) {
    alert("Favor selecionar ao menos um paciente para deseja notifica-lo.");
    return;
  }
  alert(
    `Sucesso! Notificação enviada para ${selecionados.length} paciente(s)!`,
  );
};
const selecionarTodos = () => {
  pacientes.value.forEach((p) => (p.selecionado = todosSelecionados.value));
};
const verDetalhes = (p) => {
  alert(
    `Paciente: ${p.nome}\nCPF: ${p.cpf}\nHorário: ${p.horario}\nTurno: ${p.turno}\nUnidade: ${p.unidade}\nStatus: ${p.status}`,
  );
};

defineEmits(["sair"]);
</script>

<style src="../assets/secretaria.css"></style>