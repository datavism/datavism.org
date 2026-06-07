# CLAUDE.md - AI Dev Assistant Context

## Project

datavism.org -- a data activism platform where users investigate corporate manipulation, surveillance, and systemic injustice with an AI agent called GHOST. The experience is cinematic: users awaken through an interactive data-reveal experience, choose an operative role, get a codename, then tackle real-world investigation missions with AI assistance.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS 3, Framer Motion (cinematic animations)
- **State:** Zustand (persisted to localStorage via `useDatavist` store)
- **AI:** NVIDIA NIM API (OpenAI-compatible), streaming chat completions
- **Backend:** Supabase (auth, database), React Query
- **Audio:** Procedural Web Audio API (no audio files) via `SoundEngine` singleton
- **Package Manager:** npm

## Key Architecture

### User Flow (in order)
1. `/` -- ViralExperience (data reveal phases: FalseComfort > Glitch > DataRevelation > SystemSpeaks > TheChoice > TheHook)
2. `/awaken` -- OnboardingOrchestrator (Briefing > DriveSelection > RoleSelection > CodenameEntry > AgentActivation)
3. `/awaken/first-contact` -- First chat with GHOST AI agent
4. `/missions` -- Mission board (select investigations)
5. `/missions/[slug]` -- AI Workbench (chat + objectives + notes panels)
6. `/missions/[slug]/debrief` -- Mission completion cinematic
7. `/gallery` -- Public gallery of investigation artifacts
8. `/profile` -- Operative dossier (stats, completed missions, reset)

### State Management
- `lib/store/useDatavist.ts` -- Single Zustand store with persist middleware. Stores `DatavistProfile` (codename, role, motivation, influenceScore, missionsCompleted). localStorage key: `datavism-datavist`.
- Four roles: warrior, rebel, artist, explorer (each with distinct AI personality)
- Four motivations: truth, justice, freedom, impact

### AI Strategy
- **Provider:** NVIDIA NIM API (OpenAI-compatible endpoint)
- **Default Model:** `meta/llama-3.3-70b-instruct`
- **Client:** `lib/ai/nim-client.ts` (streaming + non-streaming)
- **API Route:** `app/api/ai/chat/route.ts` (proxies to NIM, streams response)
- **System Prompts:** `lib/ai/system-prompts.ts` (role-specific GHOST personalities)
- Agent name is "GHOST" -- direct, sharp, mission-focused

### Audio System
- `lib/audio/SoundEngine.ts` -- Singleton AudioContext manager
- `lib/audio/procedural.ts` -- All sound effects (typing, glitch, impact, whoosh, scan, success, drone, etc.)
- No audio files; everything is generated via Web Audio API oscillators and noise buffers

## Important File Locations

```
app/                          # Next.js App Router pages
  page.tsx                    # Root (ViralExperience or returning user)
  awaken/page.tsx             # Onboarding orchestrator
  awaken/first-contact/page.tsx # First AI chat
  missions/page.tsx           # Mission board
  missions/[slug]/page.tsx    # AI Workbench
  missions/[slug]/debrief/page.tsx # Debrief cinematic
  gallery/page.tsx            # Public gallery
  profile/page.tsx            # Operative profile
  api/ai/chat/route.ts        # AI proxy endpoint

components/
  experience/                 # ViralExperience phases (FalseComfort, TheGlitch, etc.)
  onboarding/                 # Awaken flow (Briefing, DriveSelection, RoleSelection, etc.)
  ai/                         # AgentChat, AgentMessage, AgentInput, AgentThinking
  missions/                   # MissionBoard, MissionCard, BriefingCinematic
  workbench/                  # Workbench, MissionSidebar
  layout/                     # PublicNav, AuthenticatedNavigation
  ui/                         # SoundToggle

lib/
  store/useDatavist.ts        # Zustand store (single source of truth)
  ai/nim-client.ts            # NVIDIA NIM API client
  ai/system-prompts.ts        # GHOST role-based system prompts
  audio/SoundEngine.ts        # Web Audio singleton
  audio/procedural.ts         # Procedural sound generators
  data/missions.ts            # Mission definitions (seed data)
  env.ts                      # Environment variable helpers
  hooks/useAuth.tsx           # Supabase auth hook
  services/supabase/          # Supabase client + middleware
```

## Development Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Environment Variables

Required:
```
NVIDIA_NIM_API_KEY          # NVIDIA NIM API key (for GHOST AI)
NEXT_PUBLIC_SUPABASE_URL    # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase anon key
```

Optional:
```
NVIDIA_NIM_BASE_URL         # Default: https://integrate.api.nvidia.com/v1
NVIDIA_NIM_CHAT_MODEL       # Default: meta/llama-3.3-70b-instruct
SUPABASE_SERVICE_ROLE_KEY   # For server-side Supabase operations
NEXT_PUBLIC_APP_URL          # Default: http://localhost:3000
```

## Conventions

- Monospace green-on-black terminal aesthetic throughout
- Role colors: warrior=cyan, rebel=green, artist=purple, explorer=yellow
- Font sizes are oversized in tailwind.config.ts (xs=0.95rem, base=1.25rem) for dramatic effect
- No emoji in AI responses (enforced in system prompts)
- `components/bootcamp/` is legacy code from a previous architecture; the active flow uses `components/experience/`, `components/onboarding/`, and `components/missions/`
