# Docker Build - S.I.G.M.A. Backend

Este documento explica como o build Docker funciona para o backend do S.I.G.M.A.

## 🐳 Dockerfile Multi-Stage

O projeto usa um **Dockerfile multi-stage** para otimizar o tamanho da imagem final e separar as etapas de build e runtime.

### Stage 1: Build (Maven)
```dockerfile
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
```
- Usa imagem Alpine (leve) com Maven 3.9.6 e Java 21
- Copia o `pom.xml` e baixa as dependências primeiro (cache layer)
- Copia o código fonte e compila o projeto
- Gera o JAR em `/app/target/sigma-0.0.1-SNAPSHOT.jar`

### Stage 2: Runtime (JRE)
```dockerfile
FROM eclipse-temurin:21-jre-alpine
```
- Usa apenas o JRE (Java Runtime Environment) - muito mais leve que JDK
- Copia apenas o JAR compilado do stage anterior
- Configura a porta e o comando de execução

## 📦 Tamanho da Imagem

- **Com JDK completo**: ~500MB
- **Com JRE (multi-stage)**: ~200MB
- **Redução**: ~60% menor!

## 🚀 Build Local

### Construir a imagem:
```bash
docker build -t sigma-backend -f Backend/sigma/Dockerfile Backend/sigma
```

### Executar localmente:
```bash
docker run -p 8080:8080 \
  -e DATABASE_URL=jdbc:mysql://localhost:3306/sigma \
  -e DATABASE_USERNAME=root \
  -e DATABASE_PASSWORD=senha \
  -e JWT_SECRET_KEY=sua_chave_secreta_aqui \
  -e FRONTEND_URL=http://localhost:5173 \
  -e SPRING_PROFILES_ACTIVE=prod \
  sigma-backend
```

### Executar com Docker Compose (recomendado):
```bash
cd Backend/sigma
docker-compose up
```

## 🔧 Variáveis de Ambiente

O Dockerfile suporta as seguintes variáveis de ambiente:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `8080` |
| `DATABASE_URL` | URL JDBC do MySQL | `jdbc:mysql://host:3306/db` |
| `DATABASE_USERNAME` | Usuário do banco | `root` |
| `DATABASE_PASSWORD` | Senha do banco | `senha123` |
| `JWT_SECRET_KEY` | Chave secreta JWT | `chave_secreta_32_chars` |
| `FRONTEND_URL` | URL do frontend | `https://app.vercel.app` |
| `SPRING_PROFILES_ACTIVE` | Profile do Spring | `prod` |

## 🏗️ Railway Deploy

O Railway detecta automaticamente o Dockerfile através do `railway.json`:

```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Backend/sigma/Dockerfile"
  }
}
```

### Processo de Deploy no Railway:
1. Railway detecta o `railway.json` na raiz do projeto
2. Usa o builder `DOCKERFILE`
3. Executa o build multi-stage
4. Injeta a variável `$PORT` automaticamente
5. Inicia o container com o JAR compilado

## 🔍 Troubleshooting

### Erro: "mvn: not found"
- **Causa**: Railway tentou usar Nixpacks/Railpack ao invés do Dockerfile
- **Solução**: Certifique-se de que o `railway.json` está configurado corretamente

### Erro: "Cannot connect to database"
- **Causa**: Variáveis de ambiente não configuradas
- **Solução**: Configure todas as variáveis de ambiente no Railway

### Build muito lento
- **Causa**: Maven baixando dependências toda vez
- **Solução**: O Dockerfile já usa cache de layers. Railway também cacheia layers entre builds.

## 📊 Otimizações Implementadas

1. **Multi-stage build**: Reduz tamanho da imagem final
2. **Layer caching**: `pom.xml` copiado antes do código fonte
3. **Alpine Linux**: Imagens base menores
4. **JRE ao invés de JDK**: Runtime mais leve
5. **Dependency download offline**: Maven baixa dependências uma vez

## 🔄 Atualizações

Para atualizar a imagem:
1. Faça push das alterações no Git
2. Railway detecta automaticamente e reconstrói
3. Novo deploy é feito automaticamente

## 📝 Notas

- O Dockerfile está otimizado para produção
- Usa Java 21 LTS (suporte de longo prazo)
- Configurado para aceitar `$PORT` dinâmico (Railway)
- Profile `prod` ativado por padrão via ENTRYPOINT
