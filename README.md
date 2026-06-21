# EstateWork - Real Estate Platform

A modern real estate platform built with React, TypeScript, and Tailwind CSS.

## Features

### Core Features
- **Property Search** - Advanced filtering by location, type, price, bedrooms, and area
- **Property Listings** - Browse properties with detailed cards showing key features
- **Property Details** - View comprehensive property information with image gallery
- **Map Integration** - See property locations on an interactive map (Leaflet/OpenStreetMap)
- **Favorites** - Save properties for later viewing
- **Property Comparison** - Compare up to 3 properties side-by-side
- **User Accounts** - Support for buyers, sellers, and agents
- **Agent Directory** - Browse and contact real estate agents

### User Types
- **Buyers** - Search, save, and compare properties
- **Sellers** - List properties (backend required)
- **Agents** - Manage listings and contact with buyers (backend required)
- **Admins** - Moderate content (backend required)

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **React Hook Form + Zod** - Form handling and validation
- **Leaflet + React Leaflet** - Interactive maps
- **Lucide React** - Icons
- **Axios** - HTTP client (for backend integration)

### Backend (v0 — implemented)
- Node.js + Express + TypeScript
- SQLite + Prisma ORM (swap to PostgreSQL for production)
- JWT Authentication
- Cloudinary (image uploads)

### Hosting (Free Options)
- **Frontend**: Vercel, Netlify
- **Backend**: Render, Railway
- **Database**: Supabase, Neon

## Project Structure

```
estate/
├── backend/
│   ├── prisma/          # Schema, seed, SQLite DB
│   └── src/             # Express API
└── frontend/
    └── src/
        ├── components/
        │   ├── common/       # Reusable UI components
        │   ├── layout/       # Header, Footer, Layout
        │   ├── map/          # Map components
        │   └── property/     # Property-related components
        ├── data/             # Sample/mock data
        ├── hooks/            # Custom React hooks
        ├── pages/            # Page components
        ├── services/         # API services
        ├── store/            # Zustand stores
        ├── types/            # TypeScript types
        └── utils/            # Helper functions
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

**1. Backend API**

```bash
cd backend
npm install
copy .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

API runs at `http://localhost:3001`. Seed agents use password `password123` (e.g. `john.smith@estate.com`).

**2. Frontend**

```bash
cd frontend
npm install
npm run dev
# or if npm scripts fail: node .\node_modules\vite\bin\vite.js
```

The app will be available at `http://localhost:5173` (proxies `/api` to the backend).

**Run both** — backend first, then frontend.

### npm `spawn .local\bin` error on Windows

If `npm run` fails with `spawn C:\Users\abdel\.local\bin ENOENT`, fix your global npm config:

```powershell
npm config delete script-shell
```

This repo also sets `script-shell=C:\Windows\System32\cmd.exe` in `.npmrc` files. If scripts still fail, run directly (from `backend/` after `npm install`):

```powershell
npm install
node .\node_modules\prisma\build\index.js db push
node .\node_modules\tsx\dist\cli.mjs prisma\seed.ts
node .\node_modules\tsx\dist\cli.mjs watch src\index.ts
```

Ensure `npm install` completed in `backend/` first — without `node_modules`, Prisma is not installed.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, search, featured properties |
| Properties | `/properties` | Browse all properties with filters |
| Property Details | `/properties/:id` | Full property view |
| Agents | `/agents` | Agent directory |
| Favorites | `/favorites` | Saved properties |
| Compare | `/compare` | Property comparison |
| Login | `/login` | User authentication |
| Register | `/register` | User registration |
| Dashboard | `/dashboard` | User dashboard |

## API Endpoints (v0)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in → httpOnly session cookie |
| POST | `/api/auth/logout` | Clear session cookie |
| GET | `/api/auth/me` | Current user (session cookie) |

| GET | `/api/properties` | List (query filters) |
| GET | `/api/properties/:id` | Property detail |

| GET | `/api/my/properties` | My properties (agent/seller/admin) |
| POST | `/api/my/properties` | Create property (agent/seller/admin) |
| PATCH | `/api/my/properties/:id` | Update property |
| DELETE | `/api/my/properties/:id` | Delete property |

| POST | `/api/uploads/image` | Upload image to Cloudinary |


## Next Steps

1. **PostgreSQL** — migrate Prisma provider + set `DATABASE_URL` (e.g. Neon/Supabase)
   - Update `backend/prisma/schema.prisma` provider (`sqlite` → `postgresql`)
   - Set `DATABASE_URL` in your local backend `.env`
   - Run (backend):
     - `npm run db:generate`
     - `npm run db:push`
     - `npm run db:seed`
   - Redeploy with the same environment variables
2. **Buyer features** — favorites, compare, and saved views integration (if not complete)
3. **Messaging** — buyer–agent chat




## License

MIT
