# Guia de Deploy - Letis Wedding

Este guia fornece instruções detalhadas para fazer o deploy do aplicativo Letis Wedding em diferentes plataformas.

## 🚀 Deploy no Vercel (Recomendado)

### Pré-requisitos
- Conta no Vercel
- Projeto Firebase configurado
- Repositório Git (GitHub, GitLab, Bitbucket)

### Passos

1. **Conecte o Repositório**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte seu repositório Git

2. **Configure as Variáveis de Ambiente**
   - No dashboard do Vercel, vá para Settings > Environment Variables
   - Adicione todas as variáveis do Firebase:
     ```
     VITE_FIREBASE_API_KEY=sua_api_key
     VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=seu_projeto_id
     VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
     VITE_FIREBASE_APP_ID=seu_app_id
     ```

3. **Configure o Build**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o processo de build
   - Acesse a URL fornecida

### Configurações Adicionais do Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

## 🌐 Deploy no Netlify

### Passos

1. **Conecte o Repositório**
   - Acesse [netlify.com](https://netlify.com)
   - Clique em "New site from Git"
   - Conecte seu repositório

2. **Configure o Build**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Configure as Variáveis de Ambiente**
   - Vá para Site settings > Environment variables
   - Adicione as mesmas variáveis do Firebase

4. **Deploy**
   - Clique em "Deploy site"

## 🔥 Deploy no Firebase Hosting

### Pré-requisitos
- Firebase CLI instalado: `npm install -g firebase-tools`

### Passos

1. **Login no Firebase**
   ```bash
   firebase login
   ```

2. **Inicialize o Projeto**
   ```bash
   firebase init hosting
   ```
   - Selecione seu projeto Firebase
   - Public directory: `dist`
   - Configure como SPA: `Yes`
   - Overwrite index.html: `No`

3. **Configure as Variáveis de Ambiente**
   - Crie um arquivo `.env.production` com as variáveis do Firebase

4. **Build e Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## 🐳 Deploy com Docker

### Dockerfile
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### Comandos Docker
```bash
# Build da imagem
docker build -t letis-wedding .

# Executar container
docker run -p 80:80 letis-wedding
```

## 🔧 Configurações de Produção

### 1. Variáveis de Ambiente
Certifique-se de configurar todas as variáveis necessárias:

```env
VITE_FIREBASE_API_KEY=sua_api_key_producao
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 2. Regras do Firestore
Atualize as regras de produção:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
        request.auth.uid == "SEU_ADMIN_UID_REAL";
    }
    
    match /reservations/{reservationId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null && 
        request.auth.uid == "SEU_ADMIN_UID_REAL";
    }
  }
}
```

### 3. Configurações de Segurança
- Troque as credenciais padrão do admin
- Configure domínios autorizados no Firebase
- Ative HTTPS obrigatório
- Configure CORS se necessário

## 📊 Monitoramento

### Firebase Analytics
Para monitorar o uso da aplicação:

1. Ative o Google Analytics no Firebase Console
2. Configure eventos personalizados se necessário
3. Monitore métricas de uso e performance

### Logs de Erro
Configure monitoramento de erros:

```javascript
// Exemplo com Sentry (opcional)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "SUA_DSN_SENTRY",
  environment: "production"
});
```

## 🔄 CI/CD

### GitHub Actions (Vercel/Netlify)
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test # se houver testes
```

## 🚨 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Regras do Firestore atualizadas
- [ ] Credenciais de admin alteradas
- [ ] Domínios autorizados configurados
- [ ] HTTPS habilitado
- [ ] Testes passando
- [ ] Build funcionando localmente
- [ ] Backup do banco de dados
- [ ] Monitoramento configurado

## 📞 Suporte Pós-Deploy

Após o deploy, monitore:
- Logs de erro no console
- Performance da aplicação
- Uso do Firebase (quotas)
- Feedback dos usuários

---

**Boa sorte com o deploy! 🚀**
