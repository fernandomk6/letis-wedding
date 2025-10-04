# Letis Wedding - Lista de Presentes

Um aplicativo web responsivo para criar e gerenciar uma lista de presentes de casamento.

## 🚀 Tecnologias

- **React 18** com Vite
- **Firebase Firestore** para banco de dados
- **Firebase Authentication** para admin
- **CSS puro** (sem frameworks)
- **JavaScript/React puro** (sem bibliotecas de componentes)

## 🎨 Tema Visual

Tema de casamento com predominância de tons de azul:
- `#D8e8f2`, `#88ccdd`, `#91aabf`, `#62809a`
- `#a1bfdd`, `#799cbf`, `#42678b`, `#244667`

## 📋 Funcionalidades

### Para Administradores (Noiva)
- Login exclusivo: usuário `leticia`, senha `casei`
- Cadastrar, editar e excluir produtos
- Visualizar reservas e gerenciar doadores
- Filtrar por nome do produto e doador

### Para Convidados
- Acesso público via link
- Visualizar lista de presentes
- Reservar produtos preenchendo nome
- Não podem editar ou cancelar reservas

## 🔧 Configuração do Firebase

### 1. Criar Projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nomeie o projeto (ex: "letis-wedding")
4. Habilite Google Analytics (opcional)

### 2. Configurar Firestore
1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Começar no modo de teste" (para desenvolvimento)
4. Selecione uma localização (ex: us-central1)

### 3. Configurar Authentication
1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Vá para a aba "Sign-in method"
4. Habilite "Email/senha"
5. Clique em "Usuários" e "Adicionar usuário"
6. Email: `leticia@exemplo.com`
7. Senha: `casei`
8. **IMPORTANTE**: Copie o UID do usuário criado

### 4. Configurar Regras de Segurança
1. Vá para "Firestore Database" > "Regras"
2. Substitua as regras por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Leitura pública de produtos
    match /products/{productId} {
      allow read: if true;
      
      // Escrita apenas pelo admin autenticado
      allow create, update, delete: if request.auth != null && request.auth.uid == "ADMIN_UID_AQUI";
    }
    
    // Reservas públicas (para permitir reservas sem login)
    match /reservations/{reservationId} {
      allow read: if true;
      allow create: if true;
    }
  }
}
```

**Substitua `ADMIN_UID_AQUI` pelo UID real do usuário admin criado.**

### 5. Obter Configuração do Firebase
1. Vá para "Configurações do projeto" (ícone de engrenagem)
2. Role para baixo até "Seus aplicativos"
3. Clique em "Adicionar aplicativo" > "Web"
4. Nomeie o app (ex: "letis-wedding-web")
5. Copie a configuração `firebaseConfig`

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ instalado
- Conta Firebase configurada
- Git (para clonar o repositório)

### Passos
1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd letis-wedding
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Copie o arquivo de exemplo:
     ```bash
     cp env.example .env.local
     ```
   - Edite o arquivo `.env.local` com suas configurações do Firebase:
   ```env
   VITE_FIREBASE_API_KEY=sua_api_key_aqui
   VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu_projeto_id
   VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   VITE_FIREBASE_APP_ID=seu_app_id
   ```

4. Execute o projeto:
   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:5173`

### Populando o Banco com Dados de Exemplo

Para adicionar produtos de exemplo ao banco de dados:

1. Configure o Firebase corretamente primeiro
2. Execute o script de seed:
   ```bash
   node scripts/seed.js
   ```

Isso adicionará 10 produtos de exemplo à coleção `products`.

## 📊 Estrutura de Dados

### Coleção `products`
```json
{
  "title": "Jogo de panelas inox",
  "description": "Conjunto 5 peças",
  "imageUrl": "https://exemplo.com/panelas.jpg",
  "price": 350.0,
  "quantity": 1,
  "reservedBy": null,
  "reservedAt": null,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Coleção `reservations`
```json
{
  "productId": "abc123",
  "donorName": "João Silva",
  "createdAt": "timestamp"
}
```

## 🔒 Segurança

- **NUNCA** exponha a senha do admin no código
- Em produção, troque as credenciais padrão
- Use Cloud Functions para operações críticas (recomendado)
- Implemente validação de entrada no cliente e servidor

## 🧪 Dados de Exemplo

O projeto inclui um script para popular o banco com produtos de exemplo. Para executá-lo:

1. Certifique-se de que o Firebase está configurado corretamente
2. Execute o script:
   ```bash
   node scripts/seed.js
   ```

Isso adicionará 10 produtos de exemplo à coleção `products` no Firestore.

## 📱 Responsividade

O app é totalmente responsivo e otimizado para:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (até 767px)

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Netlify
1. Build: `npm run build`
2. Publish directory: `dist`
3. Configure variáveis de ambiente

## 🐛 Solução de Problemas

### Erro de autenticação
- Verifique se o usuário admin foi criado corretamente
- Confirme se o UID está correto nas regras do Firestore

### Erro de permissão
- Verifique as regras de segurança do Firestore
- Confirme se o usuário está autenticado

### Produtos não aparecem
- Verifique se a coleção `products` existe
- Confirme se as regras permitem leitura pública

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Console do navegador para erros JavaScript
2. Console do Firebase para erros de autenticação
3. Regras do Firestore para problemas de permissão

## 📁 Estrutura do Projeto

```
letis-wedding/
├── public/
├── src/
│   ├── components/          # Componentes React
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminHeader.jsx
│   │   ├── Header.jsx
│   │   ├── Login.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductForm.jsx
│   │   ├── ProductTable.jsx
│   │   ├── PublicList.jsx
│   │   └── ReserveModal.jsx
│   ├── contexts/            # Contextos React
│   │   └── AuthContext.jsx
│   ├── firebase/           # Configuração Firebase
│   │   ├── auth.js
│   │   ├── config.js
│   │   └── services.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── scripts/
│   └── seed.js            # Script para popular dados
├── firestore.rules        # Regras de segurança
├── env.example           # Exemplo de variáveis de ambiente
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa o projeto em modo de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🎯 Funcionalidades Implementadas

### ✅ Interface Pública
- Lista de produtos com cards responsivos
- Modal para reservar presentes
- Sistema de reservas com transações Firestore
- Validação de disponibilidade em tempo real

### ✅ Dashboard Administrativo
- Autenticação segura (leticia/casei)
- CRUD completo de produtos
- Gerenciamento de reservas
- Filtros por produto e doador
- Estatísticas em tempo real

### ✅ Sistema de Reservas
- Transações Firestore para consistência
- Prevenção de reservas simultâneas
- Histórico de reservas
- Transferência de reservas (admin)

### ✅ Design e UX
- Tema de casamento com paleta azul
- Design responsivo (mobile-first)
- Animações suaves
- Acessibilidade básica

---

**Desenvolvido com ❤️ para Letis Wedding**
