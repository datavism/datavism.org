# 🚀 NEXT SESSION HANDOFF

**Status:** Ready to Continue
**Last Session:** November 15, 2025
**Dev Server:** http://localhost:3000
**Branch:** main
**Commits:** All pushed to GitHub

---

## ⚡ QUICK START (Next Session)

```bash
cd /Users/frankbultge/Documents/GitHub/datavism.org
git pull origin main
npm install  # if needed
rm -rf .next  # clean cache
npm run dev  # start server
```

Open: http://localhost:3000

---

## ✅ WHAT'S WORKING NOW

### **Complete User Journey:**

1. **Landing Page** (`/`)
   - Real-time manipulation counter
   - Emotional hook: "They control your FEED, WALLET, MIND"
   - CTA: "START YOUR AWAKENING"

2. **The Awakening** (`/onboarding/awakening`)
   - 8 emotional phases (4 minutes)
   - Choose motivation (Truth/Justice/Freedom/Impact)
   - Choose role (Warrior/Rebel/Artist/Explorer)
   - Pick codename
   - Confetti celebration

3. **First Missions** (`/missions/first/[role]`)
   - **Data Warrior** - Python/Pandas manipulation detection
   - **Code Rebel** - JavaScript price manipulation detector
   - **Viz Artist** - Interactive filter bubble visualization
   - **Truth Explorer** - Greenwashing investigation
   - All reward 500 XP + Badge + Confetti

4. **Dashboard** (`/dashboard`)
   - Shows XP, Level, Role
   - Progress tracking
   - (Needs role-specific customization)

### **Global State:**
- `useResistance` Zustand store
- Persists to localStorage
- Tracks: name, role, motivation, level, xp, missions

### **Navigation:**
- Active route indicators (desktop + mobile)
- WCAG 2.1 AA compliant
- 44px touch targets
- Keyboard navigation support

---

## 🎯 IMMEDIATE PRIORITIES (Start Here)

### **1. Test Everything (1-2 hours)**

**Test all 4 role paths end-to-end:**

```bash
# Test Data Warrior
1. Go to /onboarding/awakening
2. Choose "Seeking Truth" motivation
3. Choose "Data Warrior" role
4. Enter name: "TestWarrior1"
5. Complete Python mission
6. Verify 500 XP + Badge
7. Check dashboard

# Repeat for Rebel, Artist, Explorer
```

**Create test checklist:**
- [ ] All 4 awakening flows work
- [ ] All 4 missions load correctly
- [ ] XP tracking works
- [ ] Confetti triggers
- [ ] Dashboard shows correct data
- [ ] Mobile responsive
- [ ] Keyboard navigation works
- [ ] Skip buttons work

**Fix any bugs found!**

### **2. Supabase Integration (2-3 hours)**

**Connect Zustand to Database:**

File: `lib/store/useResistance.ts`

```typescript
// Add Supabase sync
const syncToSupabase = async (profile: ResistanceProfile) => {
  if (!profile) return

  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) return // Not logged in

  await supabase
    .from('resistance_profiles')
    .upsert({
      user_id: user.user.id,
      ...profile,
      updated_at: new Date().toISOString()
    })
}

// Call syncToSupabase in setProfile and completeMission
```

**Create table:**

```sql
create table resistance_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null unique,
  name text not null,
  role text not null,
  motivation text not null,
  awakening_completed_at timestamptz not null,
  level int default 1,
  xp int default 0,
  missions_completed text[] default '{}',
  current_mission text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS policies
alter table resistance_profiles enable row level security;

create policy "Users can read own profile"
  on resistance_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on resistance_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on resistance_profiles for update
  using (auth.uid() = user_id);
```

### **3. Level 2 Missions (4-6 hours)**

**Build second mission for each role:**

**Data Warrior - Level 2:**
- Mission: Detect sentiment manipulation in news
- Skills: NLP basics, sentiment analysis
- Dataset: Real news headlines with sentiment scores
- Challenge: Find articles with manipulated sentiment
- Reward: 750 XP

**Code Rebel - Level 2:**
- Mission: Build a browser extension skeleton
- Skills: Chrome Extension API basics
- Challenge: Create popup + background script
- Tracks: Price changes on product pages
- Reward: 750 XP

**Viz Artist - Level 2:**
- Mission: Network graph of disinformation spread
- Skills: D3.js force-directed graphs
- Challenge: Visualize how fake news travels
- Interactive: Click nodes to see content
- Reward: 750 XP

**Truth Explorer - Level 2:**
- Mission: Money trail investigation
- Skills: Financial forensics, shell companies
- Challenge: Connect donations to PACs
- Evidence: Bank records, company filings
- Reward: 750 XP

**Files to create:**
- `components/features/missions/SecondMission-Warrior.tsx`
- `components/features/missions/SecondMission-Rebel.tsx`
- `components/features/missions/SecondMission-Artist.tsx`
- `components/features/missions/SecondMission-Explorer.tsx`
- Route: `/missions/second/[role]`

---

## 🔧 TECHNICAL DETAILS

### **Key Files:**

**Onboarding:**
- `components/features/onboarding/TheAwakening.tsx`
- `app/onboarding/awakening/page.tsx`

**Missions:**
- `components/features/missions/FirstMission-Warrior.tsx`
- `components/features/missions/FirstMission-Rebel.tsx`
- `components/features/missions/FirstMission-Artist.tsx`
- `components/features/missions/FirstMission-Explorer.tsx`
- `app/missions/first/[role]/page.tsx`

**State:**
- `lib/store/useResistance.ts` (Zustand)

**Landing:**
- `components/features/landing/HeroAwakening.tsx`
- `app/page.tsx`

**Shared UI:**
- `components/ui/MayaDialogue.tsx`
- `components/ui/TypewriterText.tsx`
- `components/ui/CodeEditor.tsx`

### **Environment Variables:**

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Dependencies:**

All installed, key ones:
- `zustand` - State management
- `framer-motion` - Animations
- `react-confetti` - Celebrations
- `pyodide` - Python execution
- `@supabase/supabase-js` - Backend

---

## 🐛 KNOWN ISSUES

### **Critical:**
None! Everything working.

### **Medium Priority:**

1. **Mobile Testing Needed**
   - Test all 4 missions on mobile
   - Check touch targets
   - Test landscape orientation

2. **Cross-Browser Testing**
   - Test in Safari, Firefox, Chrome
   - Check animations work
   - Verify Python execution (Pyodide)

3. **Error States**
   - Add better error messages
   - Network failure handling
   - Pyodide load failures

### **Low Priority:**

1. **Performance**
   - Bundle splitting for missions
   - Lazy load Pyodide
   - Image optimization

2. **Analytics**
   - Track mission completions
   - Track role selection
   - Track drop-off points

---

## 📋 BACKLOG (Future Sessions)

### **Features:**

**Week 1-2:**
- [ ] Level 2 missions (all 4 roles)
- [ ] Role-specific dashboards
- [ ] Supabase sync
- [ ] Mobile testing & fixes

**Week 3-4:**
- [ ] Squad system basics
- [ ] Squad creation & joining
- [ ] Squad missions (multi-role)
- [ ] Leaderboards

**Month 2:**
- [ ] Video integration (scripts exist)
- [ ] Investigation system
- [ ] Level 3-4 missions
- [ ] Achievement system

**Month 3:**
- [ ] Advanced visualizations
- [ ] Real data integration
- [ ] AR mode prototype
- [ ] Community features

### **Polish:**
- [ ] Better error states
- [ ] Loading skeletons
- [ ] Toast notifications
- [ ] Tutorial tooltips
- [ ] Onboarding skip for returning users
- [ ] Profile customization

### **Backend:**
- [ ] Server-side validation
- [ ] Mission verification
- [ ] Anti-cheat measures
- [ ] Rate limiting
- [ ] Analytics dashboard

---

## 🎓 CODE PATTERNS TO FOLLOW

### **Mission Structure:**

```typescript
// Mission component structure
export function FirstMission[Role]() {
  const [phase, setPhase] = useState<'briefing' | 'doing' | 'success'>('briefing')
  const [showConfetti, setShowConfetti] = useState(false)
  const { completeMission, profile } = useResistance()
  const router = useRouter()

  // Mission logic here

  const handleSuccess = () => {
    setShowConfetti(true)
    setTimeout(() => {
      setPhase('success')
      completeMission('mission-id', xpAmount)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      {showConfetti && <Confetti />}

      {phase === 'briefing' && <Briefing />}
      {phase === 'doing' && <Challenge />}
      {phase === 'success' && <Success />}
    </div>
  )
}
```

### **State Updates:**

```typescript
// Always use useResistance for mission tracking
const { completeMission } = useResistance()

// On success:
completeMission('mission-id', xpAmount)
```

### **Styling Conventions:**

```tsx
// Role colors:
Data Warrior: cyan-400
Code Rebel: green-400
Viz Artist: purple-400
Truth Explorer: yellow-400

// States:
Locked: gray-600, opacity-50
Active: yellow-400, animate-pulse
Completed: green-400
```

---

## 💡 TIPS FOR NEXT SESSION

### **Before You Start:**

1. **Pull latest code:**
   ```bash
   git pull origin main
   ```

2. **Check server works:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Test one full journey:**
   - Complete awakening
   - Complete one mission
   - Check dashboard

### **Development Tips:**

1. **Hot Module Reload Issues?**
   - Kill server
   - Delete .next
   - Restart server

2. **TypeScript Errors?**
   - Run `npm run build` to see all errors
   - Fix before testing in browser

3. **State Not Persisting?**
   - Check browser localStorage
   - Key: `datavism-resistance`
   - Clear if corrupted: `localStorage.clear()`

4. **Confetti Not Showing?**
   - Check window size state
   - Verify `react-confetti` import
   - Check `showConfetti` state

---

## 🚀 DEPLOYMENT CHECKLIST (When Ready)

- [ ] All builds pass (`npm run build`)
- [ ] All TypeScript errors fixed
- [ ] Environment variables set (Vercel)
- [ ] Database migrations run (Supabase)
- [ ] Analytics configured
- [ ] Error tracking (Sentry?)
- [ ] Performance audit
- [ ] Mobile testing complete
- [ ] Cross-browser testing
- [ ] README updated
- [ ] Documentation complete

---

## 📞 QUICK REFERENCE

### **Commands:**

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Check linting
rm -rf .next             # Clean cache

# Git
git status               # Check status
git add -A               # Stage all changes
git commit -m "message"  # Commit
git push origin main     # Push to GitHub

# Testing
npm test                 # Run tests (when added)
npm run type-check       # TypeScript check
```

### **URLs:**

- Dev: http://localhost:3000
- Landing: /
- Awakening: /onboarding/awakening
- Missions: /missions/first/[warrior|rebel|artist|explorer]
- Dashboard: /dashboard
- Bootcamp: /bootcamp
- Level 1: /bootcamp/level/1

### **Contacts:**

- User: frankbultge
- Email: ghost@datavism.org (project email)
- GitHub: datavism/datavism.org

---

## 🎯 SUCCESS CRITERIA (Next Session)

**Session is successful if:**

1. ✅ All 4 role missions tested & working
2. ✅ Supabase integration complete
3. ✅ At least 2 Level 2 missions built
4. ✅ Mobile responsive verified
5. ✅ No critical bugs remaining

**Stretch goals:**
- Squad system started
- Video integration prototype
- Real data API connected

---

## 📚 RESOURCES

**Documentation:**
- `/docs/DATAVISM-Ultimate-Vision-2025.md` - Full vision
- `/docs/SESSION-2025-11-15-SUMMARY.md` - What we built
- `/docs/Levels-3-7-Curriculum-Design.md` - Future content
- 24 other design docs in /docs

**External:**
- Supabase Docs: https://supabase.com/docs
- Zustand Docs: https://zustand-demo.pmnd.rs/
- Framer Motion: https://www.framer.com/motion/
- Pyodide: https://pyodide.org/

---

## 👻 FINAL NOTES

**What Makes This Special:**

This isn't a tutorial anymore. It's a movement.

Every user chooses their role:
- Analytics → Data Warrior
- Development → Code Rebel
- Design → Viz Artist
- Research → Truth Explorer

Everyone contributes their superpower.
Together, we fight manipulation.

**The revolution is live.** 🚀

---

*Ready for next session!*
*All code committed & pushed*
*Server: http://localhost:3000*
*Let's build! 👻*
