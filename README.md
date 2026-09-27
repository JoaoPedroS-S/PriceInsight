PriceInsight

Sistema web de inteligência e comparação de preços entre produtos e mercados, desenvolvido com o objetivo de facilitar a consulta, organização e análise de informações de preços.

O projeto foi desenvolvido como parte dos estudos em Engenharia de Software, utilizando conceitos de Programação Orientada a Objetos, desenvolvimento web, APIs REST, banco de dados e metodologia Scrum.

📌 Sobre o Projeto

O PriceInsight é uma aplicação web desenvolvida para permitir o cadastro e gerenciamento de produtos, mercados e preços, possibilitando ao usuário consultar informações e analisar os valores praticados em diferentes estabelecimentos.

O sistema busca facilitar a identificação de oportunidades de compra e fornecer informações organizadas para apoiar a tomada de decisão.

O projeto possui como público-alvo principal pequenas e médias empresas (PMEs) que precisam acompanhar preços de produtos em diferentes mercados, podendo também ser utilizado por consumidores que desejam consultar essas informações.

🎯 Objetivos
Objetivo Geral

Desenvolver um sistema web capaz de organizar informações de produtos, mercados e preços, permitindo a consulta e análise desses dados de maneira simples e estruturada.

Objetivos Específicos
Cadastrar e gerenciar produtos;
Cadastrar e gerenciar mercados;
Registrar preços de produtos por mercado;
Consultar produtos cadastrados;
Consultar mercados cadastrados;
Visualizar preços registrados;
Identificar produtos em promoção;
Pesquisar produtos e mercados;
Aplicar filtros de pesquisa;
Exibir informações de localização dos mercados;
Apresentar estatísticas e indicadores relacionados aos preços;
Permitir autenticação e cadastro de usuários;
Possibilitar futuramente a criação de listas de compras;
Possibilitar futuramente a comparação de compras entre diferentes mercados.
👥 Público-Alvo

O PriceInsight foi pensado principalmente para:

Pequenas e médias empresas;
Pequenos empreendedores;
Comerciantes;
Profissionais que precisam acompanhar preços de fornecedores;
Consumidores interessados em consultar preços de produtos.
⚙️ Funcionalidades
Produtos
Cadastro de produtos;
Edição de produtos;
Exclusão de produtos;
Listagem de produtos;
Visualização de informações dos produtos.
Mercados
Cadastro de mercados;
Edição de mercados;
Exclusão de mercados;
Listagem de mercados;
Visualização dos mercados;
Informações de localização.
Preços
Registro de preços por mercado;
Consulta de preços;
Associação entre produtos, mercados e preços;
Atualização das informações de preços.
Promoções
Identificação de produtos em promoção;
Visualização de produtos promocionais;
Destaque de promoções na interface.
Pesquisa e Filtros
Pesquisa de produtos por nome;
Pesquisa de mercados;
Filtros de pesquisa;
Atualização dos resultados;
Tratamento para pesquisas sem resultados.
Usuários
Cadastro de usuários;
Login;
Validação de dados;
Prevenção de cadastros duplicados;
Persistência da sessão do usuário.
Dashboard

O projeto também prevê a utilização de um dashboard para apresentação de informações e indicadores relacionados aos preços, como:

Preços;
Produtos;
Mercados;
Promoções;
Médias de preços;
Informações para análise.
Lista de Compras

Como evolução do projeto, está prevista a implementação de listas de compras, permitindo ao usuário organizar produtos que deseja adquirir.

Comparação de Compras

Também está prevista a implementação de funcionalidades para comparar os produtos de uma lista de compras entre diferentes mercados.

🏗️ Arquitetura

O sistema utiliza uma arquitetura dividida entre Frontend e Backend, com comunicação realizada através de uma API REST.

┌──────────────────────────────┐
│          FRONTEND            │
│                              │
│ React + TypeScript           │
│ HTML + CSS + Tailwind CSS    │
│ Vite                         │
└──────────────┬───────────────┘
               │
               │ HTTP / REST / JSON
               ▼
┌──────────────────────────────┐
│           BACKEND            │
│                              │
│ Java 21                      │
│ Spring Boot                  │
│ Spring Data JPA              │
│ Hibernate                    │
└──────────────┬───────────────┘
               │
               │ JPA / Hibernate
               ▼
┌──────────────────────────────┐
│          DATABASE            │
│                              │
│ PostgreSQL                   │
└──────────────────────────────┘
💻 Tecnologias Utilizadas
Frontend
React
TypeScript
JavaScript
HTML5
CSS3
Tailwind CSS
Vite
Backend
Java 21
Spring Boot
Spring Data JPA
Hibernate
Maven
Lombok
Banco de Dados
PostgreSQL
API
REST API
JSON
HTTP/HTTPS
Ferramentas
Git
GitHub
Jira
Postman
Visual Studio Code
🧩 Programação Orientada a Objetos

O desenvolvimento do backend utiliza conceitos de Programação Orientada a Objetos (POO).

Entre os principais elementos utilizados estão:

Classes;
Objetos;
Encapsulamento;
Associação entre entidades;
Organização em camadas;
Reutilização de componentes.

Entre as principais entidades do sistema estão:

Product
Market
Price
User

As entidades possuem relacionamentos utilizando recursos do JPA/Hibernate, como:

@OneToMany
@ManyToOne

Os repositórios utilizam interfaces do Spring Data JPA para facilitar o acesso aos dados.

🔌 API REST

O frontend se comunica com o backend através de endpoints REST.

Produtos
GET    /api/products
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
DELETE /api/products/{id}
Mercados
GET    /api/markets
POST   /api/markets
GET    /api/markets/{id}
PUT    /api/markets/{id}
DELETE /api/markets/{id}
Preços
GET    /api/prices
POST   /api/prices
GET    /api/prices/product/{productId}

Os dados são enviados e recebidos utilizando o formato JSON.

📁 Estrutura do Projeto
Frontend

O frontend está organizado em componentes e serviços, seguindo uma estrutura baseada nas responsabilidades de cada parte da aplicação.

Exemplo:

src/
├── components/
│   ├── home/
│   ├── layout/
│   ├── products/
│   ├── markets/
│   └── prices/
│
├── services/
│   └── api.ts
│
├── App.tsx
└── main.tsx
Backend

O backend utiliza a estrutura padrão de uma aplicação Spring Boot.

src/
└── main/
    ├── java/
    │   └── com/priceinsight/backend/
    │       ├── config/
    │       ├── controller/
    │       ├── model/
    │       ├── repository/
    │       └── service/
    │
    └── resources/
        └── application.properties
📦 Repositórios

O projeto está organizado em dois repositórios principais.

Frontend
PriceInsight

GitHub:

https://github.com/JoaoPedroS-S/PriceInsight

Backend
PriceInsight-Backend
🚀 Como Executar o Projeto
Pré-requisitos

Antes de executar o projeto, é necessário possuir instalado:

Node.js
npm
Java 21
Maven
PostgreSQL
Git
▶️ Executando o Frontend

Clone o repositório:

git clone https://github.com/JoaoPedroS-S/PriceInsight.git

Entre na pasta:

cd PriceInsight

Instale as dependências:

npm install

Execute o projeto:

npm run dev

O frontend estará disponível normalmente em:

http://localhost:5173
▶️ Executando o Backend

Clone o repositório do backend e entre na pasta:

cd PriceInsight-Backend

Execute a aplicação utilizando Maven:

mvn spring-boot:run

Ou, caso o projeto possua Maven Wrapper:

./mvnw spring-boot:run

O backend estará disponível normalmente em:

http://localhost:8080
🗄️ Banco de Dados

O projeto utiliza PostgreSQL para armazenamento dos dados.

Entre as principais informações armazenadas estão:

Produtos;
Mercados;
Preços;
Usuários;
Informações relacionadas às funcionalidades do sistema.

A configuração da conexão com o banco de dados é realizada no backend através do arquivo:

application.properties
🔄 Fluxo da Aplicação

O funcionamento básico do sistema segue o fluxo:

Usuário
   │
   ▼
Frontend
   │
   │ HTTP / JSON
   ▼
API REST
   │
   ▼
Backend
   │
   │ JPA / Hibernate
   ▼
PostgreSQL

Quando o usuário realiza uma operação na interface, o frontend envia uma requisição para a API.

O backend processa a requisição, realiza as operações necessárias no banco de dados e retorna uma resposta para o frontend.

📋 Metodologia de Desenvolvimento

O desenvolvimento do PriceInsight utiliza conceitos da metodologia Scrum.

O projeto é organizado utilizando:

Épicos;
User Stories;
Subtasks;
Sprints;
Backlog;
Priorização de tarefas.

O gerenciamento das atividades é realizado através do Jira.

As funcionalidades são desenvolvidas de maneira incremental, permitindo acompanhar a evolução do sistema durante as diferentes sprints.

🗂️ Gerenciamento do Projeto
Jira

Projeto utilizado para organização do backlog, sprints e tarefas:

https://joppedro.atlassian.net/jira/software/c/projects/PP/summary

GitHub

Repositório do projeto:

https://github.com/JoaoPedroS-S/PriceInsight

🔮 Próximas Funcionalidades

Entre as funcionalidades previstas para evolução do projeto estão:

Melhorias na pesquisa e filtros;
Sistema de promoções;
Localização dos mercados;
Dashboard de estatísticas;
Login e cadastro de usuários;
Lista de compras;
Comparação de compras;
Melhorias na experiência do usuário;
Novas ferramentas de análise de preços.
🎓 Contexto Acadêmico

O PriceInsight é um projeto desenvolvido no contexto dos estudos de Engenharia de Software, tendo como objetivo aplicar na prática conhecimentos relacionados a:

Desenvolvimento Web;
Programação Orientada a Objetos;
Desenvolvimento de APIs;
Banco de Dados;
Arquitetura de Software;
Metodologia Scrum;
Versionamento de código;
Desenvolvimento Frontend;
Desenvolvimento Backend.

O projeto também busca proporcionar experiência prática com ferramentas utilizadas no desenvolvimento de sistemas reais.

👨‍💻 Autor

João Pedro da Silva Santos

Estudante de Análise e Desenvolvimento de Sistemas

GitHub:

https://github.com/JoaoPedroS-S

LinkedIn:

https://www.linkedin.com/in/jo%C3%A3opedrossantos/

📄 Licença

Este projeto foi desenvolvido para fins acadêmicos e de estudo.
