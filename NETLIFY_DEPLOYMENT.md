# 🚀 Como Publicar o Letis Wedding no Netlify

## 📋 Pré-requisitos
- ✅ Aplicação funcionando localmente
- ✅ Conta no Netlify (gratuita)
- ✅ Projeto no GitHub/GitLab/Bitbucket

## 🎯 Método 1: Deploy Direto pelo Netlify (Recomendado)

### 1. Preparar o Projeto para Build
```bash
# No terminal, na pasta do projeto:
npm run build
```

### 2. Acessar o Netlify
1. Vá para [netlify.com](https://netlify.com)
2. Clique em **"Sign up"** ou **"Log in"**
3. Faça login com GitHub (recomendado)

### 3. Conectar Repositório
1. Clique em **"New site from Git"**
2. Escolha **"GitHub"** como provedor
3. Autorize o Netlify a acessar seus repositórios
4. Selecione o repositório `letis-wedding`

### 4. Configurar Build Settings
```
Build command: npm run build
Publish directory: dist
```

### 5. Configurar Variáveis de Ambiente
1. Vá em **Site settings** → **Environment variables**
2. Adicione as variáveis do Firebase:
```
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_ADMIN_EMAIL=leticia@exemplo.com
VITE_ADMIN_PASSWORD=casei
```

### 6. Deploy
1. Clique em **"Deploy site"**
2. Aguarde o build completar
3. Seu site estará disponível em `https://seu-site.netlify.app`

## 🎯 Método 2: Deploy Manual (Alternativo)

### 1. Build Local
```bash
npm run build
```

### 2. Upload da Pasta `dist`
1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta `dist` para a área de deploy
3. Configure as variáveis de ambiente (mesmo processo acima)

## 🔧 Configurações Adicionais

### Custom Domain (Opcional)
1. Vá em **Site settings** → **Domain management**
2. Clique em **"Add custom domain"**
3. Configure seu domínio personalizado

### Redirects para SPA
Crie um arquivo `public/_redirects`:
```
/*    /index.html   200
```

### Headers de Segurança
Crie um arquivo `public/_headers`:
```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
```

## 🚨 Checklist Final

### ✅ Antes do Deploy:
- [ ] Aplicação funciona localmente (`npm run dev`)
- [ ] Build funciona (`npm run build`)
- [ ] Variáveis de ambiente configuradas
- [ ] Firebase configurado corretamente
- [ ] Regras do Firestore aplicadas

### ✅ Após o Deploy:
- [ ] Site carrega corretamente
- [ ] Login admin funciona
- [ ] Lista pública funciona
- [ ] Reservas funcionam
- [ ] Painel admin funciona

## 🔄 Deploy Automático

### Configurar Auto-Deploy:
1. No Netlify, vá em **Site settings** → **Build & deploy**
2. Em **Deploy settings**, configure:
   - **Branch to deploy**: `main` ou `master`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Deploy Preview:
- Cada Pull Request criará um preview automático
- Útil para testar mudanças antes de fazer merge

## 🐛 Troubleshooting

### Build Falha:
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Variáveis de Ambiente:
- Certifique-se de que todas as variáveis começam com `VITE_`
- Verifique se os valores estão corretos no Netlify

### Firebase Errors:
- Verifique se as regras do Firestore estão aplicadas
- Confirme se o projeto Firebase está ativo

## 📱 Teste Final

### URLs para Testar:
1. **Site Principal**: `https://seu-site.netlify.app`
2. **Lista Pública**: `https://seu-site.netlify.app/public`
3. **Login Admin**: `https://seu-site.netlify.app/login`

### Funcionalidades para Testar:
- [ ] Carregamento da página inicial
- [ ] Login como admin
- [ ] Adicionar/editar presentes
- [ ] Reservar presentes na lista pública
- [ ] Configurar nomes do casal
- [ ] Responsividade mobile

## 🎉 Pronto!

Seu aplicativo Letis Wedding estará online e funcionando! 

### Próximos Passos:
1. Compartilhe o link da lista pública com os convidados
2. Configure um domínio personalizado (opcional)
3. Configure backups automáticos
4. Monitore o uso através do dashboard do Netlify

### Links Úteis:
- [Netlify Dashboard](https://app.netlify.com)
- [Netlify Docs](https://docs.netlify.com)
- [Firebase Console](https://console.firebase.google.com)
