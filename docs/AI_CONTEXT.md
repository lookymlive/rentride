# 🤖 AI Context - RentIA Project

**Purpose**: Contexto completo para futuras interacciones con IA  
**Version**: 2.0.0  
**Last Updated**: Enero 2025

---

## 📌 Quick Reference for AI

### Project Identity
- **Name**: RentIA
- **Type**: Carsharing inteligente con flota propia
- **Market**: Latin America (starting Argentina)
- **Stage**: Production Ready, Pre-launch
- **Version**: 2.0.0

### Tech Stack (Current)
```
Frontend: Next.js 15.1 + React 19 + TypeScript 5.7
UI: Mantine 7.15
Backend: Next.js Server Actions + Supabase
Database: PostgreSQL (Supabase)
Auth: Supabase Auth
Storage: Cloudinary
Maps: Leaflet
Deployment: Vercel
```

### Project Status
- ✅ **Code**: Production-ready, enterprise-grade
- ✅ **Security**: Hardened, validated
- ✅ **Documentation**: Complete (8,000+ lines)
- ⏳ **Launch**: Q1 2025 (Feb-Mar)
- ⏳ **Payments**: Pending Stripe integration
- ⏳ **Reviews**: Pending implementation

---

## 📚 Documentation Structure

### Master Index
**START HERE**: [`docs/INDEX.md`](./docs/INDEX.md)

### By Role

**Product Management** (`docs/01-product-management/`)
- `PROJECT_OVERVIEW.md` - Historia, estado actual, visión futura ⭐
- `PRODUCT_VISION.md` - Vision, OKRs, personas, business model
- `ROADMAP.md` - Timeline 2025-2026, priorización RICE

**Design & UX** (`docs/02-design-ux/`)
- Estructura creada, docs pendientes Q1 2025
- Necesita: UX Designer hire

**Development** (`docs/03-development/`)
- `BACKEND_ARCHITECTURE.md` - Arquitectura completa ⭐
- `API_REFERENCE.md` - Todas las APIs documentadas ⭐
- `SECURITY_GUIDE.md` - Best practices de seguridad ⭐
- `BEST_PRACTICES.md` - Code standards ⭐
- `database-schema.md` - Schema completo
- `SUPABASE_SETUP.md` - Setup guide

**QA & Testing** (`docs/04-qa-testing/`)
- `TESTING_GUIDE.md` - Testing guidelines
- Otros docs pendientes Q1 2025

**Operations** (`docs/05-operations/`)
- `deployment.md` - Deployment guide
- Otros docs pendientes Q2 2025

---

## 🎯 Project Timeline

### Past (Q4 2024)
- Oct-Dec: Initial development (v0.1 → v1.0)
- MVP funcional pero con deuda técnica

### Present (Q1 2025 - Enero)
- ✅ Refactorización completa (v1.0 → v2.0)
- ✅ Security hardening
- ✅ Documentation sprint
- ✅ Production ready

### Near Future (Q1 2025 - Feb-Mar)
- 🎯 Reviews system
- 🎯 Email notifications
- 🎯 User verification
- 🎯 Stripe integration
- 🎯 Launch in Buenos Aires

### Future (Q2-Q4 2025)
- Q2: Growth & monetization, 3 countries
- Q3: Mobile apps, real-time chat
- Q4: AI features, marketplace

---

## 🔑 Key Concepts

### Business Model
- **Revenue**: 15-20% commission per booking
- **Target GMV Q1**: $5,000
- **Target GMV Q4**: $50,000
- **Unit Economics**: $10.80 margin per transaction

### User Roles
1. **Customer (Renter)**: Busca y alquila vehículos
2. **Provider (Host)**: Lista y gestiona vehículos

### Core Features
- Search & filters (location, type, price, dates)
- Booking system (request → approve → complete)
- User/Provider profiles
- Dashboard (provider)
- Image management
- Maps integration

### Missing for Launch
- ❌ Payment system (Stripe)
- ❌ Reviews & ratings
- ❌ Email notifications
- ❌ User verification
- ❌ Insurance partnerships

---

## 🏗️ Architecture Summary

### Layers
1. **Presentation**: Pages, Components (React 19)
2. **Application**: Server Actions, API Routes
3. **Business Logic**: Services, Validators
4. **Data Access**: Supabase Client
5. **Database**: PostgreSQL (Supabase)

### Key Patterns
- Server Components (default)
- Server Actions for mutations
- Client Components only when needed
- Row Level Security (RLS)
- Type-safe with TypeScript strict mode

### Security
- ✅ Always use `getUser()` not `getSession()`
- ✅ Validate on server, never trust client
- ✅ Sanitize all inputs
- ✅ RLS policies on all tables
- ✅ Environment variables secured

---

## 📊 Metrics & Goals

### North Star Metric
**GMV** (Gross Merchandise Value): Total booking value

### Q1 2025 Goals
- 100 vehicles listed
- 500 registered users
- 50 completed bookings
- $5,000 GMV
- NPS > 50

### Q4 2025 Goals
- 800 vehicles
- 5,000 users
- 500 bookings
- $50,000 GMV
- NPS > 60

---

## 🚨 Important Conventions

### Code
- **Server Actions**: `verbNoun()` - e.g., `getSession()`
- **Client Services**: `verbNounAsync()` - e.g., `getAllCountriesAsync()`
- **Validators**: `validateNoun()` - e.g., `validateEmail()`
- **Components**: PascalCase
- **Files**: kebab-case or PascalCase

### Git
- **Commits**: Semantic (feat:, fix:, docs:, refactor:, etc.)
- **Branches**: feature/, fix/, hotfix/
- **PRs**: Template with checklist

### Documentation
- **Format**: Markdown
- **Style**: Clear, concise, with examples
- **Review**: Quarterly
- **Owner**: Each doc has owner

---

## 🎯 Current Priorities (Feb 2025)

### Sprint 1-2 (Weeks 1-2)
1. **Reviews System** (High Priority)
   - Bidirectional reviews
   - Star ratings (1-5)
   - Moderation
   - Impact: +40% trust

2. **Email Notifications** (High Priority)
   - Booking confirmations
   - Reminders
   - Status updates
   - Impact: -30% no-shows

### Sprint 3-4 (Weeks 3-4)
3. **User Verification** (High Priority)
   - Document upload
   - Manual verification
   - Verification badges
   - Impact: -60% fraud

4. **Stripe Integration** (Critical)
   - Card payments
   - Installments
   - Refunds
   - Impact: Enable monetization

---

## 🤝 Team

### Current (Enero 2025)
- **1 Person**: Looky M Live (Founder)
  - Product Management (40%)
  - Development (50%)
  - Operations (10%)

### Needed (Q1-Q2 2025)
- UX/UI Designer (Q1)
- Frontend Developer (Q1)
- Customer Support (Q2)
- Backend Developer (Q2)
- QA Engineer (Q2)

---

## 💡 Common Tasks for AI

### When Asked About Architecture
→ Reference: `docs/BACKEND_ARCHITECTURE.md`

### When Asked About APIs
→ Reference: `docs/API_REFERENCE.md`

### When Asked About Security
→ Reference: `docs/SECURITY_GUIDE.md`
→ Always use `getUser()` not `getSession()`

### When Asked About Roadmap
→ Reference: `docs/01-product-management/ROADMAP.md`

### When Asked About Business
→ Reference: `docs/01-product-management/PRODUCT_VISION.md`

### When Asked "Where are we?"
→ Reference: `docs/01-product-management/PROJECT_OVERVIEW.md`

### When Adding Features
1. Check roadmap priority
2. Follow best practices
3. Add tests
4. Update documentation
5. Consider security implications

### When Fixing Bugs
1. Identify root cause
2. Add logging
3. Fix upstream, not downstream
4. Add regression test
5. Update docs if needed

---

## 🔍 File Locations

### Key Files
```
/README.md - Project overview
/DOCUMENTATION_SUMMARY.md - Doc summary
/BACKEND_REFACTOR_SUMMARY.md - Refactor details
/AI_CONTEXT.md - This file

/docs/INDEX.md - Documentation index
/docs/01-product-management/ - Product docs
/docs/02-design-ux/ - Design docs
/docs/03-development/ - Dev docs
/docs/04-qa-testing/ - QA docs
/docs/05-operations/ - Ops docs

/src/actions/ - Server Actions
/src/services/ - Client Services
/src/lib/ - Utilities (supabase-server, error-handler, validators)
/src/app/ - Next.js pages
/src/components/ - React components
/src/features/ - Feature modules
```

### Important Utilities
```
/src/lib/supabase-server.ts - Server client helper
/src/lib/error-handler.ts - Error handling system
/src/lib/validators.ts - Validation functions
```

---

## ⚠️ Critical Reminders

### Security
1. **NEVER** use `getSession()` - always `getUser()`
2. **ALWAYS** validate on server
3. **ALWAYS** sanitize inputs
4. **NEVER** expose secrets in client code

### Code Quality
1. Follow TypeScript strict mode
2. Use existing helpers (don't duplicate)
3. Add JSDoc comments
4. Handle errors properly
5. Log with structured format `[functionName] Context:`

### Documentation
1. Update docs when changing features
2. Keep examples up to date
3. Link related documents
4. Mark deprecated features

---

## 📞 Contact

**Founder**: Looky M Live  
**Email**: lookymlive@gmail.com  
**GitHub**: @lookymlive

---

## 🎓 Learning Resources

### Official Docs
- [Next.js 15](https://nextjs.org/docs)
- [React 19](https://react.dev)
- [Supabase](https://supabase.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Project Docs
- Start: `docs/INDEX.md`
- Overview: `docs/01-product-management/PROJECT_OVERVIEW.md`
- Architecture: `docs/BACKEND_ARCHITECTURE.md`

---

## 🔄 Document Maintenance

**This document should be updated when**:
- Major version changes
- Architecture changes
- Team changes
- Priority shifts
- New documentation added

**Last Review**: Enero 2025  
**Next Review**: Marzo 2025  
**Owner**: Product Management

---

**Remember**: This is a living document. Keep it updated for future AI interactions! 🤖✨
