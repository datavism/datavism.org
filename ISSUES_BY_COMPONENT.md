# ISSUES BY COMPONENT - QUICK REFERENCE

## Legend
- **🔴 CRITICAL** - Production-breaking bugs
- **🟡 HIGH** - Significant UX/A11y issues  
- **🟢 MEDIUM** - Polish improvements

---

## HeroRevolution.tsx
**Current:** Lines 1-233 | Issues: 5

| Issue | Type | Severity | Line(s) | Quick Fix |
|-------|------|----------|---------|-----------|
| Live counter updates without cleanup | Memory leak | 🟡 | 21-25 | Add missing dependency tracking |
| Button touch targets too small | Mobile UX | 🟡 | 145-158 | Change `px-8 py-4` → `px-10 py-5` |
| Grid background animates on mobile | Performance | 🟡 | 42-50 | Disable with `@media (max-width: 768px)` |
| Color overload (5+ neons) | Visual | 🟢 | 40-100 | Establish color hierarchy |
| CRT glitch infinite animation | Performance | 🟡 | globals.css | Move to hover state only |

**Priority:** Fix counter cleanup immediately (memory leak)

---

## HeroSection.tsx
**Current:** Lines 1-268 | Issues: 2

| Issue | Type | Severity | Line(s) | Quick Fix |
|-------|------|----------|---------|-----------|
| Dual hero sections conflict | Design | 🔴 | - | Choose HeroRevolution OR HeroSection |
| Animation stacking on logo | Performance | 🟡 | 40-80 | Reduce simultaneous animations |

**Priority:** Design decision needed - which hero to keep?

---

## Level1AwakeningExperience-Simple.tsx
**Current:** Lines 1-705 | Issues: 5

| Issue | Type | Severity | Line(s) | Quick Fix |
|-------|------|----------|---------|-----------|
| Skip button only visible after dialogue | UX friction | 🟡 | 501-510 | Show button immediately |
| Progression unlock logic unclear | UX friction | 🟡 | 408 | Show roadmap with lock icons |
| localStorage saves every keystroke | Performance | 🟡 | 336-345 | Debounce with 3-second delay |
| XP penalty shown as "50%" only | UX friction | 🟡 | 388 | Show explicit numbers: "Full: 200 XP \| Help: 100 XP" |
| No celebration on first completion | Engagement | 🟢 | ~600 | Add confetti/sound effect |

**Priority:** Fix skip button first (fastest UX win)

---

## CodeEditor.tsx
**Current:** Lines 1-133 | Issues: 1

| Issue | Type | Severity | Line(s) | Quick Fix |
|-------|------|----------|---------|-----------|
| Line count escape bug | Display bug | 🔴 | 125 | `split('\\n')` → `split('\n')` |

**Priority:** FIX IMMEDIATELY - Shows wrong numbers to users

---

## MayaDialogue.tsx
**Current:** Lines 1-212 | Issues: 1

| Issue | Type | Severity | Line(s) | Quick Fix |
|-------|------|----------|---------|-----------|
| TypewriterText speed 20ms too fast | Accessibility | 🟡 | 139 | Change `speed={20}` → `speed={50}` |

**Priority:** Affects dialogue readability across entire bootcamp

---

## TypewriterText.tsx
**Current:** Lines 1-119 | Issues: 2

| Issue | Type | Severity | Line(s) | Quick Fix |
|-------|------|----------|---------|-----------|
| No way to skip animation | Accessibility | 🟡 | 55-69 | Add spacebar/enter to skip |
| Creates new strings per character | Performance | 🟢 | 40 | Use character array instead of slice |

**Priority:** Add skip functionality (user frustration)

---

## DashboardStats.tsx
**Current:** Lines 1-85 | Issues: 3 (ALL CRITICAL)

| Issue | Type | Severity | Line(s) | Quick Fix |
|-------|------|----------|---------|-----------|
| Dynamic Tailwind classes won't compile | Build error | 🔴 | 65-68 | Map to static class names object |
| localStorage date bug - string as Date | Runtime error | 🔴 | 27 | Convert to timestamp: `.getTime()` |
| Week calculation assumes 5 challenges | Logic error | 🟡 | 18-19 | Account for variable challenge counts |

**Priority:** FIX ALL THREE - Dashboard won't work in production

Example Fix:
```jsx
const colorClasses = {
  yellow: 'border-yellow-400 bg-yellow-950/10',
  green: 'border-green-400 bg-green-950/10',
  cyan: 'border-cyan-400 bg-cyan-950/10',
  purple: 'border-purple-400 bg-purple-950/10',
}

className={colorClasses[stat.color]}
```

---

## VictorySequence.tsx
**Current:** Lines 1-299 | Issues: 0

✅ **No critical issues found** - Well-implemented component

**Nice-to-have:** Add difficulty/speedrun achievements tracking

---

## Navigation.tsx
**Current:** Lines 1-79 | Issues: 2

| Issue | Type | Severity | Line(s) | Quick Fix |
|-------|------|----------|---------|-----------|
| No active route indicator | Navigation | 🟡 | 34-41 | Use `usePathname()` to highlight current |
| Text links don't look clickable | Affordance | 🟡 | 38 | Add `hover:underline` |

**Priority:** Navigation clarity improves UX significantly

---

## AuthenticatedNavigation.tsx
**Current:** Lines 1-194 | Issues: 3

| Issue | Type | Severity | Line(s) | Quick Fix |
|-------|------|----------|---------|-----------|
| No active route indicator | Navigation | 🟡 | 63-75 | Use `usePathname()` to highlight |
| Icon-only buttons missing aria-labels | Accessibility | 🟡 | 64-74 | Add `aria-label` to each icon link |
| Mobile menu cramped | Mobile UX | 🟢 | 176-188 | Hide some info in mobile view |

**Priority:** Add aria-labels (quick accessibility win)

---

## globals.css
**Current:** Lines 1-550 | Issues: 4

| Issue | Type | Severity | Line(s) | Quick Fix |
|-------|------|----------|---------|-----------|
| No prefers-reduced-motion support | A11y violation | 🔴 | All | Wrap animations in media query |
| Glitch animation always running | Performance | 🟡 | 262-286 | Move to `:hover` state only |
| Ghost blink animation no control | A11y violation | 🟡 | 413-416 | Add motion preference check |
| Scanline effect causes jitter | Visual | 🟡 | 345-348 | Use selectively (code editor only) |

**Priority:** Add global motion safety (WCAG violation)

```css
/* Add at top of globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## SUMMARY BY SEVERITY

### 🔴 CRITICAL (Fix Immediately - 2-3 hours)
- [ ] DashboardStats dynamic Tailwind classes (65-68)
- [ ] DashboardStats localStorage date bug (27)
- [ ] CodeEditor line count escape (125)
- [ ] No prefers-reduced-motion support (globals.css)
- [ ] No focus indicators (all buttons/links)

### 🟡 HIGH (Fix This Week - 4-6 hours)
- [ ] Skip button not visible (Level1: 501-510)
- [ ] Progression unlock unclear (Level1: 408)
- [ ] TypewriterText too fast (MayaDialogue: 139)
- [ ] localStorage thrashing (Level1: 336-345)
- [ ] No active route highlight (Navigation components)
- [ ] Glitch animation always on (globals.css: 262)
- [ ] Grid background animates on mobile (HeroRevolution: 42-50)
- [ ] Touch targets < 44px (Level1: 633-648)

### 🟢 MEDIUM (Polish - Ongoing)
- [ ] Color overload (HeroRevolution)
- [ ] No celebration on completion (Level1)
- [ ] Hint element unstyled (Level1: 612-619)
- [ ] TypewriterText memory (TypewriterText: 40)
- [ ] Mobile menu cramped (AuthenticatedNavigation)
- [ ] Week calculation (DashboardStats: 18-19)

---

## TESTING BEFORE/AFTER

### Before Fixes:
```
Accessibility:  Level D (multiple violations)
Mobile Score:   65-70
Lighthouse:     Moderate performance issues
User Friction:  High (unclear progression, slow animations)
```

### After Priority 1 & 2 Fixes:
```
Accessibility:  Level AA+ (compliant)
Mobile Score:   85-90
Lighthouse:     85+ (good to excellent)
User Friction:  Low (clear progression, responsive)
```

---

## COMPONENT DEPENDENCY MAP

For developers coordinating changes:

```
globals.css (CORE - needed by ALL)
├── HeroSection.tsx
├── HeroRevolution.tsx
├── Navigation.tsx
├── AuthenticatedNavigation.tsx
├── Level1AwakeningExperience-Simple.tsx
│   ├── CodeEditor.tsx
│   ├── MayaDialogue.tsx
│   │   └── TypewriterText.tsx
│   └── VictorySequence.tsx
└── DashboardStats.tsx
```

**Recommendation:** Fix globals.css first (motion safety), then drill down component by component.

---

## FILES READY FOR REFACTORING

**HIGH CONFIDENCE (Straightforward fixes):**
- CodeEditor.tsx - 1 line fix
- MayaDialogue.tsx - 1 config change
- globals.css - Pattern addition

**MEDIUM CONFIDENCE (Few dependencies):**
- Navigation.tsx - 1 hook addition
- AuthenticatedNavigation.tsx - 2 hooks additions
- TypewriterText.tsx - 1 feature addition

**NEEDS CAREFUL PLANNING (Multiple changes):**
- DashboardStats.tsx - 3 critical fixes + refactor
- Level1AwakeningExperience-Simple.tsx - 5 fixes, extensive testing needed
- HeroRevolution.tsx & HeroSection.tsx - Design decision first

---
