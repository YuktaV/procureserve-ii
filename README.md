# ProcureServe II (PSII)
## Next-Generation Staffing Platform

**Architecture:** Supabase + SvelteKit + Vercel

### 🏗️ Project Structure
- `apps/customer-app/` - Customer-facing application (app.procureserve.com)
- `apps/console-app/` - Internal operations console (console.procureserve.com)
- `supabase/` - Shared backend services and database
- `packages/` - Shared TypeScript packages
- `docs/` - Project documentation

### 🚀 Quick Start
1. Set up Supabase backend: `cd supabase && supabase start`
2. Install customer app: `cd apps/customer-app && npm install`
3. Install console app: `cd apps/console-app && npm install`
4. Run development: `npm run dev` in each app directory

### 📋 Key Improvements from PSI
- ✅ Eliminated circular auth issues with Supabase Auth
- ✅ Configurable enums via console (no hardcoded values)
- ✅ Clean modular architecture (components <50 lines)
- ✅ Cost-effective Supabase + Vercel stack
- ✅ Open-source first approach

### 🔧 Tech Stack
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions + Storage)
- **Frontend:** SvelteKit with TypeScript
- **Hosting:** Vercel (both applications)
- **AI:** pgvector + OpenAI integration
- **Styling:** Tailwind CSS
