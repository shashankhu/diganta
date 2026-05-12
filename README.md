# DIGANTA — College Event Management System

> From idea to execution to legacy — the complete college event lifecycle platform.

Diganta is a production-grade event management system built for college administration. It features a multi-stage approval pipeline, role-based access control for 12+ roles, vendor management, budget tracking, and real-time notifications.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19 |
| Styling | Vanilla CSS (custom design system) |
| Database | PostgreSQL via Prisma ORM v7 |
| Auth | JWT (bcryptjs + jsonwebtoken) |
| Hosting | Vercel (recommended) |
| Database Host | Supabase / Neon / any PostgreSQL |

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL (local or hosted)

### 1. Clone & Install
```bash
git clone https://github.com/shashankhu/diganta.git
cd diganta
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/diganta_mvp"
JWT_SECRET="your_secure_random_string_at_least_32_characters"
NODE_ENV="development"
```

### 3. Set Up Database
```bash
npm run db:setup
```
This will generate the Prisma client, push the schema to your database, and seed demo data.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Demo Accounts

All demo accounts use password: `password123`

| Role | Email | Purpose |
|------|-------|---------|
| Super Admin | superadmin@college.edu | Full system access |
| Admin | admin@college.edu | System administration |
| Dean | dean@college.edu | Event approval, vendor management |
| Principal | principal@college.edu | High-budget event approval |
| Faculty (CS) | faculty1@college.edu | CS club event approval |
| Faculty (EC) | faculty2@college.edu | EC club event approval |
| Club Head | student1@college.edu | Create & manage club events |
| Student | student2@college.edu | View events, join clubs |
| Transport | transport@college.edu | Transport coordination |
| Security | security@college.edu | Security coordination |
| Resource | resource@college.edu | Resource management |
| Finance | finance@college.edu | Vendor bill processing |

---

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add -A
git commit -m "Production deployment"
git push origin main
```

### 2. Import to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)

### 3. Configure Environment Variables
In Vercel → Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your production PostgreSQL connection string |
| `JWT_SECRET` | A secure random string (64+ chars) |
| `NODE_ENV` | `production` |

> **Supabase Users**: Use the **Session Pooler** URL (port 5432) from your Supabase project settings for IPv4 compatibility with Vercel.

### 4. Deploy
Vercel will automatically:
1. Run `npx prisma generate`
2. Run `next build`
3. Deploy to production

### 5. Seed Production Database
After first deployment, seed the database:
```bash
# Set DATABASE_URL to your production database
DATABASE_URL="postgresql://..." npx prisma db push
DATABASE_URL="postgresql://..." node prisma/seed.js
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/              # Protected routes (with sidebar)
│   │   ├── admin/          # Admin panel
│   │   ├── approvals/      # Approval queue
│   │   ├── clubs/          # Club management
│   │   ├── dashboard/      # Role-based dashboard
│   │   ├── events/         # Event CRUD + detail
│   │   ├── notifications/  # Notification center
│   │   ├── quotation-requests/ # Vendor quotations
│   │   ├── vendor-bills/   # Bill processing
│   │   └── vendors/        # Vendor registry
│   ├── api/                # API routes
│   │   ├── auth/           # Login, signup, session
│   │   ├── events/         # Event CRUD + approval
│   │   ├── vendors/        # Vendor management
│   │   └── ...
│   ├── login/              # Public login page
│   ├── signup/             # Public signup page
│   └── vendor-register/    # Public vendor registration
├── components/             # Shared UI components
├── context/                # React context providers
├── lib/                    # Core business logic
│   ├── api.js              # Response helpers
│   ├── approval.js         # Approval engine
│   ├── auth.js             # JWT + password utils
│   ├── constants.js        # Roles, statuses, config
│   ├── prisma.js           # Database client
│   └── ...
└── middleware.js            # Route protection
```

---

## Approval Workflow

```
DRAFT → WAITING_FOR_FACULTY → WAITING_FOR_DEAN → [WAITING_FOR_PRINCIPAL] → [WAITING_FOR_ADMIN] → APPROVED
                                                  ↑ Only if budget > ₹50,000 ↑
```

- **Club events**: Full pipeline (Faculty → Dean → [Principal] → [Admin])
- **Sub-events**: Skip Faculty (Dean → [Principal] → [Admin])
- **Standard events**: Auto-approved (Dean creates directly)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed demo data |
| `npm run db:setup` | Full setup (generate + push + seed) |
| `npm run db:studio` | Open Prisma Studio |
| `npm run lint` | Run ESLint |

---

## License

MIT — See [LICENSE](./LICENSE)
