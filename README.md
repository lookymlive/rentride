<div align="center">

# 🚗 Car Go Rentals

### *Hop in, Ride On - Rent Cars Anywhere*

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Mantine](https://img.shields.io/badge/Mantine-7.15-339AF0?style=for-the-badge&logo=mantine)](https://mantine.dev/)

**A modern, full-stack car rental platform built with cutting-edge technologies**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

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

**Car Go Rentals** is a comprehensive car rental platform that connects vehicle owners (providers) with customers looking to rent cars. Built with modern web technologies, it offers a seamless experience for both renters and providers.

### Key Highlights

- 🎯 **Dual User Roles**: Separate interfaces for customers and car providers
- 🔐 **Secure Authentication**: Powered by Supabase Auth with email verification
- 🗺️ **Location-Based Search**: Find cars by country and region
- 📅 **Smart Booking System**: Date-based availability and booking management
- 📸 **Image Management**: Cloudinary integration for optimized image delivery
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- ⚡ **Performance Optimized**: Built with Next.js 15 App Router for maximum speed

---

## ✨ Features

### For Customers

- 🔍 **Advanced Search & Filters**
  - Search by location (country/region)
  - Filter by car type, price range, year, transmission, fuel type
  - Date-based availability checking
  
- 🚘 **Car Browsing**
  - Detailed car listings with multiple images
  - Comprehensive car specifications
  - Real-time availability status
  - Interactive map integration
  
- 📝 **Booking Management**
  - Easy booking process
  - Booking history and status tracking
  - Price calculation based on rental period

- 👤 **User Profile**
  - Personal information management
  - Avatar upload
  - Booking history

### For Providers

- 🏢 **Provider Dashboard**
  - Company profile management
  - Business registration details
  - Location management with map integration

- 🚗 **Fleet Management**
  - Add/Edit/Delete vehicles
  - Upload multiple car images
  - Set pricing and rental periods
  - Manage car availability status

- 📊 **Booking Management**
  - View incoming booking requests
  - Approve/Reject bookings
  - Track booking status
  - Manage active rentals

- 📈 **Business Tools**
  - Overview of all vehicles
  - Booking statistics
  - Revenue tracking (coming soon)

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
git clone https://github.com/lookymlive/car-go-rentals.git
cd car-go-rentals
```

2. **Install dependencies**

```bash
npm install
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
npm run dev
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
car-go-rentals/
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
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
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

Comprehensive documentation is available in the `/docs` folder:

- [Database Schema](./docs/database-schema.md) - Supabase database structure
- [API Reference](./docs/api-reference.md) - Server Actions & API routes
- [Component Guide](./docs/components.md) - Reusable components
- [State Management](./docs/state-management.md) - Context & hooks
- [Deployment Guide](./docs/deployment.md) - Production deployment
- [Troubleshooting](./docs/troubleshooting.md) - Common issues

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

**Version**: 1.0.0  
**Status**: Active Development  
**Last Updated**: January 2025

### Roadmap

- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Reviews & ratings system
- [ ] Insurance options
- [ ] Real-time chat support

---

<div align="center">

**Made with ❤️ and ☕ by Looky M Live**

⭐ Star this repo if you find it helpful!

</div>