#!/bin/bash

# Script para build e deploy do Letis Wedding
echo "🚀 Iniciando build do Letis Wedding..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale o npm primeiro."
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Executar build
echo "🔨 Executando build..."
npm run build

# Verificar se o build foi bem-sucedido
if [ -d "dist" ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📁 Pasta 'dist' criada com os arquivos de produção"
    echo ""
    echo "🎯 Próximos passos:"
    echo "1. Acesse https://netlify.com"
    echo "2. Faça login com sua conta"
    echo "3. Arraste a pasta 'dist' para a área de deploy"
    echo "4. Configure as variáveis de ambiente do Firebase"
    echo "5. Aguarde o deploy completar"
    echo ""
    echo "📋 Variáveis de ambiente necessárias:"
    echo "- VITE_FIREBASE_API_KEY"
    echo "- VITE_FIREBASE_AUTH_DOMAIN"
    echo "- VITE_FIREBASE_PROJECT_ID"
    echo "- VITE_FIREBASE_STORAGE_BUCKET"
    echo "- VITE_FIREBASE_MESSAGING_SENDER_ID"
    echo "- VITE_FIREBASE_APP_ID"
    echo "- VITE_ADMIN_EMAIL"
    echo "- VITE_ADMIN_PASSWORD"
else
    echo "❌ Build falhou. Verifique os erros acima."
    exit 1
fi
