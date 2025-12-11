<div align="center">

# ✅ TaskFlow

### *A Modern Task Management Application*

A beautiful, full-stack task management application built with cutting-edge web technologies. Stay organized, boost productivity, and manage your tasks with an intuitive, responsive interface.

[![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

[Live Demo](https://taskflow-manager-app.vercel.app/) • [Report Bug](https://github.com/h-yzeng/TaskFlow/issues) • [Request Feature](https://github.com/h-yzeng/TaskFlow/issues)

</div>

---

## ✨ Features

- **🎨 Modern UI** - Beautiful, responsive design with dark mode support
- **🔐 Authentication** - Secure GitHub OAuth authentication
- **📊 Task Dashboard** - Overview with stats, filters, and search
- **📝 Full CRUD** - Create, read, update, and delete tasks
- **🏷️ Categories & Labels** - Organize tasks with categories and labels
- **⚡ Real-time Updates** - Optimistic UI updates with Framer Motion animations
- **📱 Mobile Friendly** - Fully responsive design for all devices
- **🌓 Dark Mode** - System-aware theme with manual toggle

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15.1 (App Router, Turbopack) |
| **Frontend** | React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4, CSS Variables |
| **Components** | Radix UI (shadcn-style components) |
| **Animation** | Framer Motion 11 |
| **Database** | Neon PostgreSQL (Serverless) |
| **ORM** | Drizzle ORM |
| **Authentication** | NextAuth.js v5 (Auth.js) |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm
- A [Neon](https://neon.tech) PostgreSQL database
- A [GitHub OAuth App](https://github.com/settings/developers)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/h-yzeng/TaskFlow.git
   cd TaskFlow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables in `.env`:

   ```env
   # Database (Neon PostgreSQL)
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # GitHub OAuth
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"
   ```

4. **Set up the database**

   Push the database schema to Neon:

   ```bash
   npm run db:push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000) in your browser

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: TaskFlow
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and generate a Client Secret
5. Add them to your `.env` file

## 📁 Project Structure

```plaintext
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── tasks/         # Task CRUD endpoints
│   ├── auth/              # Auth pages (signin)
│   ├── tasks/             # Task pages
│   │   ├── [id]/          # Task detail & edit
│   │   └── new/           # New task form
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── layout/            # Layout components (header)
│   ├── providers/         # Context providers
│   ├── tasks/             # Task components
│   └── ui/                # shadcn-style UI components
├── lib/
│   ├── db/               # Database (Drizzle + Neon)
│   │   ├── index.ts      # Database connection
│   │   └── schema.ts     # Database schema
│   ├── auth.ts           # NextAuth configuration
│   └── utils.ts          # Utility functions
└── types.ts              # TypeScript types
```

## 🗄️ Database Schema

```typescript
// Users - Authenticated users via GitHub
users: { id, name, email, image, githubId, createdAt, updatedAt }

// Tasks - Main task items
tasks: { id, title, description, priority, completed, dueDate, 
         completedAt, categoryId, position, userId, createdAt, updatedAt }

// Categories - Task organization
categories: { id, name, color, icon, userId, createdAt, updatedAt }

// Labels - Tags for tasks (many-to-many)
labels: { id, name, color, userId, createdAt }
taskLabels: { taskId, labelId }
```

## 🎨 UI Components

The app uses a custom component library inspired by shadcn/ui:

- **Button** - Multiple variants (default, outline, ghost, etc.)
- **Card** - Content containers with header/footer
- **Dialog** - Modal dialogs
- **Dropdown Menu** - Context menus
- **Input/Textarea** - Form inputs
- **Select** - Dropdown selects
- **Checkbox** - Toggle checkboxes
- **Badge** - Status/priority badges
- **Tooltip** - Hover tooltips
- **Skeleton** - Loading placeholders

## 📝 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/[id]` | Get single task |
| PUT | `/api/tasks/[id]` | Update a task |
| DELETE | `/api/tasks/[id]` | Delete a task |
| PUT | `/api/tasks/update` | Batch update tasks |
| GET | `/api/tasks/stats` | Get task statistics |

## 🌐 Deployment

The app is deployed on Vercel with automatic CI/CD. Every push to `main` triggers a new deployment.

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📄 License

MIT License - feel free to use this project for learning or as a base for your own applications.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Radix UI](https://radix-ui.com/) - Headless UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Neon](https://neon.tech/) - Serverless Postgres
- [Auth.js](https://authjs.dev/) - Authentication
- [Framer Motion](https://www.framer.com/motion/) - Animations
