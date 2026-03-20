Sistema de Agendamento Inteligente

O projeto é um MVP (Produto Mínimo Viável) de um ecossistema de agendamento médico que integra dados climáticos em tempo real para otimizar a gestão de uma clínica. O projeto une uma interface intuitiva para o paciente com um painel de controle estratégico para a secretaria.

1. Funcionalidades Principais

- Autenticação Segura: Login com validação de credenciais e implementação de senhas criptografadas para proteção de dados do usuário.

- Agendamento Dinâmico: Fluxo inteligente para marcação de consultas e exames, com diferenciação automática de "Retornos Médicos".

- Integração com OpenWeather API: Monitoramento climático em tempo real (Salvador-BA) que altera o estado visual da aplicação e gera alertas de chuva.

- Painel da Secretaria: Central de comando para gestão de presença dos pacientes e disparos de notificações em massa baseadas em condições climáticas.

- Interface Responsiva: Header fixo e design padronizado entre as telas de Cliente e Agendamento para uma experiência contínua.

2. Tecnologias Utilizadas

- Vue.js 3: Framework progressivo para a construção da interface e lógica de estados.

- Axios: Consumo de APIs REST externas.

- Lucide Vue Next: Biblioteca de ícones modernos e leves.

- CSS3 Custom Properties: Estilização modular e consistente.

3. Evolução e Desafios Técnicos

Este projeto foi desenvolvido com foco na lógica de negócio e backend (Vue Logic). Durante o desenvolvimento, foram priorizados:

- A precisão no tratamento de dados da API externa (IDs climáticos).

- A segurança no tráfego de informações de login.

- A criação de um sistema de componentes reutilizáveis.

Obs: Alguns ajustes finos de layout, como o isolamento total de heranças de CSS global (conflitos de scroll) e a customização completa de componentes nativos de formulário (calendário), estão mapeados no backlog para futuras atualizações.

4. Futuro do Projeto (Roadmap)

O Sistema foi estruturado para ser escalável. As próximas implementações incluem:

- Integração com Banco de Dados (PostgreSQL/Node.js) para persistência.

- Módulo de Histórico de Exames e Resultados.

- Perfil de Usuário completo com edição de dados.

- Sistema de notificações via WhatsApp/E-mail.

- Módulo exclusivo que permite ao usuário principal cadastrar e gerenciar agendamentos para dependentes (filhos, pais, etc.), centralizando a saúde da família em um único perfil e facilitando o controle de consultas de terceiros.

5. Como rodar o projeto

- Clone o repositório.

- Instale as dependências com npm install.

- Rode o servidor de desenvolvimento com npm run dev.