#!/bin/bash

# ===================================
# SCRIPT PARA SINCRONIZAR A GITHUB
# ===================================

echo "🚀 Sincronizando BrandForge a GitHub..."
echo ""

# Verifica si Git está instalado
if ! command -v git &> /dev/null
then
    echo "❌ Git no está instalado. Descárgalo de: https://git-scm.com/download"
    exit 1
fi

echo "✓ Git detectado"
echo ""

# Inicializar repositorio
echo "1️⃣  Inicializando repositorio local..."
git init
echo "✓ Repositorio inicializado"
echo ""

# Agregar archivos
echo "2️⃣  Agregando archivos..."
git add .
echo "✓ Archivos agregados"
echo ""

# Configurar usuario (si no está configurado)
if ! git config user.name &> /dev/null
then
    echo "3️⃣  Configurando usuario de Git..."
    git config user.name "Dmente Digital"
    git config user.email "dmentdigital@gmail.com"
    echo "✓ Usuario configurado"
    echo ""
fi

# Primer commit
echo "4️⃣  Creando primer commit..."
git commit -m "Initial commit: BrandForge project setup with DB models and configuration"
echo "✓ Commit creado"
echo ""

# Agregar remote
echo "5️⃣  Conectando a repositorio remoto..."
git remote add origin https://github.com/dmentdigital-cmd/brandforge-dmente.git 2>/dev/null || echo "⚠️  Remote ya existe"
echo "✓ Remote configurado"
echo ""

# Cambiar rama a main
echo "6️⃣  Cambiando rama a 'main'..."
git branch -M main
echo "✓ Rama configurada"
echo ""

# Push
echo "7️⃣  Subiendo a GitHub..."
git push -u origin main

# Verificar si fue exitoso
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡ÉXITO! Proyecto sincronizado a GitHub"
    echo ""
    echo "Repo: https://github.com/dmentdigital-cmd/brandforge-dmente"
    echo ""
    echo "Próximos pasos:"
    echo "1. Ve a tu repo en GitHub"
    echo "2. Verifica que todos los archivos estén allí"
    echo "3. Avísale a Claude que continue con el desarrollo"
else
    echo ""
    echo "❌ Error al pushear a GitHub"
    echo ""
    echo "Posibles causas:"
    echo "- GitHub token expirado"
    echo "- Credenciales incorrectas"
    echo "- Sin conexión a internet"
    echo ""
    echo "Solución:"
    echo "1. Verifica tu conexión a internet"
    echo "2. Ve a GitHub y verifica tu token"
    echo "3. Intenta de nuevo"
fi
