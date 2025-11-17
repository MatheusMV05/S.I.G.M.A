# 🚀 Guia Rápido de Deploy

## Checklist Rápido

### ✅ Backend (Railway)

1. **Criar conta no Railway**: https://railway.app
2. **Criar novo projeto** e adicionar MySQL
3. **Executar script SQL** no banco MySQL criado:
   - Arquivo: `Backend/sigma/scripts_sql/CriacaoEInsercao.sql`
4. **Adicionar repositório GitHub** ao Railway
5. **⚠️ IMPORTANTE - Configurar Root Directory**:
   - Vá em **Settings** → **Build**
   - Em **Root Directory**, coloque: `Backend/sigma`
   - Em **Watch Paths**, coloque: `Backend/sigma/**`
6. **Configurar variáveis de ambiente**:
   ```env
   DATABASE_URL=jdbc:mysql://[HOST]:[PORT]/[DATABASE]?createDatabaseIfNotExist=true&serverTimezone=UTC&useSSL=false&characterEncoding=UTF-8&allowPublicKeyRetrieval=true
   DATABASE_USERNAME=seu_usuario
   DATABASE_PASSWORD=sua_senha
   JWT_SECRET_KEY=sua_chave_secreta_32_caracteres_minimo
   SPRING_PROFILES_ACTIVE=prod
   ```
7. **Deploy** e copiar URL do backend

### ✅ Frontend (Vercel)

1. **Criar conta no Vercel**: https://vercel.com
2. **Importar repositório** do GitHub
3. **Configurar projeto**:
   - Framework: Vite
   - Root Directory: `Frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Adicionar variável de ambiente**:
   ```env
   VITE_API_URL=https://sua-url-railway.up.railway.app/api
   ```
5. **Deploy**
6. **Copiar URL do Vercel** e atualizar no Railway:
   - Adicionar variável `FRONTEND_URL` no Railway com a URL do Vercel

### ✅ Testar

1. Acessar URL do Vercel
2. Fazer login com: `admin` / `admin123`
3. Verificar se o sistema está funcionando

---

## 📝 Variáveis de Ambiente Necessárias

### Railway (Backend)
```env
DATABASE_URL=jdbc:mysql://[HOST]:[PORT]/[DATABASE]?createDatabaseIfNotExist=true&serverTimezone=UTC&useSSL=false&characterEncoding=UTF-8&allowPublicKeyRetrieval=true
DATABASE_USERNAME=root
DATABASE_PASSWORD=sua_senha
JWT_SECRET_KEY=30bbab3fdb5fbf587f109bc3ec67d0dbf290df1f62bcb98e2b06c310b1e5485a
SPRING_PROFILES_ACTIVE=prod
FRONTEND_URL=https://seu-app.vercel.app
```

### Vercel (Frontend)
```env
VITE_API_URL=https://seu-backend.up.railway.app/api
```

---

## 🔗 Links Úteis

- **Documentação completa**: [DEPLOY.md](DEPLOY.md)
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs

---

**Tempo estimado total**: 15-30 minutos ⏱️
