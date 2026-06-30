# 🚀 Sincronizar a GitHub

## Paso 1: Inicializar Git (Primera vez)

```bash
cd /ruta/a/brandforge-app

# Inicializar repositorio local
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: BrandForge project setup with DB models"

# Agregar remote
git remote add origin https://github.com/dmentdigital-cmd/brandforge-dmente.git

# Cambiar rama a main (si es necesario)
git branch -M main

# Push inicial
git push -u origin main
```

## Paso 2: Pushes Subsecuentes

```bash
# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "Implementar módulo X"

# Push
git push origin main
```

## Paso 3: Estructura en GitHub

Después del push inicial, tu repo tendrá:

```
brandforge-dmente/
├── backend/
│   ├── src/
│   ├── config/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
├── docs/
│   ├── SPEC.md
│   ├── CONTEXT.md
│   └── KB-BRANDFORGE.md
├── .gitignore
└── README.md
```

## Paso 4: Configurar en GitHub (Web)

1. Ve a https://github.com/dmentdigital-cmd/brandforge-dmente
2. Configura protección de rama `main`:
   - Requiere pull reviews
   - Requiere passing checks
3. Agrega descripción del repo
4. Agrega topics: `brandforge`, `saas`, `marca-personal`

## Próximos Commits

Cuando termines cada tarea, haz commit:

```bash
# Después de Tarea 7 (DB)
git add backend/src/models backend/config
git commit -m "feat(db): Add User, Assessment, Response models"
git push origin main

# Después de Tarea 8 (Auth)
git add backend/src/controllers backend/src/routes
git commit -m "feat(auth): Implement JWT authentication"
git push origin main

# Y así sucesivamente...
```

## Convención de Commits

Usa este formato para claridad:

```
feat(module): Descripción de feature
fix(module): Descripción del fix
docs(module): Cambios en documentación
refactor(module): Refactorización de código
test(module): Agregar/modificar tests
chore(module): Tareas de mantenimiento
```

Ejemplos:
- `feat(backend): Create Assessment model with validations`
- `fix(frontend): Fix form submission error handling`
- `docs(api): Update API endpoint documentation`

## Sincronizar cambios desde GitHub

```bash
# Traer cambios remotos
git pull origin main

# Ver estado
git status

# Ver log de commits
git log --oneline
```

---

**Una vez que hagas el push inicial, avisame y continúo con las tareas.**
