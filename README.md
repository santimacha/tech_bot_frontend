# TeachBot — Frontend

Aplicación web de estudio inteligente construida con **React + TypeScript + Vite**. Permite a los estudiantes subir documentos PDF, generar resúmenes automáticos, flashcards, cuestionarios y chatear con un asistente de IA sobre el contenido del documento. Todo el procesamiento de IA se delega al backend (`leviatan-backend`).

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura y patrones](#arquitectura-y-patrones)
- [Autenticación](#autenticación)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Módulos y componentes principales](#módulos-y-componentes-principales)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y ejecución](#instalación-y-ejecución)

---

## Descripción general

TeachBot es una SPA (Single Page Application) que conecta con un backend REST en FastAPI. El flujo principal del usuario es:

1. Registrarse o iniciar sesión en `/login`.
2. Crear o seleccionar una **asignatura** en `/subject`.
3. Subir un **documento PDF** en `/upload`, asociado a la asignatura.
4. Visualizar el documento en `/documents`, donde puede generar resúmenes, flashcards, un quiz interactivo y chatear con la IA sobre el contenido.
5. Revisar sus **estadísticas** de estudio en `/statistics`.
6. Gestionar su perfil desde la Navbar (editar datos o cambiar contraseña).

---

## Tecnologías utilizadas

| Tecnología | Versión recomendada | Propósito |
|---|---|---|
| React | 18+ | UI declarativa |
| TypeScript | 5+ | Tipado estático |
| Vite | 5+ | Bundler y servidor de desarrollo |
| React Router DOM | v6 | Enrutamiento del lado del cliente |
| Framer Motion | 11+ (API `motion/react`) | Animaciones de UI |
| react-pdf | — | Visualización de PDFs en el navegador |
| pdfjs-dist | — | Worker de renderizado de PDFs |
| react-apexcharts | — | Gráficas de estadísticas |
| Tailwind CSS | 3+ | Estilos utilitarios |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── App.tsx                        # Componente raíz: define todas las rutas
│   ├── main.tsx                       # Punto de entrada de React
│   └── routes/
│       ├── ProtectedRoute.tsx         # Redirige a /landing si no está autenticado
│       ├── PublicRoute.tsx            # Redirige a /subject si ya está autenticado
│       └── RootRedirect.tsx           # Redirige / según estado de autenticación
│
├── features/
│   ├── auth/
│   │   ├── context/
│   │   │   ├── AuthContext.tsx        # Contexto + hook useAuth()
│   │   │   └── AuthProvider.tsx       # Estado de sesión (token, user, login, logout)
│   │   └── pages/
│   │       └── Login.tsx              # Página de login y registro
│   │
│   ├── landing/
│   │   ├── components/
│   │   │   ├── header.tsx
│   │   │   ├── Hero_Section.tsx
│   │   │   ├── Features_Section.tsx
│   │   │   ├── How_Works_Section.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Call_Action.tsx
│   │   │   └── Button.tsx
│   │   └── pages/
│   │       └── Landing.tsx            # Página de bienvenida pública
│   │
│   └── application/
│       ├── upload_document/
│       │   └── Upload_Document.tsx    # Subida de PDFs con drag & drop
│       ├── view_subject/
│       │   ├── View_Subject.tsx       # Listado y gestión de asignaturas
│       │   └── components/            # SubjectList, SubjectCard, SubjectModal, DocumentModal
│       ├── view_document/
│       │   ├── QUIZ/
│       │   │   └── View_Document.tsx  # Vista principal: PDF + resumen + flashcards + quiz + chat
│       │   ├── PDF/
│       │   │   └── Pdf_view.tsx       # Componente de visualización del PDF
│       │   ├── chat/
│       │   │   └── Chat.tsx           # Chatbot de IA sobre el documento
│       │   └── Quiz.tsx               # Componente interactivo de quiz
│       ├── statistics_user/
│       │   └── statistics_user.tsx    # Gráficas de rendimiento del usuario
│       └── profile/
│           ├── profileEdit.tsx        # Edición de nombre, apellido y email
│           └── profileChangePass.tsx  # Cambio de contraseña
│
└── shared/
    ├── components/
    │   ├── Navbar/Navbar.tsx          # Barra de navegación con menú de usuario
    │   ├── Footer/Footer.tsx          # Pie de página
    │   ├── Sidebar/Sidebar.tsx        # Barra lateral (disponible en layout)
    │   └── popups/
    │       ├── ErrorPop.tsx           # PopupEmailPassword, PopupPasswordMismatch
    │       └── ConfirmPop.tsx         # PopupUserCreated, PopupLoginSuccess
    ├── interfaces/
    │   ├── login.interface.ts         # LoginRequest, LoginResponse
    │   ├── user.interface.ts          # User
    │   ├── document.interface.ts      # DocumentResponse, DocumentR
    │   ├── subject.interface.ts       # Subject
    │   ├── quiz.interface.ts          # Quiz (preguntas, opciones, respuesta correcta)
    │   ├── flashcards.interfaces.ts   # Flashcard
    │   ├── summary.interface.ts       # Summary
    │   └── register.interface.ts      # RegisterRequest
    ├── layout/
    │   └── Layout.tsx                 # Wrapper con Navbar y Footer condicionales
    └── utils/
        └── env/
            └── environment.ts         # Clase Enviroment con API_URL
```

---

## Arquitectura y patrones

### Feature-based folder structure

El proyecto sigue una arquitectura orientada a **features** (módulos de funcionalidad). Cada feature es una carpeta autónoma dentro de `src/features/` que contiene sus páginas, componentes y lógica propia. Esto evita el acoplamiento entre módulos y facilita el mantenimiento.

### Alias de rutas (`@/`)

Todos los imports entre features y hacia `shared/` usan el alias `@/` (mapeado a `src/` en `vite.config.ts` y `tsconfig.json`). Esto elimina las rutas relativas frágiles tipo `../../../`:

```typescript
// ✅ Correcto
import { useAuth } from "@/features/auth/context/AuthContext";
import { Enviroment } from "@/shared/utils/env/environment";

// ❌ Incorrecto (frágil, puede romperse al mover archivos)
import { useAuth } from "../../../context/AuthContext";
```

### Layout condicional

El componente `Layout` acepta las props `showNavbar` y `showSidebar` para controlar qué elementos estructurales se renderizan. Las páginas públicas (Login, Landing) ocultan la Navbar; las protegidas la muestran.

---

## Autenticación

La autenticación está gestionada por el `AuthProvider` usando **React Context** y `sessionStorage`.

### Flujo de login

1. El usuario ingresa email y contraseña en `/login`.
2. Se hace `POST /auth/login` al backend, que devuelve un `access_token` JWT y datos del usuario.
3. El token y los datos del usuario se persisten en `sessionStorage` bajo las claves `access_token` y `auth_user`.
4. El estado global `isAuthenticated` cambia a `true`, y React Router redirige a `/subject`.

### `useAuth()` hook

Disponible en cualquier componente hijo del `AuthProvider`. Expone:

```typescript
const {
  isAuthenticated, // boolean — ¿hay sesión activa?
  token,           // string | null — JWT para headers Authorization
  accessToken,     // alias de token (compatibilidad)
  user,            // { user_id, email } | null
  login,           // (LoginResponse) => void
  logout,          // () => void — limpia sessionStorage y el estado
} = useAuth();
```

### Protección de rutas

| Componente | Comportamiento |
|---|---|
| `ProtectedRoute` | Si no hay sesión, redirige a `/landing` |
| `PublicRoute` | Si ya hay sesión, redirige a `/subject` |
| `RootRedirect` | En `/`, redirige según el estado de autenticación |

---

## Rutas de la aplicación

| Ruta | Acceso | Componente | Descripción |
|---|---|---|---|
| `/` | Público | `RootRedirect` | Redirige automáticamente según sesión |
| `/landing` | Solo público | `Landing` | Página de bienvenida y marketing |
| `/login` | Solo público | `Login` | Formulario de inicio de sesión y registro |
| `/subject` | Protegido | `ViewSubject` | Listado de asignaturas y documentos |
| `/upload` | Protegido | `UploadDocument` | Subida de documentos PDF |
| `/documents` | Protegido | `ViewDocument` | Visor de PDF con herramientas de IA |
| `/statistics` | Protegido | `Statistics` | Estadísticas y gráficas de estudio |
| `/profile/edit` | Protegido | `ProfileEdit` | Edición de datos del perfil |
| `/profile/change-password` | Protegido | `ProfileChangePass` | Cambio de contraseña |
| `*` | Público | inline | Página 404 |

---

## Módulos y componentes principales

### `ViewDocument` — Centro de estudio

Es el módulo más complejo. Tiene un layout de dos columnas: el visor de PDF a la izquierda y un panel de pestañas a la derecha. Las pestañas disponibles son:

- **Resumen**: Texto generado por la IA que condensa el documento.
- **Flashcards**: Tarjetas de estudio generadas automáticamente, con modal al hacer clic.
- **Quiz**: Cuestionario interactivo con retroalimentación inmediata por respuesta.
- **Chat**: Chatbot que responde preguntas sobre el contenido específico del documento.

El `documentId` se pasa entre páginas mediante `sessionStorage` bajo la clave `documentId`.

### `Quiz`

Componente interactivo que carga el quiz del documento desde el endpoint `GET /quiz/{documentId}`. Muestra las preguntas una a una, marca en verde la opción correcta y en rojo la incorrecta al responder, y presenta el puntaje final con opción de reintentar.

### `AuthProvider`

Persiste el token en `sessionStorage` para que la sesión sobreviva recargas de página. Al hacer logout, limpia ambas claves (`access_token` y `auth_user`) y resetea el estado.

### `Navbar`

Muestra los links de navegación y un menú desplegable con el nombre y email del usuario (obtenidos de `GET /user/data`). Desde allí se puede navegar a editar perfil, cambiar contraseña, o cerrar sesión.

---

## Variables de entorno

La URL base del backend está centralizada en `src/shared/utils/env/environment.ts`:

```typescript
export class Enviroment {
  public static API_URL: string = "https://leviatan-backend.onrender.com";
  // public static API_URL: string = "http://127.0.0.1:8000"; // desarrollo local
}
```

Para apuntar al backend local durante el desarrollo, comenta la línea de producción y descomenta la de desarrollo.

---

## Instalación y ejecución

### Prerrequisitos

- Node.js 18+
- npm o pnpm

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

### Alias `@/` en Vite y TypeScript

Asegúrate de que tu `vite.config.ts` y `tsconfig.json` incluyan el alias `@` → `src`:

**`vite.config.ts`**
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**`tsconfig.json`** (dentro de `compilerOptions`)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```