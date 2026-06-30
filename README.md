# 🎯 BrandForge - Herramienta SaaS de Marca Personal

**Versión:** 1.0.0  
**Estado:** En desarrollo  
**Stack:** React + Node.js + PostgreSQL  
**Última actualización:** 2026-06-29

---

## 📋 Descripción

BrandForge es una **plataforma SaaS de diagnóstico y estrategia de marca personal** que ayuda a cualquier profesional a construir, auditar y monetizar su marca personal de forma estratégica.

### Usuario Principal
Profesionales autónomos, emprendedores, freelancers, pequeños negocios y agencias que necesitan:
- Diagnosticar su presencia online actual
- Crear un plan estratégico de marca
- Posicionarse como expertos
- Monetizar su expertise

### Diferencial
✅ Integración completa (no necesita 5 herramientas)  
✅ Framework basado en expertos probados  
✅ Flujo estructurado paso a paso  
✅ Entregas concretas y accionables  
✅ Accesible para profesionales independientes

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- PostgreSQL 12+
- npm o yarn

### Instalación

#### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus valores
npm run dev
```

Backend correrá en: `http://localhost:5000`

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend correrá en: `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
brandforge-app/
├── backend/
│   ├── src/
│   │   ├── controllers/    → Lógica de endpoints
│   │   ├── services/       → Lógica de negocio
│   │   ├── models/         → Modelos de BD
│   │   ├── routes/         → Rutas de API
│   │   └── utils/          → Funciones auxiliares
│   ├── config/             → Configuración
│   ├── tests/              → Tests
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     → Componentes React
│   │   ├── pages/          → Páginas
│   │   ├── services/       → Llamadas a API
│   │   ├── context/        → Context API state
│   │   ├── hooks/          → Custom hooks
│   │   └── App.jsx
│   ├── public/             → Assets estáticos
│   └── package.json
│
└── docs/
    ├── SPEC.md             → Especificación completa
    ├── CONTEXT.md          → Glosario de términos
    └── KB-BRANDFORGE.md    → Base de conocimiento
```

---

## 🏗️ Arquitectura

### Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **DB** | PostgreSQL + Sequelize ORM |
| **Auth** | JWT + OAuth2 (próximo) |
| **Almacenamiento** | AWS S3 (próximo) |

### Flujo de datos
```
User → React UI → Axios → Express API → PostgreSQL
```

---

## 📚 Módulos de la Herramienta

### Módulo 1: Fundamentos
Autoconocimiento del usuario
- Test de autodiagnóstico
- Llama Azul
- Ikigai
- Análisis de excepcionalidad

### Módulo 2: Estrategia
Definición de posicionamiento
- Selector de nicho
- UVP generator
- Promesa de marca
- Definición de tribu

### Módulo 3: Identidad Visual
Creación de guía visual
- Paleta de colores
- Selección de tipografía
- Guía fotográfica
- Brand board generator

### Módulo 4: Plataformas
Selección y estrategia de plataformas
- Plataforma pillar ideal
- Auditoría de presencia online
- Estrategia por plataforma
- Calendar de contenido

### Módulo 5: Narrativa
Comunicación clara
- Historia de fondo
- Historias de clientes
- Matriz de contenido
- Elevator pitch

### Módulo 6: Monetización
Plan de ingresos
- Auditoría de streams
- Generador de múltiples streams
- Plan de 90 días
- Seguimiento de progreso

---

## 🔑 Funcionalidades Principales

### v1.0 (MVP)
- ✅ Assessment de marca (módulos 1-6)
- ✅ Dashboard de progreso
- ✅ PDF descargable con reporte
- ✅ Auth por email
- ✅ Plan de 90 días personalizado

### v1.1 (Próxima)
- Integración Google Search (auditoría)
- Integración LinkedIn
- Sistema de seguimiento avanzado
- Admin panel para actualizar contenido

### v2.0 (Fase 2)
- Pagos con Stripe
- Múltiples niveles de suscripción
- Integración con Canva
- Integración con Notion
- Community y comparación con otros

---

## 📖 Documentación

### Para Desarrolladores
- **SPEC.md** → Especificación completa (6 secciones SDD)
- **CONTEXT.md** → Glosario de términos
- **KB-BRANDFORGE.md** → Base de conocimiento extensible

### Para Agregar Contenido Nuevo
Ver `KB-BRANDFORGE.md` para instrucciones de cómo agregar:
- Nuevas preguntas
- Frameworks
- Casos de éxito
- Contenido educativo

---

## 🛠️ Desarrollo

### Backend Development

```bash
# En carpeta backend/
npm run dev              # Inicia servidor con nodemon
npm test                 # Corre tests
npm run lint             # ESLint
```

**Endpoints principales (por implementar):**
- `POST /api/auth/register` → Registro
- `POST /api/auth/login` → Login
- `POST /api/assessment/start` → Inicia assessment
- `POST /api/assessment/submit` → Envía respuestas
- `GET /api/user/report` → Reporte de marca
- `GET /api/user/plan` → Plan de 90 días

### Frontend Development

```bash
# En carpeta frontend/
npm run dev              # Inicia Vite dev server
npm run build            # Build para producción
npm run preview          # Preview de build
npm run lint             # ESLint
```

**Componentes principales (por crear):**
- `<AssessmentFlow />` → Flujo de preguntas
- `<Dashboard />` → Panel de usuario
- `<ReportGenerator />` → Generador de PDF
- `<PlanBuilder />` → Constructor de plan

---

## 📊 Variables de Entorno

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=brandforge_db
DB_USER=postgres
DB_PASSWORD=...
JWT_SECRET=...
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=BrandForge
```

---

## 🚢 Deployment

### Backend (Heroku/Render)
```bash
git push heroku main
```

### Frontend (Vercel)
```bash
npm run build
vercel
```

---

## 📝 Próximos Pasos

1. ✅ Especificación y arquitectura (DONE)
2. ⏳ **Implementar Módulo 1: Fundamentos**
3. ⏳ Implementar Módulos 2-6
4. ⏳ Dashboard y reportes
5. ⏳ Auth y usuarios
6. ⏳ Pagos y suscripción
7. ⏳ Deployment

---

## 👥 Equipo

**Proyecto:** Dmente Digital  
**Contacto:** dmentdigital@gmail.com

---

## 📞 Soporte

Para agregar información nueva a la KB sin afectar el código:
1. Consulta `KB-BRANDFORGE.md`
2. Agrega contenido en formato JSON
3. El sistema lo carga automáticamente

---

**Made with ❤️ for Personal Branding**

No es azar, es propósito. — www.dmentedigital.co
