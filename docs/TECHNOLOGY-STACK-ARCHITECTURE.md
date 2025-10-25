# 🏗️ TECHNOLOGY STACK & ARCHITECTURE
## Complete Technical Specification for DATAVISM

---

## 📋 Executive Summary

This document provides the complete technical architecture for DATAVISM, detailing every component from frontend to infrastructure, chosen for:
- **Rapid development** (launch in 3-6 months)
- **Scalability** (1 user to 1M+ users)
- **Developer experience** (modern, well-documented tools)
- **Cost efficiency** (minimize infrastructure costs)
- **Reliability** (99.9% uptime target)

---

## 🎯 Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Web App          Mobile Apps         VR App                │
│  (Next.js)        (React Native)      (Unity/Unreal)        │
└────────┬──────────────────┬────────────────────┬────────────┘
         │                  │                    │
         └──────────────────┴────────────────────┘
                            │
                   ┌────────▼────────┐
                   │   CDN/Edge      │
                   │  (Cloudflare)   │
                   └────────┬────────┘
                            │
         ┌──────────────────┴──────────────────┐
         │                                     │
┌────────▼────────┐                  ┌────────▼────────┐
│  NEXT.JS APP    │                  │   API LAYER     │
│   (Vercel)      │◄─────────────────│  (Supabase)     │
└────────┬────────┘                  └────────┬────────┘
         │                                     │
         │                            ┌────────▼────────┐
         │                            │   POSTGRESQL    │
         │                            │   (Supabase)    │
         │                            └────────┬────────┘
         │                                     │
┌────────▼────────┐                  ┌────────▼────────┐
│  STATIC ASSETS  │                  │  BLOB STORAGE   │
│   (Vercel)      │                  │  (Supabase)     │
└─────────────────┘                  └─────────────────┘
         │                                     │
┌────────▼────────────────────────────────────▼────────┐
│              SERVICES LAYER                           │
├───────────────────────────────────────────────────────┤
│  Auth  │  Realtime  │  Functions  │  Vector  │  ML   │
│ (Supa) │  (Supa)    │  (Supa)     │ (Supa)   │(Ext)  │
└───────────────────────────────────────────────────────┘
         │                                     │
┌────────▼────────────────────────────────────▼────────┐
│           EXTERNAL INTEGRATIONS                       │
├───────────────────────────────────────────────────────┤
│ Pyodide │ Stripe │ APIs │ Analytics │ Email │ Video  │
└───────────────────────────────────────────────────────┘
```

---

## 💻 FRONTEND STACK

### Primary Web Application

**Framework: Next.js 15 (App Router)**

```typescript
// Tech Stack Configuration
const frontendStack = {
  framework: "Next.js 15.5.0",
  runtime: "React 19",
  language: "TypeScript 5.x",

  styling: {
    framework: "Tailwind CSS 3.4+",
    animations: "Framer Motion 11.x",
    utilities: "clsx, tailwind-merge"
  },

  stateManagement: {
    client: "Zustand 5.x",
    server: "React Server Components",
    async: "TanStack Query 5.x"
  },

  forms: {
    library: "React Hook Form 7.x",
    validation: "Zod 3.x"
  },

  codeEditor: {
    primary: "Monaco Editor (VS Code engine)",
    syntax: "Prism.js for highlighting",
    themes: "Custom DATAVISM themes"
  },

  icons: {
    library: "Lucide React",
    custom: "SVG components"
  },

  dataViz: {
    charting: "Recharts / Visx",
    3d: "Three.js / React Three Fiber",
    maps: "Mapbox GL JS"
  }
};
```

**Key Features:**
- **Server-Side Rendering (SSR)** for SEO and performance
- **Static Generation** for marketing pages
- **Client-Side Rendering** for interactive challenges
- **Streaming SSR** for progressive loading
- **Edge Runtime** where possible for low latency

**File Structure:**
```
app/
├── (marketing)/              # Public pages
│   ├── page.tsx             # Landing page
│   ├── about/
│   └── pricing/
├── (auth)/                   # Authentication flows
│   ├── login/
│   ├── signup/
│   └── callback/
├── (authenticated)/          # Protected routes
│   ├── dashboard/
│   ├── bootcamp/
│   │   └── level/
│   │       └── [id]/
│   ├── community/
│   └── profile/
├── api/                      # API routes
│   ├── webhooks/
│   └── trpc/
└── globals.css              # Global styles

components/
├── ui/                       # Reusable UI components
│   ├── button.tsx
│   ├── input.tsx
│   └── ...
├── features/                 # Feature-specific components
│   ├── bootcamp/
│   │   ├── ChallengeCard.tsx
│   │   ├── CodeEditor.tsx
│   │   └── Level1Experience.tsx
│   ├── dashboard/
│   └── community/
└── layouts/                  # Layout components

lib/
├── api/                      # API clients
├── hooks/                    # Custom React hooks
├── services/                 # Business logic
├── store/                    # Zustand stores
├── utils/                    # Utilities
└── types/                    # TypeScript types
```

### Mobile Applications

**Framework: React Native (Future)**

```yaml
mobile_stack:
  framework: "React Native"
  navigation: "React Navigation"
  state: "Zustand (shared with web)"
  ui: "React Native Paper + custom"

  platforms:
    ios: "iOS 14+"
    android: "Android 10+"

  features:
    - "AR camera integration"
    - "Push notifications"
    - "Offline mode"
    - "Native code editors"
```

### VR Application

**Platform: Unity / Unreal (Future)**

```yaml
vr_stack:
  engine: "Unity 2023 LTS"
  language: "C#"
  vr_sdk: "XR Interaction Toolkit"

  platforms:
    - "Meta Quest 2/3"
    - "PCVR (SteamVR)"

  features:
    - "3D data visualization"
    - "VR code editing"
    - "Multiplayer squad rooms"
    - "Boss battle arenas"
```

---

## 🔧 BACKEND STACK

### Primary Backend: Supabase

**Why Supabase:**
- PostgreSQL database (industry standard)
- Built-in authentication
- Real-time subscriptions
- Row-level security
- Edge functions
- Storage
- Vector embeddings
- Open source (can self-host if needed)

```typescript
const backendStack = {
  database: {
    engine: "PostgreSQL 15",
    orm: "Supabase Client (built on PostgREST)",
    migrations: "Supabase Migrations",
    backups: "Daily automated (Supabase Pro)"
  },

  authentication: {
    provider: "Supabase Auth",
    methods: [
      "Email/Password",
      "Magic Links",
      "OAuth (Google, GitHub, Discord)"
    ],
    sessions: "JWT tokens",
    security: "Row Level Security (RLS)"
  },

  realtime: {
    technology: "Supabase Realtime",
    protocol: "WebSocket",
    uses: [
      "Squad chat",
      "Live leaderboards",
      "Collaborative coding",
      "Global events"
    ]
  },

  storage: {
    provider: "Supabase Storage",
    buckets: [
      "avatars (public)",
      "evidence (private)",
      "datasets (authenticated)",
      "generated-content (private)"
    ],
    cdn: "Integrated CDN"
  },

  functions: {
    runtime: "Deno (Supabase Edge Functions)",
    language: "TypeScript",
    uses: [
      "Webhooks processing",
      "Scheduled jobs",
      "Complex business logic",
      "Third-party API integrations"
    ]
  },

  vector: {
    engine: "pgvector extension",
    uses: [
      "Semantic search",
      "Content recommendations",
      "Investigation similarity"
    ]
  }
};
```

### Database Schema

**Core Tables:**

```sql
-- Users and Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,

  -- Progress
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  reputation INTEGER DEFAULT 0,

  -- Stats
  investigations_count INTEGER DEFAULT 0,
  challenges_completed INTEGER DEFAULT 0,
  squad_id UUID REFERENCES squads(id),

  -- Metadata
  achievements JSONB DEFAULT '[]'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress Tracking
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  level_id INTEGER NOT NULL,

  -- Completion
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  attempts INTEGER DEFAULT 0,

  -- Code
  code_content TEXT,
  xp_earned INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, challenge_id)
);

-- Squads
CREATE TABLE squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('strike', 'research', 'liberation')),

  -- Members
  creator_id UUID REFERENCES profiles(id),
  member_count INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 50,

  -- Stats
  investigations_completed INTEGER DEFAULT 0,
  territories_liberated INTEGER DEFAULT 0,
  reputation INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Squad Membership
CREATE TABLE squad_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(squad_id, user_id)
);

-- Investigations
CREATE TABLE investigations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,

  -- Leadership
  lead_investigator_id UUID REFERENCES profiles(id),
  squad_id UUID REFERENCES squads(id),

  -- Status
  status TEXT DEFAULT 'active',
  progress INTEGER DEFAULT 0,

  -- Results
  findings JSONB DEFAULT '{}'::jsonb,
  evidence JSONB DEFAULT '[]'::jsonb,
  impact_score INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Evidence Vault
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investigation_id UUID REFERENCES investigations(id),
  discoverer_id UUID REFERENCES profiles(id),

  -- Evidence
  type TEXT NOT NULL,
  data JSONB NOT NULL,
  hash TEXT UNIQUE, -- For blockchain verification

  -- Validation
  verified BOOLEAN DEFAULT FALSE,
  verification_count INTEGER DEFAULT 0,
  credibility_score FLOAT DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, achievement_id)
);

-- Leaderboards
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  leaderboard_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  rank INTEGER,
  period TEXT, -- 'all-time', 'monthly', 'weekly'

  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, leaderboard_type, period)
);
```

**Indexes:**

```sql
-- Performance indexes
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_challenge ON progress(challenge_id);
CREATE INDEX idx_squad_members_squad ON squad_members(squad_id);
CREATE INDEX idx_squad_members_user ON squad_members(user_id);
CREATE INDEX idx_investigations_status ON investigations(status);
CREATE INDEX idx_leaderboard_type_period ON leaderboard_entries(leaderboard_type, period, score DESC);
```

**Row Level Security:**

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Squad policies
CREATE POLICY "Anyone can view public squads"
  ON squads FOR SELECT
  USING (true);

CREATE POLICY "Squad members can view squad details"
  ON squad_members FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM squad_members WHERE squad_id = squad_members.squad_id
    )
  );
```

---

## 🐍 PYTHON EXECUTION ENGINE

### Pyodide Integration

**Architecture:**

```typescript
// Pyodide Service
class PyodideService {
  private pyodide: any;
  private loadingPromise: Promise<void> | null = null;

  // Multiple CDN fallbacks for reliability
  private CDN_URLS = [
    'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
    'https://unpkg.com/pyodide@0.24.1/dist/',
    'https://pyodide-cdn2.iodide.io/v0.24.1/full/'
  ];

  async initialize(): Promise<void> {
    if (this.pyodide) return;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = this.loadPyodide();
    await this.loadingPromise;
  }

  private async loadPyodide(): Promise<void> {
    // Try CDNs in sequence
    for (const url of this.CDN_URLS) {
      try {
        this.pyodide = await loadPyodide({
          indexURL: url
        });

        // Load essential packages
        await this.pyodide.loadPackage([
          'numpy',
          'pandas',
          'matplotlib'
        ]);

        // Install resistance toolkit
        await this.installResistanceToolkit();

        return;
      } catch (error) {
        console.warn(`Failed to load from ${url}`, error);
      }
    }

    throw new Error('All Pyodide CDNs failed');
  }

  private async installResistanceToolkit(): Promise<void> {
    // Custom functions for challenges
    await this.pyodide.runPython(`
import pandas as pd
import numpy as np

# Resistance Toolkit Functions
def calculate_digital_footprint(posts_per_day, years):
    total_posts = posts_per_day * 365 * years
    data_points = total_posts * 50  # avg data points per post
    return {
        'total_posts': total_posts,
        'data_points': data_points,
        'hours_stolen': total_posts * 2 / 60
    }

def generate_liberation_code(evidence):
    import hashlib
    evidence_str = str(evidence)
    return hashlib.sha256(evidence_str.encode()).hexdigest()[:16]
    `);
  }

  async executeCode(code: string): Promise<ExecutionResult> {
    try {
      // Capture stdout
      await this.pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);

      // Execute user code
      await this.pyodide.runPython(code);

      // Get output
      const output = await this.pyodide.runPython(`
sys.stdout.getvalue()
      `);

      // Get variables
      const variables = await this.pyodide.globals.toJs();

      return {
        success: true,
        output,
        variables: Object.fromEntries(variables),
        error: null
      };

    } catch (error) {
      return {
        success: false,
        output: '',
        variables: {},
        error: error.message
      };
    }
  }
}
```

**Security Considerations:**

```typescript
// Code execution sandbox
class SecurePyodide extends PyodideService {
  private FORBIDDEN_IMPORTS = [
    'os',
    'subprocess',
    'sys.exit',
    'open',  // File system access
    '__import__'
  ];

  async executeCode(code: string): Promise<ExecutionResult> {
    // Check for forbidden operations
    if (this.containsForbiddenCode(code)) {
      return {
        success: false,
        output: '',
        variables: {},
        error: 'Forbidden operation detected'
      };
    }

    // Timeout protection
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Execution timeout')), 30000)
    );

    try {
      const result = await Promise.race([
        super.executeCode(code),
        timeout
      ]);

      return result;
    } catch (error) {
      return {
        success: false,
        output: '',
        variables: {},
        error: error.message
      };
    }
  }

  private containsForbiddenCode(code: string): boolean {
    return this.FORBIDDEN_IMPORTS.some(forbidden =>
      code.includes(forbidden)
    );
  }
}
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Supabase Auth Configuration

```typescript
// Auth setup
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// Auth providers
const authProviders = {
  email: {
    enabled: true,
    confirmEmail: true,
    securePasswordReset: true
  },

  oauth: {
    google: {
      enabled: true,
      scopes: ['email', 'profile']
    },
    github: {
      enabled: true,
      scopes: ['user:email']
    },
    discord: {
      enabled: true,
      scopes: ['identify', 'email']
    }
  },

  magicLink: {
    enabled: true,
    redirectTo: '/auth/callback'
  }
};
```

### Middleware for Route Protection

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/bootcamp') ||
      req.nextUrl.pathname.startsWith('/community')) {

    if (!session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/bootcamp/:path*',
    '/community/:path*',
  ],
};
```

---

## 💳 PAYMENTS & SUBSCRIPTIONS

### Stripe Integration

```typescript
// Stripe setup
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Product configuration
const products = {
  premium_monthly: {
    price_id: 'price_xxx',
    amount: 999, // $9.99
    interval: 'month'
  },
  premium_yearly: {
    price_id: 'price_yyy',
    amount: 9900, // $99.00
    interval: 'year'
  }
};

// Checkout session creation
async function createCheckoutSession(userId: string, priceId: string) {
  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    client_reference_id: userId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    subscription_data: {
      metadata: {
        userId: userId,
      },
    },
  });

  return session;
}

// Webhook handler
export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      // Activate subscription
      await activateSubscription(event.data.object);
      break;

    case 'customer.subscription.updated':
      // Update subscription status
      await updateSubscription(event.data.object);
      break;

    case 'customer.subscription.deleted':
      // Cancel subscription
      await cancelSubscription(event.data.object);
      break;
  }
}
```

---

## 📊 ANALYTICS & MONITORING

### Analytics Stack

```yaml
analytics:
  product:
    tool: "PostHog (self-hosted)"
    features:
      - "Event tracking"
      - "User flows"
      - "Feature flags"
      - "A/B testing"
      - "Session replay"

  performance:
    tool: "Vercel Analytics"
    metrics:
      - "Core Web Vitals"
      - "Page load times"
      - "API response times"

  errors:
    tool: "Sentry"
    features:
      - "Error tracking"
      - "Performance monitoring"
      - "Release health"

  uptime:
    tool: "Better Uptime"
    alerts:
      - "Email"
      - "Discord webhook"
      - "SMS (critical)"
```

### Key Events to Track

```typescript
// Analytics events
const events = {
  // Authentication
  'user_signed_up': { method: string },
  'user_logged_in': { method: string },

  // Engagement
  'challenge_started': { challenge_id: string, level: number },
  'challenge_completed': { challenge_id: string, attempts: number, time: number },
  'code_executed': { success: boolean, challenge_id: string },

  // Community
  'squad_joined': { squad_id: string },
  'squad_created': { type: string },
  'investigation_started': { category: string },

  // Conversion
  'premium_viewed': {},
  'checkout_started': { plan: string },
  'subscription_activated': { plan: string, amount: number },

  // Engagement quality
  'session_duration': { duration: number },
  'daily_active': {},
  'weekly_active': {},
  'monthly_active': {}
};
```

---

## 🚀 DEPLOYMENT & INFRASTRUCTURE

### Hosting Configuration

```yaml
hosting:
  frontend:
    provider: "Vercel"
    features:
      - "Edge Network (Global CDN)"
      - "Automatic HTTPS"
      - "Preview deployments"
      - "Analytics"
      - "DDoS protection"

    regions: "Auto (global)"
    cost: "$20/month (Pro)"

  backend:
    provider: "Supabase"
    tier: "Pro"
    features:
      - "Dedicated instance"
      - "Daily backups"
      - "Point-in-time recovery"
      - "Read replicas (future)"

    region: "us-east-1 (primary)"
    cost: "$25/month + usage"

  cdn:
    provider: "Cloudflare"
    features:
      - "DDoS protection"
      - "WAF"
      - "Bot protection"
      - "Image optimization"

    cost: "$20/month (Pro)"
```

### CI/CD Pipeline

```yaml
cicd:
  repository: "GitHub"

  workflows:
    test:
      trigger: "Pull request"
      steps:
        - "Lint code (ESLint)"
        - "Type check (TypeScript)"
        - "Run unit tests (Vitest)"
        - "Run integration tests"
        - "Check bundle size"

    deploy_preview:
      trigger: "Push to branch"
      steps:
        - "Build Next.js app"
        - "Deploy to Vercel preview"
        - "Run E2E tests (Playwright)"
        - "Comment preview URL on PR"

    deploy_production:
      trigger: "Push to main"
      steps:
        - "Run all tests"
        - "Build optimized bundle"
        - "Deploy to Vercel production"
        - "Run smoke tests"
        - "Notify team (Discord)"

    database_migration:
      trigger: "Manual"
      steps:
        - "Backup database"
        - "Run migrations"
        - "Verify data integrity"
        - "Rollback if failed"
```

### Environment Variables

```bash
# .env.local (example)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Site
NEXT_PUBLIC_SITE_URL=https://datavism.org

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://posthog.datavism.org

# External APIs
OPENAI_API_KEY=sk-xxx  # For AI features (future)
INVIDIO_API_KEY=xxx    # Video generation
```

---

## 📈 SCALABILITY PLAN

### Performance Targets

```yaml
targets:
  response_time:
    p50: "< 200ms"
    p95: "< 500ms"
    p99: "< 1000ms"

  availability:
    uptime: "99.9%"
    planned_downtime: "< 4 hours/year"

  capacity:
    concurrent_users: "10,000"
    requests_per_second: "1,000"
    database_size: "100GB"
```

### Scaling Strategy

**Phase 1: 0-10K Users**
```yaml
infrastructure:
  vercel: "Pro plan"
  supabase: "Pro plan (single instance)"
  cdn: "Cloudflare Pro"

optimizations:
  - "Static page generation where possible"
  - "API route caching"
  - "Image optimization"
  - "Code splitting"

cost: "~$200/month"
```

**Phase 2: 10K-100K Users**
```yaml
infrastructure:
  vercel: "Enterprise plan"
  supabase: "Team plan (larger instance)"
  cdn: "Cloudflare Business"

optimizations:
  - "Database read replicas"
  - "Redis caching layer"
  - "CDN for API responses"
  - "Incremental static regeneration"

cost: "~$1,500/month"
```

**Phase 3: 100K-1M Users**
```yaml
infrastructure:
  vercel: "Enterprise (scaled)"
  supabase: "Enterprise (or self-hosted)"
  cdn: "Cloudflare Enterprise"
  cache: "Redis Cloud"
  queue: "AWS SQS"

optimizations:
  - "Multi-region deployment"
  - "Database sharding"
  - "Microservices architecture"
  - "GraphQL subscriptions"

cost: "~$10,000/month"
```

---

## 🔒 SECURITY

### Security Measures

```yaml
security:
  authentication:
    - "JWT tokens with short expiry"
    - "Refresh token rotation"
    - "Rate limiting on auth endpoints"
    - "Email verification required"
    - "2FA optional (future)"

  database:
    - "Row Level Security (RLS)"
    - "Prepared statements (SQL injection prevention)"
    - "Encrypted at rest"
    - "Encrypted in transit (TLS)"
    - "Regular backups"
    - "Point-in-time recovery"

  api:
    - "CORS configuration"
    - "Rate limiting (Upstash)"
    - "Input validation (Zod)"
    - "Output sanitization"
    - "API key rotation"

  code_execution:
    - "Sandboxed Pyodide environment"
    - "Timeout protection (30s max)"
    - "Memory limits"
    - "Forbidden operations blocked"
    - "Output size limits"

  infrastructure:
    - "WAF (Web Application Firewall)"
    - "DDoS protection"
    - "Bot protection"
    - "Secrets management (Vercel/Supabase)"
    - "Environment variable encryption"

  compliance:
    - "GDPR compliant"
    - "CCPA compliant"
    - "Privacy policy"
    - "Terms of service"
    - "Cookie consent"
    - "Data deletion on request"
```

---

## 🧪 TESTING STRATEGY

### Testing Stack

```typescript
const testingStack = {
  unit: {
    framework: "Vitest",
    coverage: "v8",
    target: "80% coverage"
  },

  integration: {
    framework: "Vitest + Testing Library",
    database: "Supabase test instance"
  },

  e2e: {
    framework: "Playwright",
    browsers: ["Chromium", "Firefox", "WebKit"],
    ci: "GitHub Actions"
  },

  visual: {
    tool: "Chromatic / Percy",
    components: "Storybook"
  },

  performance: {
    tool: "Lighthouse CI",
    budgets: {
      performance: 90,
      accessibility: 100,
      bestPractices: 90,
      seo: 90
    }
  }
};
```

### Test Examples

```typescript
// Unit test
import { describe, it, expect } from 'vitest';
import { calculateXP } from '@/lib/utils/xp';

describe('XP calculation', () => {
  it('calculates correct XP for challenge completion', () => {
    const result = calculateXP({
      baseXP: 100,
      difficulty: 'hard',
      firstAttempt: true
    });

    expect(result).toBe(150); // 100 * 1.5 multiplier
  });
});

// Integration test
import { render, screen } from '@testing-library/react';
import { ChallengeCard } from '@/components/features/bootcamp';

describe('ChallengeCard', () => {
  it('displays challenge information correctly', () => {
    render(
      <ChallengeCard
        title="Test Challenge"
        xp={100}
        completed={false}
      />
    );

    expect(screen.getByText('Test Challenge')).toBeInTheDocument();
    expect(screen.getByText('100 XP')).toBeInTheDocument();
  });
});

// E2E test
import { test, expect } from '@playwright/test';

test('user can complete a challenge', async ({ page }) => {
  await page.goto('/bootcamp/level/1');

  // Enter code
  await page.fill('[data-testid="code-editor"]', 'print("Hello")');

  // Run code
  await page.click('[data-testid="run-button"]');

  // Check output
  await expect(page.locator('[data-testid="output"]')).toContainText('Hello');

  // Submit
  await page.click('[data-testid="submit-button"]');

  // Verify completion
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

---

## 📦 THIRD-PARTY INTEGRATIONS

### Essential Integrations

```yaml
integrations:
  email:
    service: "Resend"
    use: "Transactional emails"
    templates:
      - "Welcome email"
      - "Password reset"
      - "Investigation alerts"
      - "Weekly digest"

  video:
    service: "InVideo API"
    use: "Handler video generation"
    fallback: "Pre-rendered videos"

  data_sources:
    apis:
      - "Twitter API (disinformation tracking)"
      - "Reddit API (community analysis)"
      - "Google Flights (price tracking)"
      - "NASA API (climate data)"
      - "FEC API (campaign finance)"

  ai_ml:
    openai:
      use: "Content generation, hints"
      model: "GPT-4"

    huggingface:
      use: "ML model testing"
      models: ["Various bias detection"]

  blockchain:
    service: "Ethereum (Sepolia testnet)"
    use: "Evidence NFTs (future)"
    sdk: "ethers.js"

  communication:
    discord:
      use: "Community chat integration"
      bot: "Custom Discord bot"
```

---

## 🔄 DATA PIPELINE

### Data Flow Architecture

```
External APIs → Data Ingestion (Edge Functions)
    ↓
Validation & Transformation
    ↓
PostgreSQL Database
    ↓
Cache Layer (Redis, future)
    ↓
API Layer (Supabase / tRPC)
    ↓
Frontend Application
    ↓
User Interface
```

### Real-Time Data Updates

```typescript
// Supabase Realtime subscription
const subscription = supabase
  .channel('leaderboard-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'leaderboard_entries'
    },
    (payload) => {
      // Update UI in real-time
      updateLeaderboard(payload.new);
    }
  )
  .subscribe();
```

---

## 📝 DOCUMENTATION

### Documentation Stack

```yaml
documentation:
  code:
    tool: "TSDoc comments"
    generation: "TypeDoc"

  api:
    tool: "OpenAPI / Swagger"
    auto_generated: true

  user:
    tool: "Nextra (Next.js docs)"
    url: "docs.datavism.org"

  component:
    tool: "Storybook"
    url: "storybook.datavism.org"
```

---

## 💰 INFRASTRUCTURE COSTS

### Monthly Cost Breakdown (Estimated)

```yaml
costs:
  year_1_100_users:
    vercel: "$20"
    supabase: "$25"
    cloudflare: "$20"
    stripe: "2.9% + $0.30/txn"
    email: "$10"
    total: "~$80/month + transaction fees"

  year_1_10k_users:
    vercel: "$200"
    supabase: "$100"
    cloudflare: "$50"
    redis: "$30"
    monitoring: "$50"
    total: "~$450/month"

  year_2_100k_users:
    vercel: "$1,000"
    supabase: "$500"
    cloudflare: "$200"
    redis: "$100"
    cdn: "$200"
    monitoring: "$100"
    total: "~$2,100/month"
```

---

## 🔮 FUTURE TECH ROADMAP

### Upcoming Technologies

```yaml
future_additions:
  q2_2025:
    - "tRPC for type-safe APIs"
    - "Redis caching layer"
    - "WebSocket for real-time collaboration"

  q3_2025:
    - "React Native mobile apps"
    - "GraphQL subscriptions"
    - "Elasticsearch for advanced search"

  q4_2025:
    - "Unity VR application"
    - "Blockchain evidence storage"
    - "AI-powered hint system"

  2026:
    - "Multi-region deployment"
    - "Microservices architecture"
    - "Custom ML models"
```

---

## 📊 CONCLUSION

This technology stack provides:

✅ **Rapid Development** - Modern tools with great DX
✅ **Scalability** - From 1 to 1M+ users
✅ **Reliability** - 99.9% uptime target
✅ **Cost Efficiency** - <$500/month for 10k users
✅ **Security** - Enterprise-grade from day 1
✅ **Developer Experience** - Modern, well-documented stack

**We're ready to build.**
**The tech is proven.**
**The architecture is sound.**
**Let's ship! 🚀**

---

*Document Version: 1.0*
*Last Updated: 2025*
*For: Development Team*