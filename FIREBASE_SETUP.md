# Configuração do Firebase - Passo a Passo

Este guia detalha como configurar o Firebase para o projeto Letis Wedding.

## 🔥 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nomeie o projeto: `letis-wedding` (ou nome de sua escolha)
4. Desabilite Google Analytics (opcional para desenvolvimento)
5. Clique em "Criar projeto"

## 🗄️ 2. Configurar Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Começar no modo de teste" (para desenvolvimento)
4. Selecione uma localização próxima (ex: `us-central1`)
5. Clique em "Próximo" e depois "Concluído"

## 🔐 3. Configurar Authentication

1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Vá para a aba "Sign-in method"
4. Clique em "Email/senha" e habilite
5. Clique em "Salvar"

### Criar Usuário Admin

1. Vá para a aba "Usuários"
2. Clique em "Adicionar usuário"
3. Email: `leticia@exemplo.com`
4. Senha: `casei`
5. Clique em "Adicionar usuário"
6. **IMPORTANTE**: Copie o UID do usuário criado (você precisará dele)

## 🔧 4. Configurar Regras de Segurança

1. Vá para "Firestore Database" > "Regras"
2. Substitua as regras existentes por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
        request.auth.uid == "SEU_ADMIN_UID_AQUI";
    }
    
    match /reservations/{reservationId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null && 
        request.auth.uid == "SEU_ADMIN_UID_AQUI";
    }
  }
}
```

3. **Substitua `SEU_ADMIN_UID_AQUI` pelo UID real do usuário admin**
4. Clique em "Publicar"

## 📱 5. Configurar Aplicativo Web

1. Vá para "Configurações do projeto" (ícone de engrenagem)
2. Role para baixo até "Seus aplicativos"
3. Clique em "Adicionar aplicativo" > "Web"
4. Nomeie o app: `letis-wedding-web`
5. **NÃO** marque "Também configure o Firebase Hosting"
6. Clique em "Registrar aplicativo"
7. Copie a configuração `firebaseConfig`

## 🔑 6. Obter Configuração Firebase

A configuração será algo assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "letis-wedding.firebaseapp.com",
  projectId: "letis-wedding",
  storageBucket: "letis-wedding.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## 📝 7. Configurar Variáveis de Ambiente

1. Copie o arquivo `env.example` para `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Edite o arquivo `.env.local` com suas configurações:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=letis-wedding.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=letis-wedding
VITE_FIREBASE_STORAGE_BUCKET=letis-wedding.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

## 🧪 8. Testar a Configuração

1. Execute o projeto:
   ```bash
   npm run dev
   ```

2. Acesse `http://localhost:5173`

3. Teste o login admin:
   - Email: `leticia@exemplo.com`
   - Senha: `casei`

4. Popule com dados de exemplo:
   ```bash
   node scripts/seed.js
   ```

## 🔍 9. Verificar Configuração

### Firestore
- Coleção `products` deve existir
- Regras devem permitir leitura pública
- Admin deve conseguir criar/editar produtos

### Authentication
- Usuário admin deve conseguir fazer login
- Usuários não autenticados não devem conseguir criar produtos

### Reservas
- Usuários públicos devem conseguir criar reservas
- Admin deve conseguir gerenciar todas as reservas

## 🚨 Problemas Comuns

### Erro de Permissão
- Verifique se o UID do admin está correto nas regras
- Confirme se o usuário está autenticado

### Produtos Não Aparecem
- Verifique se a coleção `products` existe
- Confirme se as regras permitem leitura pública

### Erro de Autenticação
- Verifique se o Email/Password está habilitado
- Confirme se as credenciais estão corretas

### Erro de Build
- Verifique se todas as variáveis de ambiente estão configuradas
- Confirme se o arquivo `.env.local` existe

## 🔒 Segurança em Produção

### Antes do Deploy
1. Troque as credenciais padrão do admin
2. Configure domínios autorizados
3. Ative HTTPS obrigatório
4. Configure backup automático do Firestore

### Monitoramento
1. Ative Firebase Analytics
2. Configure alertas de quota
3. Monitore logs de erro
4. Configure backup regular

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador
2. Consulte os logs do Firebase Console
3. Teste as regras do Firestore
4. Verifique as configurações de autenticação

---

**Configuração concluída! 🎉**
