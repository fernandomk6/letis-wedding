# Letis Wedding - Guia de Uso

Este guia explica como usar o aplicativo Letis Wedding após a configuração.

## 👥 Para Convidados (Usuários Públicos)

### Acessando a Lista de Presentes
1. Acesse o link público da lista de presentes
2. Visualize todos os produtos disponíveis
3. Cada produto mostra:
   - Nome e descrição
   - Preço (se informado)
   - Status (Disponível ou Reservado)

### Reservando um Presente
1. Clique no botão "Reservar Presente" em um produto disponível
2. Preencha seu nome completo no modal
3. Clique em "Confirmar Reserva"
4. O produto será reservado em seu nome

### ⚠️ Importante para Convidados
- **Não é possível** cancelar ou alterar uma reserva
- **Não é possível** reservar um produto já reservado
- Apenas a noiva (admin) pode gerenciar reservas

## 👑 Para a Noiva (Administradora)

### Fazendo Login
1. Acesse a área administrativa
2. Use as credenciais:
   - **Email**: `leticia@exemplo.com`
   - **Senha**: `casei`
3. Clique em "Entrar"

### Gerenciando Produtos

#### Adicionar Novo Produto
1. Clique em "+ Adicionar Produto"
2. Preencha os campos:
   - **Nome do Produto** (obrigatório)
   - **Descrição** (obrigatório)
   - **URL da Imagem** (opcional)
   - **Preço** (opcional)
   - **Quantidade** (padrão: 1)
3. Clique em "Adicionar"

#### Editar Produto
1. Na tabela de produtos, clique no ícone de edição (✏️)
2. Modifique os campos desejados
3. Clique em "Atualizar"

#### Excluir Produto
1. Na tabela de produtos, clique no ícone de lixeira (🗑️)
2. Confirme a exclusão

### Gerenciando Reservas

#### Visualizar Reservas
- A tabela mostra todos os produtos e suas reservas
- Coluna "Status" indica se está disponível ou reservado
- Coluna "Doador" mostra quem reservou
- Coluna "Data Reserva" mostra quando foi reservado

#### Desvincular Reserva
1. Para um produto reservado, clique no ícone ❌
2. Confirme a ação
3. O produto voltará a ficar disponível

#### Transferir Reserva
1. Para um produto reservado, clique no ícone 🔄
2. Digite o novo nome do doador
3. Clique em "Transferir"

### Filtrando Produtos

#### Buscar por Produto
- Use o campo "Buscar por produto"
- Digite parte do nome ou descrição
- A lista será filtrada em tempo real

#### Filtrar por Doador
- Use o campo "Filtrar por doador"
- Digite parte do nome do doador
- Apenas produtos reservados por esse doador aparecerão

### Estatísticas
O dashboard mostra:
- **Total de Produtos**: Quantidade total na lista
- **Reservados**: Quantos produtos foram reservados
- **Disponíveis**: Quantos produtos ainda estão disponíveis

## 🔧 Funcionalidades Técnicas

### Sistema de Reservas
- **Transações Firestore**: Garantem que dois usuários não reservem o mesmo produto
- **Validação em Tempo Real**: Verifica disponibilidade antes de confirmar
- **Histórico Completo**: Todas as reservas são registradas com data/hora

### Segurança
- **Autenticação Obrigatória**: Apenas admin pode gerenciar produtos
- **Regras de Segurança**: Firestore protege contra acesso não autorizado
- **Validação de Dados**: Campos obrigatórios são validados

### Responsividade
- **Mobile-First**: Otimizado para dispositivos móveis
- **Tablet**: Interface adaptada para tablets
- **Desktop**: Experiência completa em computadores

## 🎨 Personalização

### Cores e Tema
O aplicativo usa uma paleta de cores azul para o tema de casamento:
- Azul claro: `#D8e8f2`
- Azul médio: `#88ccdd`
- Azul escuro: `#244667`

### Imagens dos Produtos
- Use URLs de imagens públicas
- Formatos recomendados: JPG, PNG, WebP
- Tamanho recomendado: 400x400px ou similar

## 📱 Acesso Mobile

### Navegadores Suportados
- Chrome (Android/iOS)
- Safari (iOS)
- Firefox (Android)
- Edge (Android)

### Funcionalidades Mobile
- Interface touch-friendly
- Botões com tamanho adequado para toque
- Modais responsivos
- Navegação otimizada

## 🚨 Solução de Problemas

### Problemas Comuns

#### "Produto já foi reservado"
- Outro convidado reservou o produto primeiro
- Escolha outro produto disponível

#### "Erro ao reservar produto"
- Verifique sua conexão com a internet
- Tente novamente em alguns segundos

#### "Credenciais inválidas" (Admin)
- Verifique se o email e senha estão corretos
- Confirme se o usuário admin foi criado no Firebase

#### Produtos não aparecem
- Verifique se há produtos cadastrados
- Confirme se as regras do Firestore estão corretas

### Contato para Suporte
Se encontrar problemas técnicos:
1. Verifique o console do navegador (F12)
2. Consulte os logs do Firebase Console
3. Teste em outro navegador
4. Verifique a conexão com a internet

## 📊 Monitoramento

### Para a Noiva
- Acompanhe as estatísticas no dashboard
- Monitore quais produtos são mais reservados
- Gerencie reservas conforme necessário

### Para Convidados
- A lista é atualizada em tempo real
- Novos produtos aparecem automaticamente
- Reservas são confirmadas instantaneamente

## 🎯 Dicas de Uso

### Para a Noiva
1. **Adicione produtos com descrições claras**
2. **Use imagens de boa qualidade**
3. **Monitore as reservas regularmente**
4. **Mantenha a lista atualizada**

### Para Convidados
1. **Reserve apenas produtos que realmente vai dar**
2. **Use seu nome completo para facilitar identificação**
3. **Verifique se o produto ainda está disponível**
4. **Entre em contato com a noiva se tiver dúvidas**

---

**Aproveite o aplicativo Letis Wedding! 💙**
