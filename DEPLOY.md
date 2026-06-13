# 🚀 Guia de Implantação e Transição Fullstack (Vercel + Render + Supabase)

Este documento descreve como subir cada pedaço do seu sistema **PriceInsight** nos respectivos serviços de nuvem gratuitos da melhor forma possível, mantendo a arquitetura limpa, segura e performática.

---

## 🗺️ Visão Geral da Arquitetura
1. **Banco de Dados**: Hospedado no **Supabase** (PostgreSQL na Nuvem)
2. **Backend**: API REST hospedada no **Render** (Java 21 + Spring Boot) 
3. **Frontend**: Interface Single-Page Application hospedada na **Vercel** (React + Vite + TypeScript)

---

## 1. 🗄️ Configurando o Banco de Dados (Supabase)

O **Supabase** fornece uma excelente instância de PostgreSQL de alto desempenho.

1. Acesse [Supabase](https://supabase.com/) e faça login.
2. Clique em **"New Project"** (Novo Projeto) e configure:
   * **Project Name**: `PriceInsight`
   * **Database Password**: Escolha uma senha segura e guarde-a.
   * **Region**: Escolha uma região próxima de você (ex: `sa-east-1` ou `us-east-1`).
3. Uma vez criado o banco, acesse no menu lateral **Project Settings** (Ícone de engrenagem) e depois **Database**.
4. Procure pela seção **Connection String** e escolha a aba **/ URI**.
5. Copie a URL gerada (ela terá essa estrutura):
   `postgresql://postgres:[SENHA_DO_BANCO]@db.[SEU_ID_DO_SUPABASE].supabase.co:5432/postgres`
6. Como o Spring Boot usa **JDBC**, copie essa mesma URL e **substitua o início** `postgresql://` por `jdbc:postgresql://`.
   * **Sua Connection JDBC será:**
     `jdbc:postgresql://db.[SEU_ID_DO_SUPABASE].supabase.co:5432/postgres`

---

## 2. ☕ Hospedando o Backend no Render (Java Spring Boot)

O **Render** detecta projetos Maven na raiz do repositório ou em subdiretórios.

1. Acesse o [Render](https://render.com/) e crie uma conta (vincule ao GitHub para facilitar).
2. Clique em **"New +"** ➡️ **Web Service**.
3. Conecte com o seu repositório no GitHub onde está o código do projeto.
4. Na tela de configurações do serviço do Render, coloque:
   * **Name**: `priceinsight-backend`
   * **Environment**: `Java` (ou use Docker se preferir)
   * **Region**: Mesma região escolhida no Supabase (para menor latência).
   * **Root Directory**: `backend` *(MUITO IMPORTANTE! Indica que o projeto Spring Boot está na subpasta backend)*
   * **Build Command**: `mvn clean package -DskipTests`
   * **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
   * **Instance Type**: `Free` (Grátis)
5. Clique em **Advanced** para configurar as variáveis de ambiente necessárias:
   * **`PORT`**: `8080` (A porta em que o Spring Boot iniciará por padrão no Render)
   * **`SPRING_DATASOURCE_URL`**: `jdbc:postgresql://db.[SEU_ID_DO_SUPABASE].supabase.co:5432/postgres` (Insira a URL que você montou no passo anterior)
   * **`DB_USERNAME`**: `postgres` (Por padrão no Supabase)
   * **`DB_PASSWORD`**: `[SUA_SENHA_DO_BASE_DE_DADOS_CRIADA_NO_SUPABASE]`
6. Clique em **Deploy Web Service**.
7. Após o deploy com sucesso, o Render fornecerá a URL pública da sua API (ex: `https://priceinsight-backend.onrender.com`). Copie essa URL!

---

## 3. ⚛️ Hospedando o Frontend na Vercel (React + Vite)

A **Vercel** é a plataforma nativa para deploys estáticos otimizados do React.

1. Acesse a [Vercel](https://vercel.com/) e faça login com seu GitHub.
2. Clique em **"Add New..."** ➡️ **Project**.
3. Selecione o repositório do seu projeto.
4. Na tela de configuração do projeto:
   * **Framework Preset**: `Vite` (Detectado automaticamente)
   * **Root Directory**: **Deixe vazio (`./`)** ou a raiz do seu repositório onde está o `package.json` principal do frontend.
   * **Build and Output Settings**: Os padrões funcionam perfeitamente (`npm run build`).
5. Role para baixo até **Environment Variables** e insira a variável que conecta seu front ao seu novo back:
   * **Key**: `VITE_API_URL`
   * **Value**: `https://priceinsight-backend.onrender.com` (Substitua pela URL pública que você obteve do Render no passo 2)
6. Clique em **Deploy**.
7. O arquivo configurado `vercel.json` garante que as rotas internas funcionem perfeitamente sem erros `404` ao atualizar a página.

---

## 💡 Dicas de Manutenção e Produção

1. **Cold Start do Render**: No plano gratuito do Render, se o backend passar 15 minutos sem receber chamadas, ele entra em modo de repouso (dorme). Quando alguém acessa, a primeira requisição demora cerca de 30-50 segundos para carregar enquanto ele acorda. Isso é normal da plataforma gratuita.
2. **Logs em Tempo Real**: Na aba **Events/Logs** no Render você pode assistir o Spring Boot subindo, rodando as migrações criadas pelo Hibernate e recebendo conexões do Supabase.
3. **CORS**: O backend Java criado já está com CORS totalmente aberto (`@CrossOrigin(origins = "*")`), o que previne problemas comuns de comunicação entre as portas e domínios da Vercel e Render.
