🚀 PriceInsight

Sistema web desenvolvido com foco em comparação de preços entre mercados, permitindo ao usuário visualizar produtos, acompanhar variações de preços e identificar melhores ofertas de forma prática e organizada.

📌 Sobre o projeto

O PriceInsight foi criado como parte dos estudos em Engenharia de Software, aplicando conceitos de:

Desenvolvimento Full Stack
Arquitetura de Sistemas
APIs REST
Banco de Dados
Scrum
Jira Software
Versionamento com Git/GitHub

O sistema busca facilitar a tomada de decisão do usuário na hora da compra, oferecendo uma plataforma capaz de registrar, comparar e analisar preços de produtos em diferentes mercados.

🛠 Tecnologias utilizadas
🔹 Backend
Java
Spring Boot
API REST
🔹 Frontend
React
HTML
CSS
JavaScript
🔹 Banco de Dados
MySQL
🔹 Ferramentas
Git
GitHub
Jira Software
⚙ Funcionalidades implementadas

✅ Cadastro de produtos
✅ Cadastro de mercados
✅ Registro de preços
✅ Atualização de preços
✅ Listagem de produtos
✅ Visualização de mercados
✅ Histórico de preços
✅ Visualização de preços por produto
✅ Integração frontend/backend
✅ Persistência em banco de dados
✅ Organização com Scrum e Jira

📸 Preview do Sistema

🏠 Página Inicial

<img width="1428" height="735" alt="image" src="https://github.com/user-attachments/assets/7c739c9d-cd12-4857-aab9-ce9b40559df5" />

A página inicial do PriceInsight apresenta uma interface moderna e intuitiva, permitindo que o usuário pesquise produtos rapidamente e visualize destaques de preços entre diferentes mercados.

Funcionalidades:
Busca inteligente de produtos
Destaques de ofertas
Navegação lateral organizada
Interface minimalista

📦 Produtos

<img width="1425" height="727" alt="image" src="https://github.com/user-attachments/assets/fd3813ed-e68c-48dd-ad55-bb6dcc5dc5ce" />



Tela responsável pelo gerenciamento de produtos cadastrados no sistema.

Funcionalidades:
Cadastro de produtos
Pesquisa de itens
Organização dos produtos
Estrutura preparada para comparação de preços

🏪 Mercados

<img width="1439" height="732" alt="image" src="https://github.com/user-attachments/assets/f2384d30-1820-48fc-9a46-2904a0d980b3" />


Área destinada ao gerenciamento e visualização dos mercados cadastrados.

Funcionalidades:
Cadastro de mercados
Pesquisa de mercados
Organização por nome
Estrutura preparada para futuras funcionalidades de localização

💰 Cadastro de Preços

<img width="1435" height="736" alt="image" src="https://github.com/user-attachments/assets/95eebee9-1023-473b-ba21-c8da4c0aee31" />


Tela responsável pelo registro e gerenciamento de preços dos produtos cadastrados.

Funcionalidades:
Registro de preços
Associação entre produto e mercado
Controle de valores
Base para histórico e comparação de preços

🎨 Design do Sistema

O design do projeto foi desenvolvido utilizando conceitos modernos de UI/UX, priorizando:

✅ Interface limpa
✅ Navegação intuitiva
✅ Boa experiência do usuário
✅ Organização visual
✅ Componentização
✅ Estrutura SaaS moderna

📱 Responsividade

O sistema está em evolução contínua para oferecer suporte responsivo para:

Desktop
Tablets
Smartphones

A implementação da responsividade faz parte das próximas etapas do projeto.

📊 Funcionalidades futuras

🚀 Sistema de promoções
🚀 Dashboard de estatísticas
🚀 Filtros avançados
🚀 Associação automática de imagens
🚀 Média de preços
🚀 Localização de mercados

🧩 Arquitetura do sistema

O sistema segue arquitetura baseada em:

Frontend (React)
        ↓
API REST (Spring Boot)
        ↓
Banco de Dados (MySQL)
Fluxo da aplicação:
O usuário interage com a interface React.
O frontend envia requisições para a API REST.
O backend processa as regras de negócio.
Os dados são persistidos no banco MySQL.
As informações retornam dinamicamente para a interface.

📂 Estrutura do projeto

PriceInsight/

│

├── backend/

│   ├── controllers/

│   ├── services/

│   ├── repositories/

│   ├── models/

│   └── config/

│

├── frontend/

│   ├── components/

│   ├── pages/

│   ├── services/

│   ├── assets/

│   └── styles/

│

├── images/

│   ├── home.png

│   ├── produtos.png

│   ├── mercados.png

│   └── precos.png

│

└── README.md

▶ Como executar o projeto
🔹 Backend
# Clonar repositório
git clone https://github.com/JoaoPedroS-S/PriceInsight

# Entrar no backend
cd backend

# Executar aplicação
./mvnw spring-boot:run
🔹 Frontend
# Entrar no frontend
cd frontend

# Instalar dependências
npm install

# Executar aplicação
npm run dev
🗄 Configuração do banco de dados

Configure o arquivo:

application.properties

Exemplo:

spring.datasource.url=jdbc:mysql://localhost:3306/priceinsight
spring.datasource.username=root
spring.datasource.password=sua_senha

📌 Gerenciamento do projeto
🔹 Jira

Jira - PriceInsight

🔹 GitHub

GitHub - PriceInsight

🧠 Metodologia utilizada

O projeto utiliza práticas ágeis baseadas em Scrum:

Backlog estruturado
Tasks e Subtasks
Priorização
Controle de bugs
Estimativas
Versionamento
Sprints
📚 Objetivo acadêmico

Projeto desenvolvido para aplicação prática dos conhecimentos adquiridos em Engenharia de Software, desenvolvimento web e gerenciamento ágil de projetos.

👨‍💻 Autor
João Pedro da Silva Santos

📌 Estudante de Engenharia de Software
📌 Desenvolvedor Full Stack em aprendizado contínuo
📌 Interesse em Backend, APIs REST e Arquitetura de Sistemas

📄 Licença

Este projeto é destinado para fins acadêmicos e de aprendizado.
