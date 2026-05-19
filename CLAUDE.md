# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack digital menu application for FoodMart Café. Customers browse the menu and submit orders via WhatsApp. The system reads product/category data from MongoDB and serves it via a REST API.

## Commands

### Backend (`/backend`)
```bash
npm run dev      # TypeScript watch mode via tsx
npm run build    # Compile TypeScript → dist/
npm start        # Run compiled output (dist/index.js)
```

### Frontend (`/frontend`)
```bash
npm run dev      # Vite dev server (exposed on all interfaces via --host)
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

### Docker (root)
```bash
docker-compose up --build   # Build and start both services
docker-compose up -d        # Start in background
```

## Architecture

### Services & Ports
| Service | Dev Port | Container Port |
|---------|----------|----------------|
| Backend (Express) | 4010 | 4010 |
| Frontend (Nginx) | — | 4080 |
| Frontend (Vite dev) | 5173 | — |

The backend connects to an external MongoDB instance. `MONGO_URI` and `FRONTEND_URL` must be set (see `backend/.env`). The frontend reads `VITE_BACKEND_URL` and `VITE_WHATSAPP_NUMBER` from `frontend/.env.local`.

### Backend (`/backend/src`)
- `index.ts` → entry point, starts server on `process.env.PORT` (default 4010)
- `server.ts` → Express app: MongoDB connection, CORS, JSON body parser, routes
- `router.ts` → four routes: `GET /products`, `GET /categories`, `GET /dolar`, `GET /image/:Codp`
- `controllers/index.ts` → business logic; `getProductImage` maintains an in-memory LRU cache (max 200 entries) with MD5 ETags and `Cache-Control: public, max-age=86400`
- `config/cors.ts` → whitelist-based CORS; add new origins here; reads `FRONTEND_URL` env var
- `config/db.ts` → Mongoose connection; exits process on failure
- `models/` → three Mongoose schemas: `ProductosGeneral` (complex), `Categoria`, `monedas`

The backend is written as ES modules (`"type": "module"`), compiled from TypeScript with `tsconfig.json` targeting ES2022 / NodeNext resolution. `dist/` is the compiled output and is what Docker runs.

### Frontend (`/frontend/src`)
- `router.tsx` → React Router v7 BrowserRouter; single route `/` renders `AppLayout` + `MenuContainer`
- `layouts/AppLayout.tsx` → header (banner + logo), `<Outlet />`, footer; uses Sonner for toasts
- `MenuContainer.tsx` → main component (~450 lines): fetches categories/products/dolar on mount, groups products by category, renders mobile accordion or desktop grid, manages shopping cart quantities, calculates totals in USD and Bs. (via dolar factor), submits orders to WhatsApp
- `config/axios.ts` → Axios instance with `baseURL` from `VITE_BACKEND_URL`

Key patterns in `MenuContainer.tsx`:
- Product names are cleaned of `"FMC"` and `"PF"` prefixes via regex before display
- Category icons are mapped from keywords (e.g., `POSTRES` → cake, `CAFES` → coffee)
- Image fetching uses ETag/`If-None-Match` headers to leverage browser + server caching
- `ProductCard` is wrapped in `React.memo` to avoid re-renders on quantity changes
- `useMemo` is used for `productsByCategory` grouping and `orderTotal` calculation

### `pantalla_menu/`
Static HTML pages for wall-display screens (one per menu category: `cafes.html`, `desayunos.html`, `almuerzos.html`, etc.). These are standalone files, not built by Vite or served by the backend.

## Database Collections
| Collection | Model file | Notes |
|---|---|---|
| `productosgenerals` | `models/product.ts` | Main products; images stored as `ImageFs` Buffer |
| `Categoria` | `models/category.ts` | One category (`6814c01d114516e7012011ad`) is excluded from API |
| `monedas` | `models/currency.ts` | Currency rates; `Codp: "02"` is USD→Bs. rate |

## CORS Configuration
Allowed origins are hardcoded in `backend/src/config/cors.ts` plus `FRONTEND_URL` env var. When adding a new deployment origin, add it to the `allowedOrigins` array in that file and rebuild/restart the backend container.
