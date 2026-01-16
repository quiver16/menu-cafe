# Proyecto Menu Cafe

Este proyecto es una aplicación web full-stack para un menú de cafetería, que consta de un **Backend** (Node.js/Express) y un **Frontend** (React/Vite).

## 📂 Estructura del Proyecto

### 🖥️ Frontend (`/frontend`)

Construido con React, Vite, TailwindCSS y Framer Motion.

- **`src/main.tsx`**: Punto de entrada de la aplicación React. Renderiza el componente raíz en el DOM.
- **`src/layouts/AppLayout.tsx`**: Define la estructura de diseño principal (por ejemplo, encabezado, pie de página, área de contenido principal) aplicada a las páginas.
- **`src/MenuContainer.tsx`**: El componente principal que muestra el menú. Obtiene categorías y productos del backend, maneja animaciones (Framer Motion) y gestiona el estado de la interfaz de usuario (expansión/colapso, conversión de moneda).
- **`src/router.tsx`**: Configura el enrutamiento del lado del cliente utilizando React Router.
- **`src/index.css`**: Estilos globales e importaciones de TailwindCSS.
- **`src/assets/`**: Activos estáticos como logotipos e iconos.

### ⚙️ Backend (`/backend`)

Construido con Node.js, Express y MongoDB (Mongoose).

- **`src/index.ts`**: Punto de entrada de la aplicación. Inicia el servidor y escucha en el puerto definido (por defecto: 4000).
- **`src/server.ts`**: Configura la aplicación Express, conecta a la base de datos, aplica middleware (CORS, análisis JSON) y configura el enrutamiento.
- **`src/router.ts`**: Define las rutas/endpoints de la API y las asigna a funciones controladoras.
- **`src/config/db.ts`**: Lógica para conectar a la base de datos MongoDB.
- **`src/config/cors.ts`**: Opciones de configuración para el Intercambio de Recursos de Origen Cruzado (CORS), incluyendo orígenes permitidos.
- **`src/controllers/index.ts`**: Contiene la lógica de negocio para manejar las solicitudes de la API (obtener productos, categorías, etc.).
- **`src/middleware/validation.ts`**: Funciones middleware para validar las solicitudes entrantes.
- **`src/models/`**: Esquemas de Mongoose que definen la estructura de datos para MongoDB.
  - `category.ts` / `Categoria.js`: Esquema para Categorías del Menú.
  - `product.ts` / `ProductosGeneral.js`: Esquema para Productos del Menú.

## 🚀 Comenzando

### Backend

1.  Navegar a `backend`: `cd backend`
2.  Instalar dependencias: `npm install`
3.  Iniciar servidor: `npm run dev` (o `npm start`)

### Frontend

1.  Navegar a `frontend`: `cd frontend`
2.  Instalar dependencias: `npm install`
3.  Iniciar servidor de desarrollo: `npm run dev`

## ✨ Características Clave

- **Menú Dinámico**: Carga categorías y productos dinámicamente desde la base de datos.
- **Animaciones Suaves**: Utiliza `framer-motion` para interacciones fluidas de expandir/colapsar.
- **Conversión de Moneda**: Muestra precios en USD y convierte a moneda local (Bs.) utilizando tasas en tiempo real.
- **Diseño Responsivo**: Diseño adaptable a móviles utilizando TailwindCSS.
