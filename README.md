# EstateWork - Real Estate Platform

A modern full-stack real estate platform built with React, TypeScript, Node.js, and Prisma.

## Project Status

✅ **Backend API** - Fully implemented with authentication, property management, and image uploads  
✅ **Frontend Core** - Complete UI with all major pages and components  
✅ **Authentication** - JWT-based auth with httpOnly cookies  
✅ **Property Management** - CRUD operations for agents/sellers  
✅ **Search & Filters** - Advanced property search with multiple filters  
✅ **Image Uploads** - Cloudinary integration for property images  
✅ **Real-time Messaging** - WebSocket-based 1:1 chat system (sockets branch)  

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
- **Real-time Messaging** - 1:1 chat between users with WebSocket support
  - Property-based conversations (chat about specific properties)
  - Real-time message delivery without page refresh
  - Message history persistence
  - Conversation list with last message preview
  - Auto-scroll to latest messages

### User Roles
- **Buyers** - Search, save, compare properties, and message agents
- **Sellers** - Create and manage property listings, respond to inquiries
- **Agents** - Create and manage property listings, communicate with buyers
- **Admins** - Full access to all properties and conversations

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
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time WebSocket connections

### Backend (Fully Implemented ✅)
- **Node.js + Express** - RESTful API server
- **TypeScript** - Type-safe backend code
- **Prisma ORM** - Database ORM with migrations
- **SQLite** - Development database (ready to migrate to PostgreSQL)
- **JWT + httpOnly Cookies** - Secure session-based authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Cloud image storage and optimization
- **Multer** - File upload handling
- **Socket.IO** - Real-time WebSocket server for messaging

### Hosting (Free Options)
- **Frontend**: Vercel, Netlify
- **Backend**: Render, Railway (WebSocket support required)
- **Database**: Supabase, Neon

## Project Structure

```
estate/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema with messaging models
│   │   ├── migrations/          # Database migrations
│   │   └── seed.ts              # Seed data
│   └── src/
│       ├── routes/
│       │   ├── auth.ts          # Authentication endpoints
│       │   ├── properties.ts    # Public property endpoints
│       │   ├── myProperties.ts  # Protected property management
│       │   ├── uploads.ts       # Image upload endpoints
│       │   └── conversations.ts # Messaging REST endpoints
│       ├── socket.ts            # WebSocket server setup
│       ├── app.ts               # Express + Socket.IO app
│       └── index.ts             # Server entry point
└── frontend/
    └── src/
        ├── components/
        │   ├── layout/          # Header, Footer, Layout
        │   ├── map/             # Map components
        │   └── property/        # Property-related components
        ├── pages/
        │   ├── HomePage.tsx
        │   ├── PropertiesPage.tsx
        │   ├── PropertyDetailsPage.tsx
        │   ├── AgentsPage.tsx
        │   ├── FavoritesPage.tsx
        │   ├── ComparePage.tsx
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── DashboardPage.tsx
        │   ├── DashboardPropertiesPage.tsx
        │   ├── AddPropertyPage.tsx
        │   ├── EditPropertyPage.tsx
        │   └── TestMessage.tsx  # Real-time messaging UI
        ├── services/
        │   ├── api.ts           # API client
        │   ├── auth.ts          # Auth service
        │   ├── properties.ts    # Property service
        │   ├── uploads.ts       # Upload service
        │   └── socket.ts        # Socket.IO client
        ├── store/               # Zustand stores
        ├── types/               # TypeScript types
        └── utils/               # Helper functions
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
copy .env.example .env  # Create and configure your .env file
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

**Backend:**
```bash
npm run dev         # Start development server with hot reload
npm run build       # Compile TypeScript to JavaScript
npm run start       # Run compiled production build
npm run db:generate # Generate Prisma client
npm run db:push     # Push schema changes to database
npm run db:seed     # Seed database with sample data
```

**Frontend:**
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
| Messages | `/messages` | ✅ | Real-time chat conversations |

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

### Conversations (Authenticated)
| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| GET | `/conversations` | Yes | List my conversations with last message |
| POST | `/conversations` | Yes | Start or find conversation with a user |
| GET | `/conversations/:id/messages` | Yes (participant only) | Get message history for conversation |

### Uploads
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/uploads/image` | Upload image to Cloudinary (returns URL) |

## WebSocket Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `join-conversation` | `conversationId: string` | Join a conversation room |
| `leave-conversation` | `conversationId: string` | Leave a conversation room |
| `send-message` | `{ conversationId: string, content: string }` | Send a message |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `new-message` | `{ id, conversationId, content, createdAt, sender }` | New message in conversation |

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

## Database Schema

### Core Models
- **User** - User accounts with roles (buyer, seller, agent, admin)
- **Property** - Property listings with location, features, and images
- **Conversation** - Chat conversations between users (optionally linked to a property)
- **ConversationParticipant** - Many-to-many relationship between users and conversations
- **Message** - Individual chat messages with sender and timestamp

### Relationships
- Users can have multiple properties (as agents/sellers)
- Users can participate in multiple conversations
- Conversations can have multiple participants
- Conversations contain multiple messages
- Conversations can optionally be linked to a property

## Development Notes

### Recent Changes (sockets branch)
- ✅ Added real-time messaging system with Socket.IO
- ✅ Implemented Conversation, ConversationParticipant, and Message models
- ✅ Created REST API for conversation management
- ✅ Built WebSocket server with authentication
- ✅ Developed messaging UI with real-time updates
- ✅ Added message persistence to database
- ✅ Implemented conversation rooms for targeted message delivery

### Database
- Currently using SQLite (`backend/prisma/prisma/dev.db`) for development
- Includes migrations for messaging system
- Ready to migrate to PostgreSQL for production

### Authentication
- JWT tokens stored in httpOnly cookies for security
- Tokens expire after 7 days
- WebSocket connections authenticated via cookie

### Image Uploads
- Property images uploaded to Cloudinary
- Returns secure URLs for storage in database

### Real-time Features
- Socket.IO handles WebSocket connections
- Messages delivered instantly to online users
- Conversation rooms ensure messages go to correct participants
- Automatic reconnection on connection loss

## Deployment Considerations

### PostgreSQL Migration
When moving to production, update the database:
1. Change `backend/prisma/schema.prisma` provider to `postgresql`
2. Set `DATABASE_URL` to your PostgreSQL connection string
3. Run: `npm run db:generate && npm run db:push && npm run db:seed`

### WebSocket Support
Ensure your hosting provider supports WebSocket connections:
- ✅ Render.com - Supports WebSockets
- ✅ Railway.app - Supports WebSockets
- ⚠️ Some serverless platforms may not support persistent connections

### Environment Variables
Set all environment variables in your hosting dashboard:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secure random string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `CORS_ORIGIN` - Your frontend URL
- `PORT` - (optional, usually auto-assigned)

## License

MIT
