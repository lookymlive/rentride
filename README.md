<div align="center">

# 🚗 RentIA

### *Movilidad Inteligente - Tu Auto Cuando lo Necesites*

[![Documentation](https://img.shields.io/badge/docs-complete-success?style=for-the-badge)](./docs/INDEX.md)
[![Version](https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge)](./CHANGELOG.md)
[![Status](https://img.shields.io/badge/status-production_ready-success?style=for-the-badge)](./docs/01-product-management/PROJECT_OVERVIEW.md)

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Mantine](https://img.shields.io/badge/Mantine-7.15-339AF0?style=for-the-badge&logo=mantine)](https://mantine.dev/)

**A modern, full-stack car rental platform built with cutting-edge technologies**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🎯 Quick Start

> **New!** Complete professional documentation organized by role:
> - 📊 [**Documentation Index**](./docs/INDEX.md) - Start here for navigation
> - 🎯 [**Project Overview**](./docs/01-product-management/PROJECT_OVERVIEW.md) - Where we came from, where we are, where we're going
> - 📚 [**Documentation Summary**](./DOCUMENTATION_SUMMARY.md) - Executive summary

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**RentIA** es una plataforma moderna de **carsharing inteligente** que proporciona acceso flexible y on-demand a vehículos a través de una experiencia 100% digital y sin contacto. Los usuarios pueden rentar autos por minuto, hora o día desde puntos estratégicos en la ciudad, todo potenciado por inteligencia artificial.

### Key Highlights

- 🚗 **Corporate Fleet**: Own fleet of vehicles (not peer-to-peer)
- 📱 **100% Digital & Contactless**: Everything managed through mobile app
- ⏱️ **Pay-per-Use**: Flexible pricing by minute, hour, or day
- 📍 **Strategic Locations**: Pickup/drop-off at gas stations, malls, airports
- 🔓 **App-Based Unlock**: Unlock vehicles directly from your phone
- 🌍 **Flexible Returns**: Pick up at one location, return at another
- 🔐 **Secure & Verified**: Complete identity and license verification
- ⚡ **Instant Access**: Reserve and start driving in under 5 minutes

---

## ✨ Features

### For Users (Drivers)

- 📱 **Quick Registration & Verification**
  - 5-minute digital signup
  - Identity verification (selfie + ID + license)
  - Secure payment method registration
  - 24-48h approval process
  
- 🗺️ **Find & Reserve Vehicles**
  - Interactive map showing available cars
  - Real-time vehicle availability
  - Filter by type, distance, price
  - 15-minute reservation hold
  
- 🔓 **Contactless Vehicle Access**
  - Unlock car from app (< 30 seconds)
  - Pre-trip photo inspection (5 photos)
  - Automated damage detection
  - GPS navigation integrated

- ⏱️ **Flexible Usage**
  - Pay by minute, hour, or day
  - Pause trip feature (50% rate)
  - Real-time cost tracking
  - Fuel and tolls included

- 📍 **Flexible Drop-off**
  - Return at any green zone
  - Post-trip photo inspection
  - Automatic payment processing
  - Digital receipt & invoice

- 👤 **User Profile & History**
  - Trip history and analytics
  - Payment methods management
  - Membership benefits
  - Referral program

### For Operations (Admin)

- 🚗 **Fleet Management**
  - Real-time vehicle tracking
  - Maintenance scheduling
  - Cleaning coordination
  - Vehicle relocation

- 📊 **Analytics Dashboard**
  - Fleet utilization metrics
  - Revenue per vehicle
  - User behavior analysis
  - Incident tracking

- 👥 **User Management**
  - Verification approvals
  - Support tickets
  - Incident reports
  - Fraud detection

- 📈 **Business Intelligence**
  - Revenue forecasting
  - Demand heatmaps
  - Pricing optimization
  - Operational KPIs

---

## 🛠 Tech Stack

### Frontend

- **Framework**: [Next.js 15](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/) - Type-safe development
- **UI Library**: [Mantine 7.15](https://mantine.dev/) - Modern React components
- **Icons**: [@tabler/icons-react](https://tabler-icons.io/) - Beautiful icon set
- **State Management**: React Context API + [TanStack Query 5](https://tanstack.com/query)
- **Forms**: [Mantine Form](https://mantine.dev/form/use-form/) - Form validation
- **Maps**: [React Leaflet](https://react-leaflet.js.org/) - Interactive maps
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/) - Toast notifications

### Backend & Services

- **Database**: [Supabase](https://supabase.com/) - PostgreSQL database
- **Authentication**: [Supabase Auth](https://supabase.com/auth) - User authentication
- **Storage**: [Cloudinary](https://cloudinary.com/) - Image hosting & optimization
- **API**: Next.js Server Actions & API Routes

### Development Tools

- **Code Quality**: ESLint, Prettier
- **Type Checking**: TypeScript strict mode
- **Version Control**: Git
- **Package Manager**: npm

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
│  Next.js 15 App Router + React 19 + Mantine UI          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js Server (Edge Runtime)               │
│  • Server Actions                                        │
│  • API Routes                                            │
│  • Middleware (Auth)                                     │
└─────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │ Supabase │   │Cloudinary│   │  Leaflet │
    │   Auth   │   │  Images  │   │   Maps   │
    │   DB     │   │          │   │          │
    └──────────┘   └──────────┘   └──────────┘
```

### Design Patterns

- **Feature-Based Structure**: Code organized by features, not file types
- **Server Actions**: Type-safe server mutations
- **Context Providers**: Global state management
- **Custom Hooks**: Reusable logic extraction
- **Component Composition**: Modular, reusable components

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 18.18.0
- **npm**: >= 9.0.0
- **Supabase Account**: [Sign up here](https://supabase.com/)
- **Cloudinary Account**: [Sign up here](https://cloudinary.com/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/lookymlive/rentride.git
cd rentride
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your actual credentials
```

4. **Set up Supabase**

- Create a new project in [Supabase Dashboard](https://app.supabase.com/)
- Run the database migrations (see `/docs/database-schema.md`)
- Copy your project URL and anon key to `.env.local`

5. **Set up Cloudinary**

- Create account at [Cloudinary](https://cloudinary.com/)
- Get your cloud name, API key, and API secret
- Add them to `.env.local`

6. **Run the development server**

```bash
pnpm dev
```

7. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

See `.env.example` for all available options.

---

## 📁 Project Structure

```
rentride/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, signup)
│   │   ├── (main)/            # Main app routes
│   │   ├── (provider)/        # Provider dashboard routes
│   │   ├── api/               # API routes
│   │   └── auth/              # Auth callbacks
│   │
│   ├── actions/               # Server Actions
│   │   ├── cars.actions.ts
│   │   ├── providers.actions.ts
│   │   ├── session.actions.ts
│   │   └── users.actions.ts
│   │
│   ├── components/            # Shared components
│   │   ├── Header/
│   │   ├── Map/
│   │   ├── SearchEngine/
│   │   └── ...
│   │
│   ├── context/               # React Context providers
│   │   ├── AppContext.tsx
│   │   ├── AuthContext.tsx
│   │   ├── CarContext.tsx
│   │   └── ...
│   │
│   ├── features/              # Feature-based modules
│   │   ├── auth/              # Authentication features
│   │   ├── cars/              # Car browsing & details
│   │   ├── landing/           # Landing page
│   │   ├── my-account/        # User account management
│   │   └── providers/         # Provider dashboard
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── models/                # TypeScript types & interfaces
│   ├── services/              # API services
│   ├── data/                  # Static data
│   └── const/                 # Constants
│
├── public/                    # Static assets
├── docs/                      # Documentation
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

---

## 💻 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Type checking
pnpm type-check

# Format code
pnpm format
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Prettier**: Consistent code formatting
- **Naming Conventions**:
  - Components: PascalCase
  - Files: kebab-case or PascalCase for components
  - Variables/Functions: camelCase
  - Constants: UPPER_SNAKE_CASE

### Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit with descriptive messages
4. Push to your branch
5. Create a Pull Request

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com/)
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

See `/docs/deployment.md` for detailed instructions.

---

## 📚 Documentation

Comprehensive documentation organized by role in the `/docs` folder:

### 🎯 For Product Managers
- [Product Vision & Strategy](./docs/01-product-management/PRODUCT_VISION.md)
- [Product Roadmap 2025-2026](./docs/01-product-management/ROADMAP.md)
- [Metrics & KPIs](./docs/01-product-management/METRICS.md)

### 🎨 For Designers & UX
- [User Research & Personas](./docs/02-design-ux/USER_RESEARCH.md)
- [Design System](./docs/02-design-ux/DESIGN_SYSTEM.md)
- [UI Components Guide](./docs/02-design-ux/COMPONENTS.md)

### 💻 For Developers
- [Backend Architecture](./docs/03-development/BACKEND_ARCHITECTURE.md)
- [Backend Refactor Summary](./docs/03-development/BACKEND_REFACTOR_SUMMARY.md)
- [Security Guide](./docs/03-development/SECURITY_GUIDE.md)
- [Best Practices](./docs/03-development/BEST_PRACTICES.md)
- [Database Schema](./docs/03-development/database-schema.md)
- [Supabase Setup](./docs/03-development/SUPABASE_SETUP.md)

### 🧪 For QA & Testing
- [Test Strategy](./docs/04-qa-testing/TEST_STRATEGY.md) 🔜
- [Bug Reporting](./docs/04-qa-testing/BUG_REPORTING.md) 🔜
- [Test Cases](./docs/04-qa-testing/TEST_CASES.md) 🔜

### 🚀 For Operations & DevOps
- [Monitoring & Alerts](./docs/05-operations/MONITORING.md) 🔜
- [Incident Response](./docs/05-operations/INCIDENT_RESPONSE.md) 🔜
- [Infrastructure](./docs/05-operations/INFRASTRUCTURE.md) 🔜

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for details on our code of conduct and development process.

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please open an issue on GitHub with:

- Clear description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Looky M Live**

- GitHub: [@lookymlive](https://github.com/lookymlive)
- Email: lookymlive@gmail.com

---

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) for the amazing framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Mantine](https://mantine.dev/) for the beautiful UI components
- [Vercel](https://vercel.com/) for hosting

---

## 📊 Project Status

**Version**: 2.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: Enero 2025

### Current Phase: Q1 2025 - Foundation & Growth

**Completed**:
- ✅ Core platform (search, booking, profiles)
- ✅ Backend refactorización enterprise-grade
- ✅ Security hardening & optimization
- ✅ Complete documentation by role

**In Progress** (Feb 2025):
- 🔄 Reviews & ratings system
- 🔄 Email notifications
- 🔄 User verification

**Next Up** (Mar 2025):
- 📅 Payment integration (Stripe)
- 📅 Advanced search & filters
- 📅 Analytics dashboard

[View Complete Roadmap →](./docs/01-product-management/ROADMAP.md)

---

<div align="center">

**Made with ❤️ and ☕ by Looky M Live**

⭐ Star this repo if you find it helpful!

</div>