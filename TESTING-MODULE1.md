# 🧪 Testing Módulo 1 Backend - Guía Completa

**Objetivo:** Testear todos los endpoints del Módulo 1 (Fundamentos)  
**Herramienta recomendada:** Postman o curl en terminal  
**Tiempo estimado:** 15 minutos

---

## 📋 Endpoints Disponibles

```
GET    /api/assessment/questions/:moduleId
POST   /api/assessment/start
POST   /api/assessment/:assessmentId/response
POST   /api/assessment/:assessmentId/submit
GET    /api/assessment/progress
GET    /api/assessment/:assessmentId
```

---

## 🚀 Paso 1: Registrarse y Obtener Token

### 1.1 Registrar usuario

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User",
    "profession": "Developer"
  }'
```

**Respuesta esperada:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-aqui",
    "email": "testuser@example.com",
    "firstName": "Test",
    "lastName": "User"
  },
  "token": "eyJ..."
}
```

### 1.2 Guardar el token

```bash
# Linux/Mac
TOKEN="eyJ..."

# Windows (PowerShell)
$TOKEN = "eyJ..."
```

---

## 🎯 Paso 2: Obtener Preguntas

### 2.1 Sin autenticación (público)

```bash
curl -X GET http://localhost:5000/api/assessment/questions/fundamentals
```

**Respuesta esperada:**
```json
{
  "moduleId": "fundamentals",
  "title": "Módulo 1: Fundamentos de Marca Personal",
  "description": "Autodiagnóstico de tu marca personal",
  "icon": "🎯",
  "estimatedTime": 10,
  "questionCount": 15,
  "questions": [
    {
      "id": "q1",
      "number": 1,
      "type": "single_choice",
      "question": "¿Cuál es tu principal diferenciador...",
      "description": "Lo que te hace único",
      "options": [
        {"id": "a", "text": "Mi experiencia..."},
        {"id": "b", "text": "Mi enfoque..."},
        ...
      ]
    },
    ...
  ]
}
```

---

## 📝 Paso 3: Iniciar Assessment

### 3.1 POST /api/assessment/start

```bash
curl -X POST http://localhost:5000/api/assessment/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "moduleId": "fundamentals"
  }'
```

**Respuesta esperada:**
```json
{
  "message": "Assessment started successfully",
  "assessmentId": "assessment-uuid-aqui",
  "moduleId": "fundamentals",
  "title": "Módulo 1: Fundamentos de Marca Personal",
  "description": "Autodiagnóstico de tu marca personal",
  "icon": "🎯",
  "estimatedTime": 10,
  "questionCount": 15,
  "questions": [...]
}
```

### 3.2 Guardar el assessmentId

```bash
ASSESSMENT_ID="assessment-uuid-aqui"
```

---

## ✅ Paso 4: Responder Preguntas

### 4.1 POST /api/assessment/:assessmentId/response

**Pregunta 1 - Respuesta correcta (b):**

```bash
curl -X POST http://localhost:5000/api/assessment/$ASSESSMENT_ID/response \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "questionId": "q1",
    "selectedAnswer": "b",
    "confidence": 0.9
  }'
```

**Respuesta esperada:**
```json
{
  "message": "Response saved successfully",
  "success": true,
  "questionIndex": 1,
  "totalQuestions": 15,
  "progress": 7
}
```

---

## 🔄 Paso 5: Responder Todas las Preguntas

Responde las 15 preguntas. Script para completar rápidamente:

```bash
# Script bash para responder todas (respuestas correctas)
ANSWERS=(
  "q1:b"
  "q2:d"
  "q3:a"
  "q4:a"
  "q5:a"
  "q6:a"
  "q7:a"
  "q8:a"
  "q9:a"
  "q10:b"
  "q11:a"
  "q12:b"
  "q13:a"
  "q14:b"
  "q15:a"
)

for answer in "${ANSWERS[@]}"; do
  IFS=':' read -r qid ans <<< "$answer"
  curl -X POST http://localhost:5000/api/assessment/$ASSESSMENT_ID/response \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"questionId\": \"$qid\", \"selectedAnswer\": \"$ans\", \"confidence\": 0.85}"
  echo "Answered $qid"
done
```

O manualmente con Postman (más fácil):

1. Abre Postman
2. Nueva request POST
3. URL: `http://localhost:5000/api/assessment/{ASSESSMENT_ID}/response`
4. Auth: Bearer Token
5. Body (JSON):
```json
{
  "questionId": "q1",
  "selectedAnswer": "b",
  "confidence": 0.9
}
```
6. Repite para cada pregunta

---

## 🏁 Paso 6: Completar Assessment

### 6.1 POST /api/assessment/:assessmentId/submit

```bash
curl -X POST http://localhost:5000/api/assessment/$ASSESSMENT_ID/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}'
```

**Respuesta esperada:**
```json
{
  "message": "Assessment completed successfully",
  "assessmentId": "assessment-uuid",
  "moduleId": "fundamentals",
  "score": 93,
  "scoreLevel": "excellent",
  "correctAnswers": 14,
  "totalQuestions": 15,
  "completedAt": "2026-06-30T10:30:00Z",
  "analysis": {
    "overallScore": 93,
    "scoreLevel": "excellent",
    "timestamp": "2026-06-30T10:30:00Z",
    "categoryScores": {
      "autoconocimiento": 100,
      "mercado": 83,
      "presencia": 83,
      "objetivos": 100
    },
    "insights": [
      "Tu marca personal está bien definida y diferenciada.",
      "Tienes claridad en tu posicionamiento y valores."
    ],
    "nextSteps": [
      {
        "priority": 1,
        "title": "Módulo 2: Estrategia",
        "description": "Define tu nicho y propuesta de valor",
        "action": "Continuar con estrategia"
      }
    ]
  }
}
```

---

## 📊 Paso 7: Ver Progreso

### 7.1 GET /api/assessment/progress

```bash
curl -X GET http://localhost:5000/api/assessment/progress \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta esperada:**
```json
{
  "userId": "user-uuid",
  "assessments": [
    {
      "assessmentId": "assessment-uuid",
      "moduleId": "fundamentals",
      "status": "completed",
      "score": 93,
      "startedAt": "2026-06-30T10:15:00Z",
      "completedAt": "2026-06-30T10:30:00Z"
    }
  ],
  "completedModules": 1,
  "totalAssessments": 1
}
```

---

## 📋 Paso 8: Ver Detalles del Assessment

### 8.1 GET /api/assessment/:assessmentId

```bash
curl -X GET http://localhost:5000/api/assessment/$ASSESSMENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta esperada:**
```json
{
  "assessment": {
    "id": "assessment-uuid",
    "moduleId": "fundamentals",
    "status": "completed",
    "score": 93,
    "analysis": {...},
    "startedAt": "2026-06-30T10:15:00Z",
    "completedAt": "2026-06-30T10:30:00Z",
    "responses": [
      {
        "id": "response-uuid",
        "questionId": "q1",
        "selectedAnswer": "b",
        "isCorrect": true
      },
      ...
    ]
  }
}
```

---

## 🧪 Casos de Prueba Adicionales

### Test 1: Error - Assessment no existe
```bash
curl -X POST http://localhost:5000/api/assessment/invalid-id/response \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "questionId": "q1",
    "selectedAnswer": "a"
  }'

# Esperado: 404 - "Assessment not found"
```

### Test 2: Error - Respuesta inválida
```bash
curl -X POST http://localhost:5000/api/assessment/$ASSESSMENT_ID/response \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "questionId": "q1",
    "selectedAnswer": "z"
  }'

# Esperado: 400 - "Invalid answer option"
```

### Test 3: Error - Sin autenticación
```bash
curl -X POST http://localhost:5000/api/assessment/start \
  -H "Content-Type: application/json" \
  -d '{
    "moduleId": "fundamentals"
  }'

# Esperado: 401 - "No token provided"
```

### Test 4: Respuestas incorrectas
```bash
# Completar assessment con respuestas incorrectas

ANSWERS_WRONG=(
  "q1:a"
  "q2:a"
  "q3:b"
  "q4:d"
  "q5:c"
  "q6:c"
  "q7:b"
  "q8:c"
  "q9:d"
  "q10:a"
  "q11:b"
  "q12:a"
  "q13:b"
  "q14:a"
  "q15:b"
)

# Esperar score bajo (~30)
```

---

## 🔍 Verificar Base de Datos

### Conectar a PostgreSQL

```bash
psql -U postgres -d brandforge_db
```

### Ver tablas creadas

```sql
-- Ver estructura de assessments
\d assessments

-- Ver estructura de assessment_responses
\d assessment_responses

-- Ver registros
SELECT * FROM assessments;
SELECT * FROM assessment_responses;
```

---

## 📱 Testear con Postman

### 1. Importar Collection

Crear nueva Postman Collection:

**Auth - Register**
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "email": "test@example.com",
  "password": "Test123",
  "firstName": "Test",
  "lastName": "User",
  "profession": "Developer"
}
```

**Assessment - Get Questions**
```
GET http://localhost:5000/api/assessment/questions/fundamentals
```

**Assessment - Start**
```
POST http://localhost:5000/api/assessment/start
Auth: Bearer Token
Body (JSON):
{
  "moduleId": "fundamentals"
}
```

**Assessment - Submit Response**
```
POST http://localhost:5000/api/assessment/{{assessmentId}}/response
Auth: Bearer Token
Body (JSON):
{
  "questionId": "q1",
  "selectedAnswer": "b",
  "confidence": 0.9
}
```

**Assessment - Complete**
```
POST http://localhost:5000/api/assessment/{{assessmentId}}/submit
Auth: Bearer Token
```

**Assessment - Progress**
```
GET http://localhost:5000/api/assessment/progress
Auth: Bearer Token
```

---

## 📊 Puntuaciones Esperadas

| Respuestas Correctas | Score | Nivel |
|---------------------|-------|-------|
| 15/15 | 100 | Excellent |
| 14/15 | 93 | Excellent |
| 12/15 | 80 | High |
| 10/15 | 67 | Medium |
| 5/15 | 33 | Low |
| 0/15 | 0 | Very Low |

---

## ✅ Checklist Final

- [ ] Backend corriendo en puerto 5000
- [ ] PostgreSQL corriendo
- [ ] Usuario registrado
- [ ] Token JWT obtenido
- [ ] Assessment iniciado
- [ ] 15 preguntas respondidas
- [ ] Assessment completado
- [ ] Score calculado correctamente
- [ ] Progreso visible
- [ ] Detalles del assessment accesibles
- [ ] BD tiene registros correctos

---

## 🚀 Próximos Pasos

Una vez completado el testing del backend:

1. ✅ Módulo 1 Backend completado
2. ⏳ **Implementar Módulo 1 Frontend** (React components)
3. ⏳ Integración Frontend ↔ Backend
4. ⏳ Testing E2E

---

## 📞 Troubleshooting

**Error: "Cannot connect to database"**
```bash
# Verifica que PostgreSQL está corriendo
psql -U postgres -c "SELECT version();"
```

**Error: "Module not found"**
```bash
# Verifica que el archivo questionnaire.json existe
ls backend/data/questionnaire.json
```

**Error: "Assessment not found"**
```bash
# El assessmentId es incorrecto o no existe
# Verifica en la BD:
SELECT * FROM assessments;
```

---

Made with ❤️ for Personal Branding  
No es azar, es propósito. — www.dmentedigital.co
