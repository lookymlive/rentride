# 🚀 Deployment Guide

## Overview

This guide covers deploying RentRide to production environments. We'll focus on **Vercel** (recommended) but also cover other platforms.

---

## 📋 Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Vercel Deployment](#vercel-deployment)
- [Alternative Platforms](#alternative-platforms)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Post-Deployment](#post-deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All dependencies are up to date
- [ ] Code passes linting (`npm run lint`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables are documented
- [ ] Database migrations are ready
- [ ] Supabase project is set up
- [ ] Cloudinary account is configured
- [ ] Git repository is clean

---

## 🔷 Vercel Deployment (Recommended)

Vercel is the recommended platform as it's built by the Next.js team and offers optimal performance.

### Step 1: Prepare Repository

```bash
# Ensure you're on the main branch
git checkout main

# Push latest changes
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### Step 3: Configure Project

**Framework Preset**: Next.js (auto-detected)

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `.next` (default)
- Install Command: `npm install`

**Root Directory**: `./` (default)

### Step 4: Add Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

**Important**: Add these to all environments (Production, Preview, Development)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Visit your deployment URL

### Step 6: Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate (automatic)

---

## 🌐 Alternative Platforms

### Netlify

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Create `netlify.toml`**:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

3. **Deploy**:
```bash
netlify deploy --prod
```

### Railway

1. Go to [Railway](https://railway.app/)
2. Create new project from GitHub
3. Add environment variables
4. Deploy automatically on push

### AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Connect GitHub repository
3. Configure build settings
4. Add environment variables
5. Deploy

### Docker (Self-Hosted)

**Dockerfile**:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Build and Run**:
```bash
docker build -t rentride .
docker run -p 3000:3000 rentride
```

---

## 🔐 Environment Variables

### Production Variables

Create these in your deployment platform:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_APP_URL=

# Optional
NEXT_PUBLIC_GA_MEASUREMENT_ID=
SENTRY_DSN=
```

### Security Best Practices

1. **Never commit secrets** to Git
2. **Use different keys** for production/staging
3. **Rotate keys** regularly
4. **Limit API key permissions**
5. **Enable rate limiting**

---

## 🗄️ Database Setup

### Supabase Production Database

1. **Create Production Project**:
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Create new project
   - Choose production-ready region

2. **Run Migrations**:
   - Copy SQL from `docs/database-schema.md`
   - Run in Supabase SQL Editor
   - Verify all tables created

3. **Configure RLS**:
   - Enable Row Level Security
   - Apply security policies
   - Test with different user roles

4. **Backup Strategy**:
   - Enable automatic backups (Supabase Pro)
   - Set backup retention period
   - Test restore process

5. **Performance**:
   - Add necessary indexes
   - Enable connection pooling
   - Monitor query performance

---

## 📊 Post-Deployment

### Verification Checklist

- [ ] Homepage loads correctly
- [ ] Authentication works (login/signup)
- [ ] Car search returns results
- [ ] Images load from Cloudinary
- [ ] Booking flow completes
- [ ] Provider dashboard accessible
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] Environment variables loaded
- [ ] No console errors

### Performance Testing

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=https://your-domain.com
```

**Target Scores**:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

### SEO Setup

1. **Verify `robots.txt`**:
```txt
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
```

2. **Generate Sitemap**:
```typescript
// app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: 'https://your-domain.com',
      lastModified: new Date(),
    },
    {
      url: 'https://your-domain.com/cars',
      lastModified: new Date(),
    },
    // Add more URLs
  ];
}
```

3. **Add Analytics**:
```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  )
}
```

---

## 📈 Monitoring

### Error Tracking (Sentry)

1. **Install Sentry**:
```bash
npm install @sentry/nextjs
```

2. **Configure**:
```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Uptime Monitoring

Recommended services:
- [UptimeRobot](https://uptimerobot.com/) (Free)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

### Performance Monitoring

- **Vercel Analytics**: Built-in (enable in dashboard)
- **Google Analytics**: User behavior tracking
- **Supabase Dashboard**: Database performance

---

## 🐛 Troubleshooting

### Build Failures

**Issue**: Build fails with TypeScript errors

**Solution**:
```bash
# Fix locally first
npm run type-check
npm run lint
npm run build
```

**Issue**: Out of memory during build

**Solution**: Increase Node memory
```json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

### Runtime Errors

**Issue**: Environment variables not loaded

**Solution**:
- Verify variables in platform dashboard
- Ensure `NEXT_PUBLIC_` prefix for client-side vars
- Redeploy after adding variables

**Issue**: Database connection fails

**Solution**:
- Check Supabase project status
- Verify API keys are correct
- Check RLS policies

**Issue**: Images not loading

**Solution**:
- Verify Cloudinary credentials
- Check `next.config.js` image domains
- Ensure images are public

### Performance Issues

**Issue**: Slow page loads

**Solution**:
- Enable Next.js caching
- Optimize images (use Next.js Image)
- Implement code splitting
- Use CDN for static assets

**Issue**: High database latency

**Solution**:
- Add database indexes
- Enable connection pooling
- Use Supabase Edge Functions
- Implement caching layer (Redis)

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Web.dev Performance Guide](https://web.dev/performance/)

---

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Analytics integrated
- [ ] Error tracking setup
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Performance optimized
- [ ] SEO configured
- [ ] Documentation updated
