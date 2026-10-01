# Boaive Operations Hub

Internal operations management system for Boaive Technologies.

## Project Structure

```
admin pannel/
├── frontend/        ← React 19 + TypeScript + Vite
├── backend/         ← Node.js + Express + TypeScript + PostgreSQL + Prisma
├── .gitignore
└── README.md
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
```

---

## Backend

### Prerequisites
- Node.js 18+
- PostgreSQL 15+

### Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env — set DATABASE_URL and JWT_SECRET
   ```

3. **Database setup**
   ```bash
   npm run db:generate    # Generate Prisma client
   npm run db:migrate     # Run migrations
   npm run db:seed        # Seed development data
   ```

4. **Start backend**
   ```bash
   npm run dev            # http://localhost:5000
   ```

### Default Credentials (seed data)
| Email | Password | Role |
|-------|----------|------|
| admin@boaive.com | Admin@123 | SUPER_ADMIN |
| aarav@boaive.com | Admin@123 | ADMIN |
| priya@boaive.com | Admin@123 | MEMBER |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/dashboard` | Dashboard KPIs |
| GET | `/api/search?q=` | Global search |
| GET/POST | `/api/clients` | Clients |
| GET/PUT/DELETE | `/api/clients/:id` | Client detail |
| GET/POST | `/api/contacts` | Contacts |
| GET/POST | `/api/leads` | Leads |
| GET/POST | `/api/projects` | Projects |
| GET/POST | `/api/tasks` | Tasks |
| GET/POST | `/api/finance` | Finance records |
| GET/POST | `/api/invoices` | Invoices |
| GET/POST | `/api/expenses` | Expenses |
| GET/POST | `/api/assets` | Assets |
| GET/POST | `/api/content` | Content |

API Documentation: `http://localhost:5000/api/docs`

---

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Lucide React

**Backend:** Node.js, Express, TypeScript, PostgreSQL, Prisma ORM, Zod, JWT, bcryptjs, Helmet, Winston, Swagger
