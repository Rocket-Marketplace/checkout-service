#!/bin/bash

# Script para verificar a saúde do Checkout Service

echo "🔍 Verificando saúde do Checkout Service..."

# Verificar se o serviço está rodando
if curl -f http://localhost:3003/health > /dev/null 2>&1; then
    echo "✅ Checkout Service está saudável"
    
    # Mostrar detalhes do health check
    echo "📋 Detalhes do Health Check:"
    curl -s http://localhost:3003/health | jq '.' 2>/dev/null || curl -s http://localhost:3003/health
    
    echo ""
    echo "📊 Monitoramento:"
    echo "  - Grafana: http://localhost:3000"
    echo "  - Prometheus: http://localhost:9090"
    echo "  - Jaeger: http://localhost:16686"
    
else
    echo "❌ Checkout Service não está respondendo"
    echo "💡 Execute: ./scripts/start.sh"
fi
