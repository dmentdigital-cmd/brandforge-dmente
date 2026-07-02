# 🚀 BRANDFORGE - SETUP LOCAL (AHORA MISMO)

---

## 📋 Lo que tienes

```
POSGRES/          ← PostgreSQL descargado aquí
backend/          ← Código del backend
frontend/         ← Código del frontend
```

---

## 🎯 PASO 1: Inicializar PostgreSQL

### Si PostgreSQL es PORTABLE (archivo .zip descomprimido):

1. **Abre CMD / PowerShell**
2. **Ve a la carpeta POSGRES:**
   ```bash
   cd "C:\Users\diego\Documents\DIEGOSAN\PROYECTO D MENTE DIGITAL\DESARROLLO DE MARCA PERSONAL\BRANDFORGE-DMENTE\brandforge-dmente\POSGRES"
   ```

3. **Inicializa la base de datos (SOLO UNA VEZ):**
   ```bash
   bin\initdb -D data
   ```

4. **Inicia PostgreSQL:**
   ```bash
   bin\pg_ctl -D data -l logfile.txt start
   ```

5. **Verifica que funciona:**
   ```bash
   bin\psql -U postgres
   ```
   
   Si ves `postgres=#` → ✓ Funciona

6. **Crea la base de datos:**
   ```sql
   CREATE DATABASE brandforge_db;
   \q
   ```

---

## 🎯 PASO 2: Backend

**Abre OTRA terminal CMD/PowerShell:**

```bash
cd "C:\Users\diego\Documents\DIEGOSAN\PROYECTO D MENTE DIGITAL\DESARROLLO DE MARCA PERSONAL\BRANDFORGE-DMENTE\brandforge-dmente\backend"

npm install

npm start
```

**Deberías ver:**
```
✓ Server running on http://localhost:5000
✓ Database connected
```

---

## 🎯 PASO 3: Frontend

**Abre OTRA terminal CMD/PowerShell:**

```bash
cd "C:\Users\diego\Documents\DIEGOSAN\PROYECTO D MENTE DIGITAL\DESARROLLO DE MARCA PERSONAL\BRANDFORGE-DMENTE\brandforge-dmente\frontend"

npm install

npm run dev
```

**Deberías ver:**
```
Local:   http://localhost:5173
```

---

## 🎯 PASO 4: PROBAR

1. **Abre navegador:**
   ```
   http://localhost:5173
   ```

2. **Deberías ver:** BrandForge cargando ✓

3. **Prueba registrarte:**
   - Email: `test@example.com`
   - Password: `Test123!`

4. **Completa Módulo 1** y **descarga PDF**

---

## 📝 Credenciales PostgreSQL

```
Host:     localhost
Port:     5432
Database: brandforge_db
User:     postgres
Password: postgres (default)
```

---

## 🆘 Errores comunes

### "PostgreSQL no inicia"
→ Verifica que `POSGRES\bin\pg_ctl.exe` existe  
→ Intenta: `bin\pg_ctl -D data status`

### "Database connection failed"
→ Verifica que PostgreSQL está corriendo  
→ Verifica que `brandforge_db` existe  
→ En psql: `\l` (lista bases de datos)

### "Port 5173 already in use"
→ Cambia en `frontend/vite.config.js` a otro puerto (5174)

### "npm ERR! ERESOLVE unable to resolve dependency tree"
→ Ejecuta: `npm install --legacy-peer-deps`

---

## 💡 Quick Start (después de la primera vez)

Terminal 1:
```bash
cd POSGRES && bin\pg_ctl -D data start
```

Terminal 2:
```bash
cd backend && npm start
```

Terminal 3:
```bash
cd frontend && npm run dev
```

Abre: `http://localhost:5173`

---

**Made with ❤️ for Personal Branding**

No es azar, es propósito.
