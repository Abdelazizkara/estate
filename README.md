# EstateWork - Real Estate Platform

A modern full-stack real estate platform built with React, TypeScript, Node.js, and Prisma.

## Project Status

✅ **Backend API** - Fully implemented with authentication, property management, and image uploads  
✅ **Frontend Core** - Complete UI with all major pages and components  
✅ **Authentication** - JWT-based auth with httpOnly cookies  
✅ **Property Management** - CRUD operations for agents/sellers  
✅ **Search & Filters** - Advanced property search with multiple filters  
✅ **Image Uploads** - Cloudinary integration for property images  
⏳ **Messaging System** - Planned (see TODO.md)  

## Features

### Core Features (Implemented ✅)
- **Property Search** - Advanced filtering by location, type, price, bedrooms, and area
- **Property Listings** - Browse properties with detailed cards showing key features
- **Property Details** - View comprehensive property information with image gallery
- **Map Integration** - See property locations on an interactive map (Leaflet/OpenStreetMap)
- **Favorites** - Save properties for later viewing (client-side)
- **Property Comparison** - Compare up to 3 properties side-by-side
- **User Authentication** - JWT-based registration/login with role-based access
- **Property Management** - Agents/sellers can create, edit, and delete their listings
- **Image Uploads** - Upload property images to Cloudinary
- **Agent Directory** - Browse and view real estate agent profiles

### User Roles
- **Buyers** - Search, save, and compare properties
- **Sellers** - Create and manage property listings
- **Agents** - Create and manage property listings with agent profile
- **Admins** - Full access to all properties

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

### Backend (Fully Implemented ✅)
- **Node.js + Express** - RESTful API server
- **TypeScript** - Type-safe backend code
- **Prisma ORM** - Database ORM with migrations
- **SQLite** - Development database (ready to migrate to PostgreSQL)
- **JWT + httpOnly Cookies** - Secure session-based authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Cloud image storage and optimization
- **Multer** - File upload handling

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

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Home | `/` | ✅ | Hero, search, featured properties |
| Properties | `/properties` | ✅ | Browse all properties with filters |
| Property Details | `/properties/:id` | ✅ | Full property view with image gallery |
| Agents | `/agents` | ✅ | Agent directory |
| Favorites | `/favorites` | ✅ | Saved properties (client-side) |
| Compare | `/compare` | ✅ | Property comparison (up to 3) |
| Login | `/login` | ✅ | User authentication |
| Register | `/register` | ✅ | User registration with role selection |
| Dashboard | `/dashboard` | ✅ | User dashboard overview |
| My Properties | `/dashboard/properties` | ✅ | Manage your listings (agents/sellers) |
| Add Property | `/dashboard/add-property` | ✅ | Create new property listing |
| Edit Property | `/dashboard/properties/:id/edit` | ✅ | Edit existing property |

## API Endpoints

### Health & Status
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create account (buyer/seller/agent/admin) |
| POST | `/api/auth/login` | Sign in → httpOnly session cookie |
| POST | `/api/auth/logout` | Clear session cookie |
| GET | `/api/auth/me` | Get current user (requires auth) |

### Public Properties
| Method | Path | Query Params | Description |
|--------|------|--------------|-------------|
| GET | `/api/properties` | `query`, `type`, `status`, `city`, `minPrice`, `maxPrice`, `minBedrooms`, `minArea` | Search/filter properties |
| GET | `/api/properties/:id` | - | Get property details |

### My Properties (Authenticated)
| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| GET | `/api/my/properties` | agent/seller/admin | List my properties |
| POST | `/api/my/properties` | agent/seller/admin | Create new property |
| PATCH | `/api/my/properties/:id` | agent/seller/admin (owner or admin) | Update property |
| DELETE | `/api/my/properties/:id` | agent/seller/admin (owner or admin) | Delete property |

### Uploads
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/uploads/image` | Upload image to Cloudinary (returns URL) |


## Environment Variables

### Backend `.env`
```env
# Database
DATABASE_URL="file:./prisma/dev.db"  # SQLite for development
# For PostgreSQL: DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-secret-key-here"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# CORS (optional, defaults to http://localhost:5173)
CORS_ORIGIN="http://localhost:5173"

# Port (optional, defaults to 3001)
PORT=3001
```

Create `backend/.env` from `backend/.env.example` and fill in your credentials.

## Next Steps & Roadmap

### Immediate (Recommended)
1. **PostgreSQL Migration** - Switch from SQLite to PostgreSQL for production
   - Update `backend/prisma/schema.prisma` provider to `postgresql`
   - Set `DATABASE_URL` to your PostgreSQL connection string
   - Run: `npm run db:generate`, `npm run db:push`, `npm run db:seed`

### Planned Features (See TODO.md)
2. **Real-time Messaging System** - 1:1 chat between users (WebSocket-based)
   - Backend: WebSocket server, Prisma schema updates (Conversation, Message models)
   - Frontend: Chat UI, real-time message sync
   - See `TODO.md` for detailed implementation plan

3. **Enhanced Buyer Features**
   - Persistent favorites (backend integration)
   - Saved searches with email notifications
   - Property viewing history

4. **Agent Dashboard Enhancements**
   - Analytics and insights
   - Lead management
   - Performance metrics

5. **Admin Panel**
   - User management
   - Content moderation
   - Platform analytics

## Development Notes

- **Recent Changes** (see git log):
  - Minor frontend fixes
  - Database seed updates
  - Initial project setup

- **Database**: Currently using SQLite (`backend/prisma/prisma/dev.db`) for development. Ready to migrate to PostgreSQL.

- **Authentication**: JWT tokens stored in httpOnly cookies for security. Tokens expire after 7 days.

- **Image Uploads**: Property images are uploaded to Cloudinary. The API returns secure URLs.

## License

MIT
