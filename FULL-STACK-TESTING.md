# 🚀 Full-Stack Testing - BrandForge Módulo 1

**Objetivo:** Testear flujo completo (Frontend ↔ Backend)  
**Tiempo estimado:** 20 minutos  
**Componentes:** Auth + Assessment + Dashboard

---

## 📋 Estructura Completada

```
✅ Backend (Node.js + Express + PostgreSQL)
   ├── Auth endpoints (register, login)
   ├── Assessment endpoints (start, response, submit)
   └── JWT middleware

✅ Frontend (React + Zustand + Tailwind)
   ├── Auth pages (Login, Register)
   ├── Dashboard con progreso
   ├── Assessment flow interactivo
   ├── Resultados visuales (Recharts)
   └── Protected routes
```

---

## 🚀 Paso 1: Iniciar Backend

```bash
cd backend
npm install  # Si es primera vez
npm run dev
```

**Output esperado:**
```
✓ Database connection successful
✓ Database synced
✓ Server running on http://localhost:5000
✓ API endpoints at http://localhost:5000/api
```

---

## 🎨 Paso 2: Iniciar Frontend

**En otra terminal:**

```bash
cd frontend
npm install  # Si es primera vez
npm run dev
```

**Output esperado:**
```
✓ Local: http://localhost:5173/
✓ press q to quit
```

---

## 📱 Paso 3: Testing Completo

### 3.1 Acceder a la aplicación

Abre: **http://localhost:5173**

**Esperado:**
- Redirige automáticamente a `/login`
- Página de login visible

### 3.2 Crear cuenta

1. Haz click en "Regístrate aquí"
2. Completa el formulario:
   ```
   Nombre: Test
   Apellido: User
   Email: test@example.com
   Profesión: Developer
   Contraseña: Test123!@#
   Confirmar: Test123!@#
   ```
3. Haz click en "Crear Cuenta"

**Esperado:**
- ✅ Cuenta creada
- ✅ Redirige a Dashboard
- ✅ Muestra "Test User" en header

### 3.3 Ver Dashboard

**Verifica:**
- ✅ 6 módulos visibles
- ✅ Módulo 1 (Fundamentos) disponible
- ✅ Módulos 2-6 bloqueados
- ✅ Progreso: 0/6 completado
- ✅ Botón "Comenzar ahora" visible

### 3.4 Iniciar Assessment

1. Haz click en Módulo 1 o "Comenzar ahora"

**Esperado:**
- ✅ Página de Assessment carga
- ✅ Pregunta 1/15 visible
- ✅ Opciones seleccionables
- ✅ Barra de progreso: 7%
- ✅ Botón "Siguiente" disponible

### 3.5 Responder Preguntas

1. Selecciona una respuesta en Q1
2. Ajusta slider de confianza si quieres
3. Verifica feedback verde

**Esperado:**
- ✅ Respuesta guardada
- ✅ Feedback: "Respuesta guardada"
- ✅ Avanza a Q2 automáticamente
- ✅ Progreso aumenta

### 3.6 Navegar entre preguntas

1. Haz click en "Anterior"
2. Verifica que vuelve a Q1
3. Haz click en "Siguiente"

**Esperado:**
- ✅ Navegación funciona
- ✅ Respuestas se guardan
- ✅ Respuesta anterior se mantiene seleccionada

### 3.7 Completar Assessment

1. Continúa respondiendo todas las preguntas (o usa script rápido)
2. En Q15, verás botón "Finalizar" en lugar de "Siguiente"
3. Haz click en "Finalizar"

**Script rápido (responder todas):**
```javascript
// En browser console (F12 → Console)
const answers = ['b', 'd', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'b', 'a', 'b', 'a', 'b', 'a'];
for (let i = 0; i < answers.length; i++) {
  const btn = Array.from(document.querySelectorAll('button')).find(b => 
    b.textContent.includes(answers[i]) && b.querySelector('span')?.textContent === answers[i]
  );
  if (btn) btn.click();
}
```

### 3.8 Ver Resultados

**Esperado:**
- ✅ Score: 100 (si respondiste todas correctas)
- ✅ Color verde (Excelente)
- ✅ Insights mostrados
- ✅ Gráfico de categorías (Recharts)
- ✅ Próximos pasos listados
- ✅ Botón "Continuar a Módulo Siguiente"

### 3.9 Volver al Dashboard

1. Haz click en "Continuar a Módulo Siguiente"

**Esperado:**
- ✅ Regresa a Dashboard
- ✅ Módulo 1 muestra "✓ Completado"
- ✅ Score 100 visible en tarjeta
- ✅ Módulo 2 ya está disponible (desbloqueado)
- ✅ Progreso: 1/6 completado (16%)

### 3.10 Logout

1. Haz click en "Salir"

**Esperado:**
- ✅ Token eliminado
- ✅ Redirige a login
- ✅ Formulario limpio

---

## 🔍 Verificar Base de Datos

### Conectar a PostgreSQL

```bash
psql -U postgres -d brandforge_db
```

### Queries de verificación

```sql
-- Ver usuarios
SELECT id, email, "firstName", "lastName", "subscriptionPlan" FROM users;

-- Ver assessments
SELECT id, "userId", "moduleId", status, score FROM assessments;

-- Ver respuestas
SELECT id, "assessmentId", "questionId", "selectedAnswer", "isCorrect" 
FROM assessment_responses LIMIT 10;

-- Ver progreso de usuario
SELECT 
  u.email,
  COUNT(DISTINCT a.id) as total_assessments,
  COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed
FROM users u
LEFT JOIN assessments a ON u.id = a."userId"
GROUP BY u.id, u.email;
```

---

## 🧪 Casos de Prueba Adicionales

### Test A: Múltiples usuarios

1. Register User 2: test2@example.com
2. Completa assessment
3. Logout
4. Login con User 1
5. Verifica que datos son independientes

**Esperado:**
- ✅ Cada usuario tiene sus propios datos
- ✅ No hay mezcla de información

### Test B: Cierre y apertura de sesión

1. Completa 5 preguntas
2. Cierra navegador (dev tools → Logout no necesario)
3. Abre de nuevo http://localhost:5173
4. ¿Qué sucede?

**Esperado:**
- ✅ Si token está en localStorage, va al dashboard
- ✅ Si token expiró, redirige a login

### Test C: Error handling

1. Apaga backend (Ctrl+C)
2. Intenta hacer una acción en frontend
3. ¿Qué error muestra?

**Esperado:**
- ✅ Mensaje de error claro
- ✅ Interfaz no se quiebra
- ✅ Opción de reintentar

---

## 📊 Checklist de Testing

- [ ] Backend inicia correctamente
- [ ] Frontend inicia correctamente
- [ ] Página de login visible
- [ ] Registro funciona
- [ ] Token se guarda en localStorage
- [ ] Dashboard muestra 6 módulos
- [ ] Módulo 1 se abre sin errores
- [ ] 15 preguntas cargan
- [ ] Seleccionar respuesta funciona
- [ ] Progreso se actualiza
- [ ] Navegar anterior/siguiente funciona
- [ ] Assessment completo calcula score
- [ ] Resultados se muestran correctamente
- [ ] Módulo 2 se desbloquea
- [ ] Logout funciona
- [ ] Datos se guardan en BD

---

## 🐛 Troubleshooting

### Error: Cannot connect to backend

```
✓ Backend debe estar corriendo (npm run dev)
✓ Puerto 5000 no bloqueado
✓ VITE_API_URL correcto en .env.local
```

### Error: Cannot register user

```
✓ Email no debe estar registrado
✓ Contraseña mínimo 6 caracteres
✓ BD debe estar sincronizada (migrations)
```

### Error: Cannot start assessment

```
✓ Debe estar autenticado
✓ Token no expirado
✓ questionnaire.json debe existir
```

### UI se ve distorsionada

```
✓ Tailwind CSS debe compilar: npm run dev (reinicia)
✓ Limpiar cache: Ctrl+Shift+R (hard refresh)
✓ Borrar node_modules y reinstalar si es necesario
```

### Quiz no funciona después de refreshear

```
✓ Estado de Zustand se pierde en refresh
✓ Solución: Guardar assessment state en localStorage (próxima mejora)
```

---

## 📈 Métricas de Testing

| Métrica | Esperado | Resultado |
|---------|----------|-----------|
| Tiempo login | < 2 seg | ✓ |
| Tiempo cargar assessment | < 3 seg | ✓ |
| Tiempo guardar respuesta | < 500ms | ✓ |
| Score calculation | Instantáneo | ✓ |
| API latency | < 1 seg | ✓ |

---

## 🚀 Performance Checks

```javascript
// En browser console (F12)

// Performance API
performance.mark('start');
// ... realizar acción ...
performance.mark('end');
performance.measure('action', 'start', 'end');
console.log(performance.getEntriesByName('action')[0].duration);

// Network tab (F12 → Network)
// Verificar:
// - GET /api/assessment/questions: < 100ms
// - POST /api/assessment/start: < 200ms
// - POST /api/assessment/:id/response: < 300ms
```

---

## 📝 Notas Finales

### Cosas que funcionan:
✅ Autenticación completa  
✅ Assessment interactivo  
✅ Cálculo de scores  
✅ Persistencia en BD  
✅ Dashboard con progreso  
✅ Gráficos (Recharts)  

### Próximas mejoras:
- [ ] Guardar assessment state en localStorage
- [ ] Refresh token automático
- [ ] Más validaciones frontend
- [ ] Animaciones de transición
- [ ] Módulos 2-6
- [ ] Generación de PDF
- [ ] Analytics

---

## 🎉 ¿Todo funciona?

Si todos los checks pasan, **¡Módulo 1 está completamente funcional!** 🎯

Próximo paso: **Módulos 2-6 y Generador de Reportes**

---

Made with ❤️ for Personal Branding  
No es azar, es propósito. — www.dmentedigital.co
