# 🔧 Como Resolver o Erro de Permissões do Firestore

## ❌ Problema
```
FirebaseError: Missing or insufficient permissions
```

## 🎯 Causa
As regras do Firestore ainda têm o placeholder `"ADMIN_UID_AQUI"` em vez do UID real do usuário admin.

## ✅ Solução Passo a Passo

### 1. Obter o UID do Usuário Admin

#### Opção A: Via Firebase Console (Recomendado)
1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto `letis-wedding`
3. Vá em **Authentication** > **Users**
4. Encontre o usuário com email `leticia@exemplo.com`
5. Clique no usuário para ver os detalhes
6. **Copie o UID** (exemplo: `abc123def456ghi789`)

#### Opção B: Via Script (Alternativo)
1. Configure seu arquivo `.env.local` com as credenciais do Firebase
2. Execute: `node scripts/get-admin-uid.js`
3. Copie o UID exibido no console

### 2. Atualizar as Regras do Firestore

1. No Firebase Console, vá em **Firestore Database** > **Rules**
2. Substitua `"ADMIN_UID_AQUI"` pelo UID real do admin
3. Exemplo de regra atualizada:
```javascript
allow create, update, delete: if request.auth != null && 
  request.auth.uid == "abc123def456ghi789";
```
4. Clique em **Publish** para aplicar as regras

### 3. Verificar se Funcionou

1. Volte ao painel administrativo
2. Tente salvar os nomes do casal novamente
3. Deve funcionar sem erros de permissão

## 🔍 Regras Completas do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Products collection - public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
        request.auth.uid == "SEU_UID_AQUI";
    }
    
    // Couple settings collection - public read, admin write
    match /coupleSettings/{settingsId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
        request.auth.uid == "SEU_UID_AQUI";
    }
    
    // Reservations collection - public read and create
    match /reservations/{reservationId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null && 
        request.auth.uid == "SEU_UID_AQUI";
    }
  }
}
```

## 🚨 Importante
- Substitua `"SEU_UID_AQUI"` pelo UID real do usuário admin
- Certifique-se de que o usuário admin está autenticado antes de tentar salvar
- As regras são aplicadas imediatamente após o publish

## 🆘 Se Ainda Não Funcionar
1. Verifique se está logado como admin no painel
2. Confirme que o UID está correto nas regras
3. Verifique se as regras foram publicadas com sucesso
4. Tente fazer logout e login novamente
