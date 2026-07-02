# 🚀 Guía de Configuración - BrandForge

**Objetivo:** Configurar el entorno local para desarrollo de BrandForge  
**Tiempo estimado:** 15-20 minutos  
**Nivel:** Principiante

---

## ✅ Requisitos Previos

Verifica que tengas instalados:

- **Node.js** v18+ → [Descargar](https://nodejs.org)
- **PostgreSQL** 12+ → [Descargar](https://www.postgresql.org/download)
- **Git** → [Descargar](https://git-scm.com)
- **GitHub Desktop** (recomendado para commits)

Verificar instalación:
```bash
node --version    # Debe ser v18 o superior
npm --version     # Debe ser v9 o superior
psql --version    # PostgreSQL debe estar instalado
```

---

## 📦 Paso 1: Clonar Repositorio

```bash
# El repositorio ya está clonado en:
# C:\Users\diego\Documents\DIEGOSAN\PROYECTO D MENTE DIGITAL\DESARROLLO DE MARCA PERSONAL\BRANDFORGE-DMENTE\brandforge-dmente

# Si necesitas clonar desde GitHub:
git clone https://github.com/tu-usuario/brandforge-dmente.git
cd brandforge-dmente
```

---

## 🔧 Paso 2: Configurar Base de Datos

### A. Crear Base de Datos PostgreSQL

```bash
# Abre PostgreSQL (psql)
psql -U postgres

# Crea la base de datos
CREATE DATABASE brandforge_db;

# Verifica que se creó
\l

# Salir
\q
```

### B. Crear Usuario (Opcional - si no usas postgres/postgres)

```bash
psql -U postgres

# Crear usuario
CREATE USER brandforge WITH PASSWORD 'tu_password_aqui';

# Asignar permisos
ALTER ROLE brandforge CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE brandforge_db TO brandforge;

\q
```

---

## 📝 Paso 3: Configurar Variables de Entorno

### Backend

```bash
cd backend

# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus valores (usar Notepad o VS Code)
# Campos importantes:
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=brandforge_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=tu_secreto_super_seguro_aqui
```

### Frontend

```bash
cd ../frontend

# Si .env.local no existe, créalo:
cat > .env.local << EOF
VITE_API_URL=http://localhost:5000
VITE_ENVIRONMENT=development
EOF

# O manualmente en Notepad:
# VITE_API_URL=http://localhost:5000
# VITE_ENVIRONMENT=development
```

---

## 📦 Paso 4: Instalar Dependencias

### Backend

```bash
cd backend
npm install

# Esto instalará:
# - express
# - sequelize
# - pg (PostgreSQL)
# - bcryptjs (para hashing de contraseñas)
# - jsonwebtoken (para JWT)
# - cors
# - dotenv
# - nodemon (para desarrollo)
```

### Frontend

```bash
cd ../frontend
npm install

# Esto instalará:
# - react
# - react-dom
# - react-router-dom
# - axios
# - zustand
# - tailwindcss
# - vite
```

---

## 🎯 Paso 5: Iniciar Servidores

### Terminal 1: Backend

```bash
cd backend
npm run dev

# Debe mostrar:
# ✓ Database connection successful
# ✓ Database synced
# ✓ Server running on http://localhost:5000
# ✓ API endpoints at http://localhost:5000/api
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev

# Debe mostrar:
# ✓ Local: http://localhost:5173/
# ✓ press q to quit
```

---

## ✅ Paso 6: Verificar que Todo Funciona

### Opción A: Navegador

Abre: **http://localhost:5173**

Deberías ver:
- Página de BrandForge
- Indicador de "API Connected" ✓ (verde)

### Opción B: Terminal (Testing)

```bash
# En otra terminal, prueba el endpoint de salud:
curl http://localhost:5000/api/health

# Respuesta esperada:
# {"status":"OK","timestamp":"2026-06-30T10:30:00Z"}
```

---

## 🧪 Paso 7: Probar Autenticación (Opcional)

### Registrarse

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "profession": "Developer"
  }'

# Respuesta esperada:
# {
#   "message": "User registered successfully",
#   "user": {...},
#   "token": "eyJ..."
# }
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Obtener Usuario Actual

```bash
# Guarda el token del login anterior
TOKEN="eyJ..."

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/auth/me
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to PostgreSQL"

```bash
# Verifica que PostgreSQL está corriendo:
psql -U postgres

# Si no abre, inicia PostgreSQL
# Windows: Busca "PostgreSQL" en servicios
# Mac: brew services start postgresql@14
# Linux: sudo systemctl start postgresql
```

### Error: "Port 5000 already in use"

```bash
# Cambia el puerto en .env
PORT=5001

# O mata el proceso usando el puerto:
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Error: "npm ERR! code ERESOLVE"

```bash
cd backend
npm install --legacy-peer-deps

cd ../frontend
npm install --legacy-peer-deps
```

### Error: "Cannot find module 'xxx'"

```bash
# Limpia y reinstala
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 Estructura de Carpetas de Desarrollo

```
brandforge-dmente/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js      ✓
│   │   │   └── assessmentController.js (Task 5)
│   │   ├── models/
│   │   │   ├── User.js                ✓
│   │   │   ├── Assessment.js          (Task 5)
│   │   │   └── AssessmentResponse.js  (Task 5)
│   │   ├── routes/
│   │   │   ├── authRoutes.js          ✓
│   │   │   └── assessmentRoutes.js    (Task 5)
│   │   └── utils/
│   │       └── authMiddleware.js      ✓
│   ├── config/
│   │   └── database.js                ✓
│   ├── .env.example
│   ├── package.json
│   └── index.js                       ✓
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   └── Assessment/            (Task 6)
│   │   ├── pages/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── App.jsx                    ✓
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   ├── SPEC.md                        ✓
│   ├── CONTEXT.md                     ✓
│   └── KB-BRANDFORGE.md               ✓
│
├── README.md
├── DEVELOPMENT.md                     ✓ (Acabamos de crear)
├── SETUP.md                           ✓ (Este archivo)
└── .gitignore
```

---

## 🔑 Variables Clave en Desarrollo

| Variable | Backend | Frontend | Descripción |
|----------|---------|----------|-------------|
| API URL | `API_URL` | `VITE_API_URL` | URL del backend |
| JWT Secret | `JWT_SECRET` | N/A | Clave para firmar tokens |
| DB Connection | `DB_*` | N/A | Conexión a PostgreSQL |
| Environment | `NODE_ENV` | `VITE_ENVIRONMENT` | development/production |

---

## 🚀 Próximos Pasos

1. ✅ Backend funcionando en `http://localhost:5000`
2. ✅ Frontend funcionando en `http://localhost:5173`
3. ⏳ **Implementar Módulo 1 Backend** (Ver `DEVELOPMENT.md`)
4. ⏳ **Implementar Módulo 1 Frontend** (Ver `DEVELOPMENT.md`)
5. ⏳ Generador de PDF y Dashboard
6. ⏳ Módulos 2-6
7. ⏳ Testing y Deployment

---

## 💾 Guardar Cambios en GitHub Desktop

1. Abre GitHub Desktop
2. Selecciona el repositorio `brandforge-dmente`
3. Haz cambios en los archivos
4. GitHub Desktop mostrará cambios
5. Escribe un mensaje: ej. "Backend: Implementar autenticación"
6. Haz click en "Commit to main"
7. Haz click en "Push origin"

---

## 📚 Documentación Adicional

- **SPEC.md** → Especificación completa del proyecto
- **CONTEXT.md** → Glosario de términos
- **DEVELOPMENT.md** → Roadmap detallado por tareas
- **KB-BRANDFORGE.md** → Base de conocimiento

---

## ❓ Preguntas Frecuentes

**P: ¿Qué puerto usa el backend?**  
R: Puerto 5000 (configurable en .env)

**P: ¿Qué puerto usa el frontend?**  
R: Puerto 5173 (configurable en vite.config.js)

**P: ¿Cómo reseteo la base de datos?**  
R: Borra la base de datos y déjate que Sequelize la recree:
```bash
psql -U postgres -c "DROP DATABASE brandforge_db;"
psql -U postgres -c "CREATE DATABASE brandforge_db;"
# Reinicia el backend
```

**P: ¿Cómo veo logs de la base de datos?**  
R: En backend/.env, cambia a:
```
NODE_ENV=development
# Sequelize ya logea automáticamente en desarrollo
```

---

## ✉️ Soporte

Si tienes problemas en la instalación:
- Revisa este archivo (SETUP.md)
- Consulta DEVELOPMENT.md
- Contacta: dmentdigital@gmail.com

---

**Made with ❤️ for Personal Branding**

No es azar, es propósito. — www.dmentedigital.co
