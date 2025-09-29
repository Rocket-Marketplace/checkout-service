#!/bin/bash

# Script para iniciar o Checkout Service com monitoramento

echo "🚀 Iniciando Checkout Service..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Iniciar monitoramento em background
echo "📊 Iniciando monitoramento..."
docker-compose -f docker-compose.monitoring.yml up -d

# Aguardar serviços estarem prontos
echo "⏳ Aguardando serviços estarem prontos..."
sleep 10

# Iniciar o serviço
echo "🚀 Iniciando Checkout Service..."
npm run start:dev

echo "✅ Checkout Service iniciado!"
echo ""
echo "🌐 URLs disponíveis:"
echo "  - Checkout Service: http://localhost:3003"
echo "  - Health Check: http://localhost:3003/health"
echo "  - Swagger: http://localhost:3003/api"
echo "  - Grafana: http://localhost:3000 (admin/admin)"
echo "  - Prometheus: http://localhost:9090"
echo "  - Jaeger: http://localhost:16686"
