# Guia de Deploy - S.I.G.M.A.

Este guia contém instruções passo a passo para fazer deploy do S.I.G.M.A. no Vercel (Frontend) e Railway (Backend).

---

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [Railway](https://railway.app)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- Banco de dados MySQL (pode ser criado no Railway)

---

## 🚀 Deploy do Backend (Railway)

### 1. Preparar o Banco de Dados

#### Opção A: Usar MySQL do Railway

1. Acesse [Railway](https://railway.app) e faça login
2. Crie um novo projeto
3. Clique em **"+ New"** → **"Database"** → **"MySQL"**
4. Aguarde a criação do banco de dados
5. Clique no serviço MySQL criado
6. Vá para a aba **"Connect"** e copie as credenciais:
   - `MYSQL_URL` (URL completa de conexão)
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

7. **Importante**: Você precisa executar o script SQL de criação do banco:
   - Conecte-se ao banco usando um cliente MySQL (MySQL Workbench, DBeaver, etc.)
   - Use as credenciais copiadas acima
   - Execute o arquivo `Backend/sigma/scripts_sql/CriacaoEInsercao.sql`

#### Opção B: Usar Banco de Dados Externo

Se você já tem um banco MySQL hospedado em outro lugar (AWS RDS, Azure, etc.), apenas tenha as credenciais em mãos.

### 2. Deploy do Backend no Railway

1. No mesmo projeto do Railway, clique em **"+ New"** → **"GitHub Repo"**
2. Autorize o Railway a acessar seu repositório
3. Selecione o repositório do S.I.G.M.A.
4. O Railway detectará automaticamente que é um projeto Maven

5. **Configure as variáveis de ambiente**:
   - Clique no serviço do backend
   - Vá para a aba **"Variables"**
   - Adicione as seguintes variáveis:

```env
# Configuração do Banco de Dados
DATABASE_URL=jdbc:mysql://[HOST]:[PORT]/[DATABASE]?createDatabaseIfNotExist=true&serverTimezone=UTC&useSSL=false&characterEncoding=UTF-8&allowPublicKeyRetrieval=true
DATABASE_USERNAME=seu_usuario_mysql
DATABASE_PASSWORD=sua_senha_mysql

# Configuração JWT (use uma chave secreta forte)
JWT_SECRET_KEY=sua_chave_secreta_super_segura_aqui_minimo_32_caracteres

# URL do Frontend (será configurada depois)
FRONTEND_URL=https://seu-app.vercel.app

# Profile do Spring
SPRING_PROFILES_ACTIVE=prod
```

**Dica**: Para gerar uma chave JWT segura, use:
```bash
openssl rand -hex 32
```

6. **Configure o Root Directory** (se necessário):
   - Vá para **"Settings"** → **"Build"**
   - Em **"Root Directory"**, coloque: `Backend/sigma`
   - Em **"Build Command"**, coloque: `mvn clean package -DskipTests`
   - Em **"Start Command"**, coloque: `java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/sigma-0.0.1-SNAPSHOT.jar`

7. Clique em **"Deploy"** e aguarde o build
8. Após o deploy, copie a URL pública do seu backend (algo como `https://sigma-production.up.railway.app`)

### 3. Configurar CORS no Backend

O backend já está configurado para aceitar requisições do frontend através da variável `FRONTEND_URL`. Certifique-se de que ela está configurada corretamente com a URL do Vercel.

---

## 🎨 Deploy do Frontend (Vercel)

### 1. Preparar o Frontend

1. Crie um arquivo `.env.production` na pasta `Frontend/`:

```env
VITE_API_URL=https://sua-url-do-railway.up.railway.app/api
VITE_APP_NAME=S.I.G.M.A.
```

**Importante**: Substitua `sua-url-do-railway.up.railway.app` pela URL real do seu backend no Railway.

### 2. Deploy no Vercel

1. Acesse [Vercel](https://vercel.com) e faça login
2. Clique em **"Add New..."** → **"Project"**
3. Importe seu repositório do GitHub
4. Configure o projeto:
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Configure as variáveis de ambiente**:
   - Na seção **"Environment Variables"**, adicione:

```env
VITE_API_URL=https://sua-url-do-railway.up.railway.app/api
VITE_APP_NAME=S.I.G.M.A.
```

6. Clique em **"Deploy"**
7. Aguarde o build e deploy (geralmente leva 1-2 minutos)
8. Copie a URL do seu frontend (algo como `https://sigma.vercel.app`)

### 3. Atualizar URL do Frontend no Backend

1. Volte para o Railway
2. Acesse o serviço do backend
3. Vá para **"Variables"**
4. Atualize a variável `FRONTEND_URL` com a URL do Vercel
5. O Railway fará um redeploy automático

---

## ✅ Verificação do Deploy

### Testar o Backend

1. Acesse `https://sua-url-do-railway.up.railway.app/api/health` (se houver endpoint de health)
2. Ou teste o login: `POST https://sua-url-do-railway.up.railway.app/api/auth/login`

```bash
curl -X POST https://sua-url-do-railway.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Testar o Frontend

1. Acesse a URL do Vercel no navegador
2. Tente fazer login com as credenciais padrão:
   - **Usuário**: admin
   - **Senha**: admin123

---

## 🔧 Troubleshooting

### Backend não inicia no Railway

**Erro: "Unable to acquire JDBC Connection"**
- Verifique se as variáveis `DATABASE_URL`, `DATABASE_USERNAME` e `DATABASE_PASSWORD` estão corretas
- Verifique se o banco de dados MySQL está rodando
- Verifique se o script SQL foi executado corretamente

**Erro: "Port already in use"**
- O Railway gerencia a porta automaticamente através da variável `$PORT`
- Certifique-se de que o comando de start usa `-Dserver.port=$PORT`

### Frontend não conecta ao Backend

**Erro: "Failed to fetch" ou "CORS error"**
- Verifique se a variável `VITE_API_URL` no Vercel está correta
- Verifique se a variável `FRONTEND_URL` no Railway está correta
- Certifique-se de que ambas as URLs incluem o protocolo (`https://`)

**Erro: "Network Error"**
- Verifique se o backend está rodando (acesse a URL do Railway)
- Verifique se não há firewall bloqueando as requisições

### Build falha no Railway

**Erro: "Maven build failed"**
- Verifique se o Java 21 está configurado
- Tente adicionar a variável `MAVEN_OPTS=-Xmx1024m` para aumentar a memória
- Verifique os logs de build para erros específicos

### Build falha no Vercel

**Erro: "npm install failed"**
- Verifique se o `package.json` está correto
- Tente limpar o cache do Vercel: Settings → Clear Cache

---

## 🔐 Segurança (Recomendações para Produção Real)

Embora você tenha pedido para não se preocupar com segurança, aqui estão algumas recomendações básicas:

1. **Altere as credenciais padrão** do sistema (admin/admin123)
2. **Use HTTPS** em produção (Railway e Vercel já fornecem isso)
3. **Gere uma nova chave JWT** forte e única
4. **Não commite** arquivos `.env` ou `application-prod.properties` no Git
5. **Configure backup** do banco de dados regularmente

---

## 📊 Monitoramento

### Railway
- Acesse a aba **"Metrics"** para ver uso de CPU, memória e rede
- Acesse a aba **"Logs"** para ver logs em tempo real

### Vercel
- Acesse a aba **"Analytics"** para ver estatísticas de acesso
- Acesse a aba **"Logs"** para ver logs de build e runtime

---

## 🔄 Atualizações

### Atualizar o Backend
1. Faça push das alterações para o repositório Git
2. O Railway detectará automaticamente e fará redeploy

### Atualizar o Frontend
1. Faça push das alterações para o repositório Git
2. O Vercel detectará automaticamente e fará redeploy

---

## 💰 Custos

### Railway
- **Free Tier**: $5 de crédito por mês (suficiente para testes)
- **Hobby Plan**: $5/mês por serviço
- **Pro Plan**: $20/mês com mais recursos

### Vercel
- **Hobby**: Gratuito (suficiente para projetos pessoais)
- **Pro**: $20/mês por usuário (para projetos comerciais)

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Railway e Vercel
2. Consulte a documentação oficial:
   - [Railway Docs](https://docs.railway.app)
   - [Vercel Docs](https://vercel.com/docs)
3. Verifique se todas as variáveis de ambiente estão corretas

---

**Desenvolvido com dedicação para revolucionar a gestão de supermercados e atacados** 🚀
