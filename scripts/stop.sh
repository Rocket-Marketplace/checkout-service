#!/bin/bash

# Script para parar o Checkout Service

echo "🛑 Parando Checkout Service..."

# Parar o serviço (se estiver rodando)
pkill -f "checkout-service"

# Parar monitoramento
echo "📊 Parando monitoramento..."
docker-compose -f docker-compose.monitoring.yml down

echo "✅ Checkout Service parado!"
