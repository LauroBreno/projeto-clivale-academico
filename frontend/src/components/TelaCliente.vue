<template>
  <div class="dashboard-wrapper">
    <header class="main-header">
      <div class="header-content">
        <img src="../assets/clivale.png" alt="Logo Clivale" class="header-logo" />
        <div class="user-menu">
            <div class="notifications-bell">
                <BellIcon :size="20" class="bell-icon" />
                <span class="bell-dot"></span>
                <div class="notifications-dropdown">
                    <p>Notificações</p>
                    <div class="notif-item">
                        <UsersIcon :size="24" />
                        <span>Um usuario deseja vincular-se a você como dependente.</span>
                    </div>
                </div>
            </div>
          <div class="user-info">
            <span class="welcome-text">Olá, <strong>Lauro</strong>!</span>
            <span class="sub-phrase">Vamos cuidar da sua saúde hoje?</span>
          </div>
          
          <div class="profile-dropdown">
            <div class="avatar-circle">L</div>
            <ul class="dropdown-menu">
              <li>Meu Perfil</li>
              <li>Consultas</li>
              <li>Exames</li>
              <li class="logout-item" @click="$emit('sair')">Sair</li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <main class="dashboard-body">
        <section class="monitor-banner">
    <div class="monitor-info">
      <div class="monitor-stats">
        <div class="stat-item">
          <span class="stat-value">02</span>
          <span class="stat-label">Consultas este mês</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">04</span>
          <span class="stat-label">Exames realizados</span>
        </div>
      </div>
      
      <div class="monitor-message">
        <h3>Lauro, sua prevenção está em dia!</h3>
        <p>Você tem mantido uma boa frequência. Não esqueça de revisar seus laudos antes da próxima consulta.</p>
      </div>
    </div>
    
    <div class="monitor-status status-green">
      <span class="status-icon">✓</span>
      <span class="status-text">Saúde Monitorada</span>
    </div>
  </section>
  <section class="actions-grid">
  <div class="card-action highlight">
    <CalendarPlusIcon :size="24" class="icon-1" />
    <div class="card-texts">
      <h4>Marcar Exames e Consultas</h4>
      <p>Agende sua próxima visita de forma rápida.</p>
    </div>
    <button class="btn-go"><ChevronRightIcon :size="20" /></button>
  </div>

  <div class="sub-grid">
    <div class="card-action secondary">
        <StethoscopeIcon :size="24" class="icon-s" />
      <h4>Minhas Consultas</h4>
    </div>
    
    <div class="card-action secondary">
        <FileTextIcon :size="24" class="icon-s" />
      <h4>Meus Exames</h4>
    </div>

    <div class="card-action secondary">
        <UsersIcon :size="24" class="icon-s" />
      <h4>Dependentes</h4>
    </div>

    <div class="card-action secondary">
      <MessageSquareIcon :size="24" class="icon-s" />
      <h4>Solicitações e Suporte</h4>
    </div>
  </div>
</section>
      </main>
      <footer class="dashboard-footer">
  <div class="footer-content">
    <div class="footer-brand">
        <div class="text-logo">
            <span class="logo-clivale">Clivale</span>
            <span class="logo-mais">Mais</span>
            <p class="logo-subtext">Saúde Integrada</p>
        </div>
        <p class="footer-tagline">Cuidando da sua saúde com excelência e tecnologia.</p>
    </div>
    <div class="footer-links">
      <div class="footer-column">
        <strong>Unidades</strong>
        <span>Shopping da Bahia</span>
        <span>Shopping Salvador</span>
      </div>
      <div class="footer-column">
        <strong>Contato</strong>
        <span>(71) 3000-0000</span>
        <span>suporte@clivale.com.br</span>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    &copy; 2026 Clivale Mais - Todos os direitos reservados.
  </div>
</footer>
  </div>
</template>

<script setup>
import { 
    BellIcon, 
    UsersIcon, 
    CalendarPlusIcon, 
    StethoscopeIcon, 
    FileTextIcon, 
    MessageSquareIcon, 
    ChevronRightIcon } from 'lucide-vue-next'

    defineEmits(['sair']);
</script>

<style src="../assets/dashboard.css" scoped></style>