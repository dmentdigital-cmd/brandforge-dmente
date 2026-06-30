# ⚡ DEPLOYMENT QUICK START - 30 minutos

## 🎯 Resumen Rápido

```
Backend → Render.com       (Gratis)
Frontend → Vercel.com      (Gratis)
Database → Render PostgreSQL (Gratis)
Domain → Dmente Digital    (Opcional)
```

---

## 📋 Step-by-Step Rápido

### PASO 1: Database (5 min)

```bash
# Ir a: https://render.com
# 1. Sign up con GitHub
# 2. New → PostgreSQL
# 3. Name: brandforge-db
# 4. Free plan
# 5. Copy connection string
```

**Copiar esto:**
```
postgresql://user:password@host:5432/database
```

### PASO 2: Backend (10 min)

```bash
# En render.com:
# 1. New → Web Service
# 2. Connect tu repo de GitHub
# 3. Name: brandforge-backend
# 4. Build: cd backend && npm install
# 5. Start: cd backend && npm start

# Agregar estas variables:
DB_HOST=<del paso 1>
DB_PORT=5432
DB_NAME=brandforge_db
DB_USER=<tu user>
DB_PASSWORD=<tu password>
JWT_SECRET=<genera-una-clave-aleatoria>
NODE_ENV=production
FRONTEND_URL=https://brandforge.vercel.app
```

**Generar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Copiar URL del backend:**
```
https://brandforge-backend-xxxxx.onrender.com
```

### PASO 3: Frontend (10 min)

```bash
# Ir a: https://vercel.com
# 1. Sign up con GitHub
# 2. Add New Project
# 3. Importa: brandforge-dmente
# 4. Root Directory: frontend
# 5. Agregar Environment Variable:

VITE_API_URL=https://brandforge-backend-xxxxx.onrender.com
```

**Esperar deploy y copiar URL:**
```
https://brandforge-dmente.vercel.app
```

### PASO 4: Conectar Todo (5 min)

```bash
# En Vercel:
# 1. Settings → Environment Variables
# 2. Cambiar VITE_API_URL a tu backend URL
# 3. Redeploy

# En Render backend:
# 1. Settings → Environment Variables
# 2. Agregar: FRONTEND_URL=tu-vercel-url
# 3. Redeploy (Manual Deploy)
```

---

## ✅ Test Rápido

```bash
# 1. Ir a: https://brandforge-dmente.vercel.app
# 2. Registrarse
# 3. Completar Módulo 1
# 4. Descargar PDF
# 5. Done!
```

---

## 📱 URLs Finales

```
Frontend:  https://brandforge-dmente.vercel.app
Backend:   https://brandforge-backend-xxxxx.onrender.com
```

---

## 🔑 Important - Environment Variables

### Backend (.env en producción)
```
NODE_ENV=production
DB_HOST=<from Render>
DB_PORT=5432
DB_NAME=brandforge_db
DB_USER=<your user>
DB_PASSWORD=<your password>
JWT_SECRET=<very-long-random-string>
FRONTEND_URL=https://brandforge-dmente.vercel.app
```

### Frontend (.env en producción)
```
VITE_API_URL=https://brandforge-backend-xxxxx.onrender.com
VITE_ENVIRONMENT=production
```

---

## 🐛 Si Algo Falla

```
API Error?
→ Check Render logs
→ Verify DB connection
→ Restart backend

Frontend 404?
→ Check VITE_API_URL
→ Redeploy Vercel

Database Error?
→ Verify password is correct
→ Check firewall in Render
```

---

## 💡 Pro Tips

1. **Guardar todas las URLs** en un documento
2. **Backup your database** weekly
3. **Monitor logs** en Render dashboard
4. **Test login workflow** después de deploy
5. **Update DNS** si usas dominio personalizado

---

## ⏱️ Timeline

```
Database Setup:    5 min
Backend Deploy:    10 min
Frontend Deploy:   10 min  
Connection:        5 min
Testing:           5 min
─────────────────
TOTAL:             30-35 min
```

---

## 🎉 Después del Deploy

✅ Backend en Render  
✅ Frontend en Vercel  
✅ Database configurada  
✅ Conectados y funcionando  

**BrandForge está VIVO en producción.** 🚀

---

Made with ❤️ by Dmente Digital

No es azar, es propósito.
