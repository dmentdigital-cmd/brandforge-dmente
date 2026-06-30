# 🔧 BrandForge Development Roadmap

**Última actualización:** 2026-06-30  
**Status:** Infraestructura de autenticación completada ✓

---

## 📊 Progreso General

| Fase | Tarea | Status | Prioridad |
|------|-------|--------|-----------|
| 1 | Especificación SDD | ✅ Completada | Alta |
| 1 | Base de datos + Sequelize | ✅ Completada | Alta |
| 1 | Autenticación JWT | ✅ Completada | Alta |
| 2 | Módulo 1 Backend (Fundamentos) | ⏳ En progreso | Alta |
| 2 | Módulo 1 Frontend (Componentes) | ⏳ Pendiente | Alta |
| 3 | Generador PDF + Dashboard | ⏳ Pendiente | Media |
| 3 | Módulos 2-6 Backend | ⏳ Pendiente | Media |
| 3 | Módulos 2-6 Frontend | ⏳ Pendiente | Media |
| 4 | Testing E2E | ⏳ Pendiente | Media |
| 4 | CI/CD (GitHub Actions) | ⏳ Pendiente | Baja |
| 5 | Deployment (Vercel + Render) | ⏳ Pendiente | Baja |

---

## 🎯 Task 5: Implementar Módulo 1 Backend (Fundamentos)

### Objetivo
Crear la infraestructura backend para el módulo de Fundamentos que incluye:
- Assessment Controller con validación de preguntas
- Lógica de puntuación
- Almacenamiento de respuestas
- Generación de análisis inicial

### Archivos a Crear

```
backend/
├── src/
│   ├── controllers/
│   │   ├── assessmentController.js      [NEW]
│   │   └── fundamentalsController.js    [NEW]
│   ├── models/
│   │   ├── Assessment.js                [NEW]
│   │   ├── AssessmentResponse.js        [NEW]
│   │   └── UserProfile.js               [NEW]
│   ├── services/
│   │   └── assessmentService.js         [NEW]
│   └── routes/
│       └── assessmentRoutes.js          [NEW]
└── data/
    └── questionnaire.json               [NEW - Preguntas del módulo]
```

### Endpoints a Implementar

#### 1. Iniciar Assessment
```
POST /api/assessment/start
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "moduleId": "fundamentals"
}

Response:
{
  "assessmentId": "uuid",
  "moduleId": "fundamentals",
  "questionCount": 15,
  "questions": [...]
}
```

#### 2. Guardar Respuesta
```
POST /api/assessment/:assessmentId/response
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "questionId": "q1",
  "answer": "selected_option",
  "confidence": 0.8
}

Response:
{
  "success": true,
  "questionIndex": 1,
  "totalQuestions": 15
}
```

#### 3. Completar Assessment
```
POST /api/assessment/:assessmentId/submit
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "moduleId": "fundamentals"
}

Response:
{
  "assessmentId": "uuid",
  "score": 78,
  "analysis": {...},
  "nextSteps": [...]
}
```

#### 4. Obtener Progreso
```
GET /api/assessment/progress
Authorization: Bearer {token}

Response:
{
  "modules": [
    {
      "moduleId": "fundamentals",
      "status": "completed",
      "score": 78,
      "completedAt": "2026-06-30T10:30:00Z"
    },
    ...
  ]
}
```

### Base de Datos - Modelos

#### Assessment
```javascript
{
  id: UUID,
  userId: UUID,
  moduleId: string,
  startedAt: Date,
  completedAt: Date,
  score: number,
  status: 'in_progress' | 'completed' | 'abandoned',
  analysis: JSON, // Análisis de respuestas
  createdAt: Date,
  updatedAt: Date
}
```

#### AssessmentResponse
```javascript
{
  id: UUID,
  assessmentId: UUID,
  questionId: string,
  selectedAnswer: string,
  confidence: number,
  createdAt: Date
}
```

#### UserProfile (extender User model)
```javascript
{
  userId: UUID,
  profession: string,
  industry: string,
  yearsExperience: number,
  currentBrandScore: number,
  desiredOutcome: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Lógica de Puntuación (Fundamentos)

Las preguntas del Módulo 1 evalúan:

1. **Autoconocimiento** (5 preguntas)
   - Qué hace único
   - Fortalezas principales
   - Diferenciadores
   - Experiencias clave
   - Valores personales

2. **Análisis de Mercado** (4 preguntas)
   - Nicho actual
   - Competencia percibida
   - Demanda en su área
   - Tendencias relevantes

3. **Presencia Online** (3 preguntas)
   - Plataformas activas
   - Engagement actual
   - Reconocimiento online
   
4. **Objetivos** (3 preguntas)
   - Meta de 12 meses
   - Prioritarios de negocio
   - Impacto deseado

**Fórmula de Puntuación:**
```
Puntuación = (Respuestas correctas / Total) * 100
Niveles:
- 0-30: Muy bajo (Necesita definición clara)
- 31-60: Bajo (Tiene base pero sin claridad)
- 61-75: Medio (Tiene dirección, falta ajustes)
- 76-90: Alto (Bien posicionado)
- 91-100: Excelente (Marca clara y diferenciada)
```

### Datos de Prueba

Crear archivo `backend/data/questionnaire.json` con estructura:

```json
{
  "fundamentals": {
    "title": "Módulo 1: Fundamentos de Marca Personal",
    "description": "Autoconocimiento y análisis",
    "questions": [
      {
        "id": "q1",
        "type": "single_choice",
        "question": "¿Qué te hace único en tu profesión?",
        "options": [
          {"id": "a", "text": "Mi experiencia"},
          {"id": "b", "text": "Mi enfoque diferente"},
          {"id": "c", "text": "Mis conexiones"},
          {"id": "d", "text": "No estoy seguro"}
        ],
        "correctAnswer": "b",
        "weight": 1,
        "category": "autoconocimiento"
      },
      ...
    ]
  }
}
```

### Validaciones Requeridas

- ✓ Usuario autenticado (JWT)
- ✓ Assessment existe y pertenece al usuario
- ✓ Pregunta ID existe en cuestionario
- ✓ Respuesta es opción válida
- ✓ Assessment no completado previamente
- ✓ Todos los campos requeridos presentes

### Testing

Tests unitarios a crear:
- `assessmentController.test.js`
- `assessmentService.test.js`
- Cobertura: Endpoints, validación, puntuación

---

## 🎨 Task 6: Implementar Módulo 1 Frontend (Componentes)

### Objetivo
Crear componentes React para el flujo de assessment del Módulo 1

### Componentes Principales

```
frontend/src/components/
├── Assessment/
│   ├── AssessmentFlow.jsx           [NEW - Contenedor principal]
│   ├── QuestionCard.jsx             [NEW - Tarjeta de pregunta]
│   ├── AnswerOption.jsx             [NEW - Opción de respuesta]
│   ├── ProgressBar.jsx              [NEW - Barra de progreso]
│   └── ResultsSummary.jsx           [NEW - Resumen de resultados]
├── Auth/
│   ├── LoginForm.jsx                [NEW]
│   ├── RegisterForm.jsx             [NEW]
│   └── ProtectedRoute.jsx           [NEW]
└── Layout/
    ├── Navbar.jsx                   [NEW]
    └── Sidebar.jsx                  [NEW]
```

### Páginas Principales

```
frontend/src/pages/
├── Home.jsx                         [NEW - Landing]
├── Login.jsx                        [NEW]
├── Register.jsx                     [NEW]
├── Dashboard.jsx                    [NEW - Panel de usuario]
├── Assessment.jsx                   [NEW - Assessment flow]
└── Report.jsx                       [NEW - Reporte de resultados]
```

### Flujo de Interfaz

```
Login/Register
    ↓
Dashboard (Bienvenida)
    ↓
Start Assessment (Módulo 1)
    ↓
Quiz Loop (15 preguntas)
    - Pregunta + opciones
    - Indicador de progreso
    - Botón siguiente
    ↓
Resultados (Score + análisis)
    ↓
Plan de Acción (Siguientes pasos)
```

### Estado (Zustand Store)

```javascript
// assessmentStore.js
{
  // Assessment
  currentAssessment: {...},
  currentQuestion: 0,
  answers: {},
  score: null,
  
  // Actions
  startAssessment: async (moduleId) => {...},
  submitAnswer: async (questionId, answer) => {...},
  finishAssessment: async () => {...},
  resetAssessment: () => {...}
}
```

### Estilos (Tailwind)

- Paleta Dmente Digital (según brand guidelines)
- Responsive design (mobile-first)
- Dark mode por defecto
- Animaciones suaves

---

## 📈 Próximas Fases

### Task 9: Generador de Reportes PDF y Dashboard
- Genera PDF con resultados del assessment
- Dashboard con visualizaciones
- Recharts para gráficos
- PDFKit para generación

### Task 10: Módulos 2-6
- Estrategia (Nicho + UVP)
- Identidad Visual
- Plataformas
- Narrativa
- Monetización

### Task 11: Testing & Deployment
- Jest para unit tests
- Cypress para E2E
- GitHub Actions para CI/CD
- Vercel (frontend) + Render (backend)

---

## 📌 Checklist de Implementación

### Backend (Módulo 1)
- [ ] Crear Assessment model
- [ ] Crear AssessmentResponse model
- [ ] Crear questionnaire.json con preguntas
- [ ] Implementar assessmentController
- [ ] Implementar assessmentService
- [ ] Crear assessmentRoutes
- [ ] Registrar rutas en index.js
- [ ] Agregar tests
- [ ] Validar con Postman/curl

### Frontend (Módulo 1)
- [ ] Crear AssessmentFlow.jsx
- [ ] Crear QuestionCard.jsx
- [ ] Crear AssessmentStore (Zustand)
- [ ] Conectar con API backend
- [ ] Crear páginas (Assessment, Results)
- [ ] Agregar rutas en React Router
- [ ] Estilos Tailwind
- [ ] Testing con Vitest

---

## 🚀 Comandos Rápidos

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev

# Tests Backend
cd backend
npm test

# Build Frontend
cd frontend
npm run build
```

---

## 📞 Contacto

**Preguntas o dudas:** dmentdigital@gmail.com

No es azar, es propósito. — www.dmentedigital.co
