# 🚀 Guía de Deployment a Producción - BrandForge

**Status:** Ready to Deploy  
**Time to Deploy:** 30-45 minutes  
**Cost:** ~$20-50/month

---

## 📋 Checklist Pre-Deployment

Antes de deployar, verifica:

- [ ] Código commiteado en GitHub
- [ ] `.env` files configurados localmente
- [ ] Base de datos PostgreSQL funciona
- [ ] Backend corre sin errores (`npm run dev`)
- [ ] Frontend corre sin errores (`npm run dev`)
- [ ] Tests pasan (opcional para MVP)

---

## 🔧 Paso 1: Configurar Base de Datos PostgreSQL (Remota)

### Opción A: Usar Render (Recomendado - Gratis)

1. **Ir a https://render.com**
2. **Sign Up** (con GitHub preferible)
3. **Crear nuevo PostgreSQL Database:**
   - Click "New +" → "PostgreSQL"
   - Name: `brandforge-db`
   - Database: `brandforge_db`
   - User: `brandforge_user`
   - Region: `Ohio` o cercana a tu zona
   - Pricing Tier: `Free` (para MVP)
   - Click "Create Database"

4. **Copiar Connection String:**
   - Se mostrará algo como:
   ```
   postgresql://user:password@host:5432/database
   ```
   - Guarda esto para después

### Opción B: Usar AWS RDS

1. Ir a AWS Console
2. RDS → Create Database
3. PostgreSQL 14
4. Free Tier eligible
5. Configurar security groups
6. Guardar connection string

### Opción C: Usar ElephantSQL (Legacy pero funciona)

1. Ir a https://www.elephantsql.com
2. Sign Up
3. Create New Instance
4. Free plan
5. Copiar connection string

---

## 🔙 Paso 2: Deployar Backend (Node.js)

### Opción A: Render (Recomendado)

#### 1. Crear Render Account
- Ir a https://render.com
- Sign up con GitHub

#### 2. Conectar GitHub
- Settings → Repositories
- Conectar `brandforge-dmente` repo

#### 3. Crear Web Service
- Click "New +" → "Web Service"
- Conectar repositorio `brandforge-dmente`
- **Name:** `brandforge-backend`
- **Branch:** `main`
- **Build Command:** 
  ```
  cd backend && npm install
  ```
- **Start Command:**
  ```
  cd backend && npm start
  ```
  (Nota: Asegúrate que package.json tiene `"start": "node index.js"`)

#### 4. Configurar Environment Variables
En el panel de Render:
- Click "Environment"
- Agregar variables:

```
NODE_ENV=production
PORT=5000

DB_HOST=<tu-render-db-host>
DB_PORT=5432
DB_NAME=brandforge_db
DB_USER=brandforge_user
DB_PASSWORD=<tu-password>

JWT_SECRET=<genera-una-clave-larga-aleatoria>
JWT_EXPIRE=7d

FRONTEND_URL=https://brandforge-frontend.vercel.app
```

**Generar JWT_SECRET fuerte:**
```bash
# En tu terminal, ejecuta:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 5. Deploy
- Click "Deploy"
- Espera 2-3 minutos
- Deberías ver URL como: `https://brandforge-backend-xxxxx.onrender.com`

#### 6. Probar Backend
```bash
curl https://brandforge-backend-xxxxx.onrender.com/api/health
# Debe retornar: {"status":"OK","timestamp":"..."}
```

### Opción B: Heroku (Alternativa)

```bash
# 1. Instalar Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Crear app
heroku create brandforge-backend

# 4. Agregar PostgreSQL add-on
heroku addons:create heroku-postgresql:hobby-dev -a brandforge-backend

# 5. Configurar environment variables
heroku config:set NODE_ENV=production -a brandforge-backend
heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") -a brandforge-backend

# 6. Deploy
git push heroku main

# 7. Abrir app
heroku open -a brandforge-backend
```

---

## 🎨 Paso 3: Deployar Frontend (React)

### Opción A: Vercel (Recomendado - Gratis)

#### 1. Crear Vercel Account
- Ir a https://vercel.com
- Sign up con GitHub

#### 2. Importar Proyecto
- Click "Add New Project"
- Selecciona repositorio `brandforge-dmente`
- Click "Import"

#### 3. Configurar Build
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

#### 4. Configurar Environment Variables
Antes de Deploy:
- Click "Environment Variables"
- Agregar:
```
VITE_API_URL=https://brandforge-backend-xxxxx.onrender.com
VITE_ENVIRONMENT=production
```

#### 5. Deploy
- Click "Deploy"
- Espera 2-3 minutos
- Vercel te dará URL como: `https://brandforge-dmente.vercel.app`

#### 6. Probar Frontend
- Abre la URL en navegador
- Debe cargar la aplicación
- Intenta registrarte

### Opción B: Netlify (Alternativa)

```bash
# 1. Instalar CLI
npm install -g netlify-cli

# 2. Deploy
cd frontend
netlify deploy --prod

# 3. Conectar con GitHub (opcional pero recomendado)
```

---

## 🔗 Paso 4: Conectar Backend y Frontend

### Actualizar URL del Backend en Frontend

1. **En Vercel:**
   - Go to Settings → Environment Variables
   - Cambiar `VITE_API_URL` a tu URL de Render/Heroku
   - Redeploy

2. **Ejemplo:**
   ```
   VITE_API_URL=https://brandforge-backend-xxxxx.onrender.com
   ```

### Actualizar CORS en Backend

En `backend/index.js`, asegúrate que el CORS permite tu frontend:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',  // Local
    'https://brandforge-dmente.vercel.app'  // Production
  ]
}));
```

---

## 🌍 Paso 5: Configurar Dominio Personalizado (Opcional)

### Dominio para Frontend

#### Con Vercel:
1. Click "Settings" → "Domains"
2. Agregar dominio personalizado
3. Seguir instrucciones de DNS
4. Esperar 24-48 horas para propagación

#### Con tu dominio actual:
1. Si tienes `www.dmentedigital.co`
2. Crear subdomain: `brandforge.dmentedigital.co`
3. Apuntar CNAME a Vercel
4. Vercel te dará instrucciones

### Dominio para Backend

Render proporciona URL pública, pero si quieres custom:
1. Igual que frontend
2. Subdomain: `api.brandforge.dmentedigital.co`
3. Apuntar a Render
4. Actualizar `VITE_API_URL` en frontend

---

## 🧪 Paso 6: Testing Post-Deployment

### Test 1: Verificar APIs
```bash
# Health check
curl https://brandforge-backend-xxxxx.onrender.com/api/health

# Debe retornar 200 OK con timestamp
```

### Test 2: Flujo Completo en Navegador
1. Abrir frontend URL
2. Registrarse con nuevo email
3. Verificar que se crea usuario en DB
4. Iniciar Módulo 1
5. Responder preguntas
6. Completar assessment
7. Ver resultados
8. Descargar PDF

### Test 3: Verificar Base de Datos

```bash
# Conectarse a base de datos remota:
psql postgresql://user:password@host:5432/brandforge_db

# Listar usuarios creados:
SELECT email, "firstName", "createdAt" FROM users;

# Ver assessments:
SELECT * FROM assessments;

# Salir:
\q
```

---

## 📊 Monitoreo y Logs

### Ver Logs en Render
1. Ir a Dashboard de Render
2. Seleccionar `brandforge-backend`
3. Click "Logs"
4. Ver errores en tiempo real

### Ver Logs en Vercel
1. Ir a Dashboard de Vercel
2. Seleccionar proyecto
3. Click "Deployments"
4. Seleccionar deployment
5. Ver logs

### Alertas Configuradas
- Backend caído → Render notifica
- Build falla → Vercel notifica
- Error en app → Chequear logs

---

## 💾 Backup de Base de Datos

### Exportar Datos (Regular)
```bash
# Hacer backup completo
pg_dump postgresql://user:password@host:5432/brandforge_db > backup_$(date +%Y%m%d).sql

# Restaurar desde backup
psql postgresql://user:password@host:5432/brandforge_db < backup_20260630.sql
```

### Scheduled Backups en Render
- Render hace backups automáticos
- Disponible en Plan Estándar+
- Para MVP gratis, exporta manualmente semanalmente

---

## 🔒 Seguridad en Producción

### Checklist de Seguridad
- [ ] JWT_SECRET es fuerte (32+ caracteres aleatorios)
- [ ] HTTPS está habilitado (automático en Vercel/Render)
- [ ] CORS está configurado correctamente
- [ ] Variables de entorno NO están en GitHub
- [ ] Passwords están hashados (bcryptjs)
- [ ] Database tiene credenciales fuertes
- [ ] Node ENV=production en backend
- [ ] No hay console.log de datos sensibles

### Variables Que NO Van en GitHub
```
.env          # ← No commitear
.env.local    # ← No commitear
.env.production  # ← No commitear

Archivo .gitignore debe tener:
.env*
.env.local
.env.production
```

---

## 💰 Costos Estimados

| Servicio | Costo |
|----------|-------|
| Render Database | $0 (free) o $15/month |
| Render Backend | $0 (free) o $7/month |
| Vercel Frontend | $0 (free) |
| Dominio personalizado | $12/year |
| **TOTAL MENSUAL** | **$0-22** |

---

## 🆘 Troubleshooting

### Error: "Cannot connect to database"
```
Solución:
1. Verificar DATABASE_URL es correcta
2. Verificar firewall permite acceso
3. En Render, ir a Settings → Security
4. Asegurarse que IP de backend está permitida
```

### Error: "CORS blocked"
```
Solución:
1. Verificar CORS está configurado en index.js
2. Agregar frontend URL a CORS allowlist
3. Redeploy backend
```

### Error: "Vercel can't reach API"
```
Solución:
1. Verificar VITE_API_URL es correcta
2. Verificar backend está corriendo
3. Redeploy frontend
```

### Páginas dan 404 en Vercel
```
Solución:
Crear vercel.json en frontend/:

{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}

Luego redeploy.
```

---

## 📱 URLs Finales

Después de deployar, tendrás:

```
Frontend:   https://brandforge-dmente.vercel.app
Backend:    https://brandforge-backend-xxxxx.onrender.com
Database:   postgresql://user:pass@host:5432/brandforge_db
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend corriendo sin errores
- [ ] Frontend carga correctamente
- [ ] Registro funciona
- [ ] Login funciona
- [ ] Assessments completos
- [ ] PDF descarga
- [ ] Dashboard muestra datos
- [ ] Reportes page funciona
- [ ] Logs monitoreados
- [ ] Backups programados
- [ ] Dominio configurado (opcional)
- [ ] Email enviado a marketing

---

## 📞 Soporte Post-Deployment

### Monitoreo Diario
- Revisar logs en Render/Vercel
- Revisar alertas de email
- Probar funcionalidad clave

### Problemas Comunes
- Restart backend: Render Dashboard → "Manual Deploy"
- Clear cache: Vercel → Deployments → Redeploy
- Reset DB: Render → PostgreSQL → Delete & Recreate

---

## 🎉 ¡DEPLOYADO A PRODUCCIÓN!

Una vez completes estos pasos:

1. ✅ Backend en Render
2. ✅ Frontend en Vercel
3. ✅ Database en PostgreSQL
4. ✅ Conectados entre sí
5. ✅ Funcionando en producción

**BrandForge estará VIVO y disponible para usuarios reales.**

---

Made with ❤️ for Personal Branding

No es azar, es propósito. — www.dmentedigital.co
