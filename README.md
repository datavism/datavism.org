# 🚀 **DATAVISM.ORG - DEPLOYMENT GUIDE**

## **🎯 QUICK START (5 MINUTEN)**

```bash
# 1. Repository klonen
git clone https://github.com/datavism/datavism.org
cd datavism.org

# 2. Dependencies installieren
npm install

# 3. Supabase Setup (siehe SUPABASE_SETUP.md)
cp .env.example .env.local
# Edit .env.local mit deinen Supabase Keys

# 4. Development starten
npm run dev
```

**✅ Öffne http://localhost:3000**

## **🏗️ FEATURES OVERVIEW**

### **✅ IMPLEMENTED**
- 🔐 **Authentication System** (Supabase Auth)
- 📊 **User Dashboard** mit XP, Level, Progress
- 🎓 **Academy System** mit Week 1 (5 Challenges)
- 🐍 **Python Code Execution** (Pyodide)
- 👥 **Community Features** (Squads, Leaderboard)
- 💾 **Database Integration** (Progress speichern)
- 📱 **Responsive Design** (Mobile ready)
- ⚡ **Real-time Updates** (Live Feed)

### **🔧 TECH STACK**
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Supabase (PostgreSQL + Auth)
- **Code Execution**: Pyodide (Python in Browser)
- **State Management**: Zustand
- **Deployment**: Vercel

## **📁 PROJECT STRUCTURE**

```
datavism.org/
├── app/
│   ├── (authenticated)/          # Protected routes
│   │   ├── dashboard/           # User dashboard
│   │   └── community/           # Community features
│   ├── academy/                 # Academy system
│   ├── auth/                    # Authentication
│   └── layout.tsx              # Root layout
├── components/
│   ├── features/               # Feature components
│   │   ├── academy/           # Academy components
│   │   ├── community/         # Community components
│   │   ├── dashboard/         # Dashboard components
│   │   └── landing/           # Landing page
│   ├── layout/                # Layout components
│   └── ui/                    # Reusable UI
├── lib/
│   ├── hooks/                 # Custom hooks
│   ├── services/              # External services
│   └── store/                 # State management
├── supabase/
│   └── schema.sql             # Database schema
└── types/
    └── database.ts            # TypeScript types
```

## **🔑 ENVIRONMENT VARIABLES**

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## **🚀 DEPLOYMENT**

### **Vercel (Recommended)**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Set Environment Variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_APP_URL

# 5. Deploy to Production
vercel --prod
```

### **Other Platforms**
- **Netlify**: Works out of box
- **Railway**: Perfect for full-stack
- **Cloudflare Pages**: Great performance
- **Self-hosted**: Docker available

## **🗄️ DATABASE SETUP**

1. **Create Supabase Project**: [supabase.com](https://supabase.com)
2. **Run Schema**: Copy `supabase/schema.sql` → SQL Editor → Run
3. **Configure Auth**: Enable Email, set URLs
4. **Test Connection**: Register user, check tables

**➡️ Detailed guide: `SUPABASE_SETUP.md`**

## **🧪 TESTING**

```bash
# Unit Tests
npm run test

# Type Checking
npm run type-check

# Linting
npm run lint

# Build Test
npm run build
```

## **📊 PERFORMANCE TARGETS**

- **Lighthouse Score**: 90+ (all categories)
- **First Load**: < 2s
- **Code Execution**: < 5s (Pyodide startup)
- **Database Queries**: < 500ms
- **Mobile Performance**: 85+

## **🔒 SECURITY**

- ✅ **Row Level Security** (Supabase RLS)
- ✅ **JWT Authentication** 
- ✅ **Environment Variables**
- ✅ **HTTPS Enforcement**
- ✅ **SQL Injection Protection**
- ✅ **XSS Protection**

## **🐛 TROUBLESHOOTING**

### **Common Issues:**

**"Supabase not defined"**
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

**"Table doesn't exist"**
```bash
# Re-run database schema
# Copy supabase/schema.sql to Supabase SQL Editor
```

**"Python execution fails"**
```bash
# Pyodide loading issue - check browser console
# Usually resolves automatically after first load
```

**"Build fails"**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## **📈 MONITORING**

### **Analytics Setup**
- **Supabase**: Built-in database metrics
- **Vercel**: Performance monitoring
- **PostHog**: User analytics (optional)
- **Sentry**: Error tracking (optional)

### **Key Metrics**
- User registrations
- Challenge completions
- Session duration
- Code execution success rate
- Database performance

## **🔄 CI/CD PIPELINE**

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v25
```

## **🎯 SUCCESS METRICS**

### **Week 1 Goals**
- [ ] 100 user registrations
- [ ] 50 Week 1 completions
- [ ] 10 active squads
- [ ] 90% uptime

### **Month 1 Goals**
- [ ] 1,000 users
- [ ] 500 academy graduates
- [ ] 100 investigations started
- [ ] Media coverage

## **🆘 SUPPORT**

- **Documentation**: [docs.datavism.org](https://docs.datavism.org)
- **Discord**: [discord.gg/datavism](https://discord.gg/datavism)
- **Issues**: [GitHub Issues](https://github.com/datavism/datavism.org/issues)
- **Email**: hello@datavism.org

---

## **🎉 READY TO LAUNCH?**

```bash
# Final checklist:
✅ Supabase configured
✅ Environment variables set
✅ Tests passing
✅ Build successful
✅ Database schema deployed
✅ Domain configured
✅ Analytics setup

# Launch command:
vercel --prod
```

**🚀 Welcome to the revolution!** 🔴