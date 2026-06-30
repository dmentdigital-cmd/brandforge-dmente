# 📚 Backend Data - Estructura de Datos

Este directorio contiene los archivos JSON con preguntas y contenido de cada módulo de BrandForge.

---

## 📋 Archivos

### questionnaire.json
Contiene todas las preguntas de los 6 módulos de BrandForge.

**Estructura:**
```json
{
  "fundamentals": {
    "title": "Módulo 1: Fundamentos de Marca Personal",
    "description": "...",
    "icon": "🎯",
    "estimatedTime": 10,
    "questions": [...]
  },
  "strategy": { ... },
  "identity": { ... },
  "platforms": { ... },
  "narrative": { ... },
  "monetization": { ... }
}
```

---

## 🎯 Estructura de Módulo

```json
{
  "moduleId": {
    "title": "Nombre del Módulo",
    "description": "Descripción breve",
    "icon": "emoji",
    "estimatedTime": 15,
    "questions": [
      {
        "id": "q1",
        "type": "single_choice",
        "number": 1,
        "question": "¿Pregunta principal?",
        "description": "Contexto o instrucción",
        "options": [
          {
            "id": "a",
            "text": "Opción A"
          },
          {
            "id": "b",
            "text": "Opción B"
          }
        ],
        "correctAnswer": "a",
        "weight": 1,
        "category": "categoría"
      }
    ]
  }
}
```

---

## 📝 Campos Explicados

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | string | ✓ | ID único de pregunta (q1, q2, etc.) |
| `type` | string | ✓ | Tipo de pregunta (single_choice, multi_choice, text) |
| `number` | number | ✓ | Número secuencial (1, 2, 3...) |
| `question` | string | ✓ | Texto de la pregunta |
| `description` | string | | Contexto o ayuda |
| `options` | array | ✓ | Lista de opciones |
| `correctAnswer` | string | ✓ | ID de respuesta correcta |
| `weight` | number | | Peso para puntuación (default: 1) |
| `category` | string | | Categoría para análisis |

---

## 🔧 Cómo Agregar Una Nueva Pregunta

### 1. Editar questionnaire.json

```json
{
  "fundamentals": {
    "questions": [
      // ... preguntas existentes ...
      {
        "id": "q16",
        "type": "single_choice",
        "number": 16,
        "question": "Tu nueva pregunta aquí?",
        "description": "Descripción o contexto",
        "options": [
          {
            "id": "a",
            "text": "Opción 1"
          },
          {
            "id": "b",
            "text": "Opción 2"
          },
          {
            "id": "c",
            "text": "Opción 3"
          },
          {
            "id": "d",
            "text": "Opción 4"
          }
        ],
        "correctAnswer": "b",
        "weight": 1,
        "category": "autoconocimiento"
      }
    ]
  }
}
```

### 2. Actualizar totalQuestions

Si agregaste preguntas, actualiza:
- `estimatedTime` (si es necesario)
- Asegúrate que en `assessmentService.js` se use `totalQuestions: module.questions.length`

### 3. Testear

```bash
# Verifica que no hay errores de sintaxis JSON
npm run dev

# Prueba el endpoint
curl http://localhost:5000/api/assessment/questions/fundamentals | jq
```

---

## 📊 Tipos de Preguntas Soportadas

### single_choice (Múltiple opción - una respuesta)
```json
{
  "type": "single_choice",
  "options": [
    {"id": "a", "text": "Opción A"},
    {"id": "b", "text": "Opción B"},
    {"id": "c", "text": "Opción C"},
    {"id": "d", "text": "Opción D"}
  ],
  "correctAnswer": "a"
}
```

### multi_choice (Múltiples opciones - varias respuestas)
```json
{
  "type": "multi_choice",
  "options": [
    {"id": "a", "text": "Opción A"},
    {"id": "b", "text": "Opción B"},
    {"id": "c", "text": "Opción C"}
  ],
  "correctAnswers": ["a", "c"]
}
```

### text (Respuesta de texto libre)
```json
{
  "type": "text",
  "placeholder": "Escribe tu respuesta aquí",
  "maxLength": 500
}
```

---

## 🎓 Catálogos de Categorías

### Módulo 1 (Fundamentals)
- `autoconocimiento` - Sobre sí mismo
- `mercado` - Análisis de mercado
- `presencia` - Presencia online
- `objetivos` - Metas y propósito

### Módulo 2 (Strategy)
- `nicho` - Selección de nicho
- `uvp` - Propuesta de valor
- `posicionamiento` - Estrategia de posicionamiento
- `tribu` - Definición de audiencia

### Módulo 3 (Identity)
- `color` - Paleta de colores
- `typography` - Tipografía
- `visual` - Estilo visual
- `brand_board` - Guía visual

### Módulo 4 (Platforms)
- `plataforma_principal` - Plataforma pillar
- `auditoria` - Auditoría online
- `estrategia` - Estrategia por plataforma
- `calendario` - Planificación

### Módulo 5 (Narrative)
- `historia` - Historia de fondo
- `casos` - Historias de clientes
- `contenido` - Matriz de contenido
- `pitch` - Elevator pitch

### Módulo 6 (Monetization)
- `streams` - Múltiples streams de ingresos
- `plan` - Plan de 90 días
- `tracking` - Seguimiento de progreso
- `scaling` - Escalamiento

---

## 🔍 Validación de Estructura

### Checklist antes de commitar

- [ ] JSON válido (sin errores de sintaxis)
- [ ] Todos los campos requeridos presentes
- [ ] IDs únicos (no hay q1 duplicado)
- [ ] Numeración secuencial (q1, q2, q3...)
- [ ] Respuesta correcta existe en opciones
- [ ] Categorías son del catálogo definido
- [ ] Descripciones claras y útiles
- [ ] Opciones balanceadas (no todas iguales)

### Script de validación (Node.js)

```javascript
// validate-questionnaire.js
import fs from 'fs';
import questionnaire from './questionnaire.json' assert { type: 'json' };

Object.entries(questionnaire).forEach(([moduleId, module]) => {
  console.log(`\n✓ Validando ${moduleId}`);

  // Validar estructura
  if (!module.title) console.error(`  ✗ Falta title`);
  if (!module.questions) console.error(`  ✗ Falta questions array`);

  // Validar preguntas
  module.questions.forEach((q, idx) => {
    if (!q.id) console.error(`  ✗ Pregunta ${idx} sin id`);
    if (!q.question) console.error(`  ✗ Pregunta ${q.id} sin texto`);
    if (!q.correctAnswer) console.error(`  ✗ Pregunta ${q.id} sin respuesta correcta`);

    // Validar que correctAnswer existe en options
    const validOption = q.options?.find(o => o.id === q.correctAnswer);
    if (!validOption) console.error(`  ✗ Pregunta ${q.id}: respuesta ${q.correctAnswer} no existe`);
  });

  console.log(`  ✓ ${module.questions.length} preguntas validadas`);
});

console.log('\n✓ Validación completada');
```

Ejecutar:
```bash
node backend/data/validate-questionnaire.js
```

---

## 📈 Cómo Agregar un Nuevo Módulo

### 1. Agregar entrada en questionnaire.json

```json
{
  "fundamentals": { ... },
  "strategy": {
    "title": "Módulo 2: Estrategia de Marca",
    "description": "Define tu nicho y propuesta de valor",
    "icon": "📊",
    "estimatedTime": 12,
    "questions": [...]
  }
}
```

### 2. Actualizar assessmentService.js (si necesario)

Los scores y análisis se generan automáticamente según categorías.

### 3. Actualizar Model.js

En `backend/src/models/Assessment.js`, agregar al ENUM:

```javascript
moduleId: {
  type: DataTypes.ENUM(
    'fundamentals',
    'strategy',
    'identity',
    'platforms',
    'narrative',
    'monetization'
  )
}
```

### 4. Testear

```bash
curl http://localhost:5000/api/assessment/questions/strategy
```

---

## 🎨 Mejores Prácticas

### Preguntas

✅ **Bueno:**
- "¿Cuál es tu fortaleza profesional más importante?" (específico)
- Incluir descripción contextual
- 4 opciones bien balanceadas
- Una respuesta claramente correcta

❌ **Malo:**
- "¿Cómo te sientes?" (ambiguo)
- "Opción A" como texto (poco descriptivo)
- 2 opciones (no suficiente variedad)
- Múltiples respuestas correctas en single_choice

### Opciones

✅ **Bueno:**
```json
"options": [
  {"id": "a", "text": "Mi experiencia de 10+ años en la industria"},
  {"id": "b", "text": "Mi metodología única y diferente"},
  {"id": "c", "text": "Mi red de contactos estratégicos"},
  {"id": "d", "text": "No estoy completamente seguro"}
]
```

❌ **Malo:**
```json
"options": [
  {"id": "a", "text": "Sí"},
  {"id": "b", "text": "No"},
  {"id": "c", "text": "Tal vez"},
  {"id": "d", "text": "No sé"}
]
```

---

## 📞 Preguntas Frecuentes

**P: ¿Puedo cambiar la respuesta correcta después de que usuarios respondan?**  
R: No se recomienda. Afectará los scores históricos. Crea una versión v2 del módulo si necesitas cambios significativos.

**P: ¿Cómo agrego retroalimentación personalizada por respuesta?**  
R: Agregar campo `feedback` en cada opción:
```json
{
  "id": "a",
  "text": "Mi experiencia",
  "feedback": "La experiencia es importante, pero lo que realmente diferencia..."
}
```

**P: ¿Cuántas preguntas por módulo?**  
R: Recomendación: 12-20 preguntas por módulo. Tiempo estimado: 10-15 minutos.

---

## 🚀 Próximos Pasos

- [ ] Agregar 5 módulos restantes
- [ ] Crear sistema de pesos dinámicos
- [ ] Agregar retroalimentación contextual
- [ ] Crear versiones A/B del cuestionario
- [ ] Integrar análisis de NLP para respuestas de texto

---

Made with ❤️ for Personal Branding  
No es azar, es propósito. — www.dmentedigital.co
