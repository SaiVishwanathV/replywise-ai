# MailCraft AI — AI Email Reply Assistant (Phase 1)

Production-ready React scaffold for an AI-powered email reply assistant.

## Stack

- **React 19** + **Vite**
- **Tailwind CSS** v4 (via `@tailwindcss/vite`)
- **React Router DOM** v7
- **Firebase SDK** (scaffold only)
- **Framer Motion**
- **React Icons**
- **React Hot Toast**

## Project Structure

```
src/
  assets/icons|images|illustrations
  components/common  (Button, Card, Loader, EmptyState)
  components/layout  (Navbar, Sidebar, Footer, PageLayout)
  components/email   (EmailInput, ReplyCard, SummaryCard, ToneSelector, LengthSelector)
  components/ui      (ThemeToggle, SearchBar, PageHeader)
  pages              (Landing, Login, Signup, Dashboard, Workspace, HistoryDetails, Profile, Settings, NotFound)
  context            (AuthContext, ThemeContext)
  firebase           (firebase.js, auth.js, firestore.js)
  services           (geminiService, historyService, summaryService)
  hooks              (useAuth, useTheme)
  routes             (AppRoutes, ProtectedRoute)
  utils              (constants, helpers, formatDate)
```

## Routes

| Path | Page | Protected |
|------|------|-----------|
| `/` | Landing | No |
| `/login` | Login | No |
| `/signup` | Signup | No |
| `/dashboard` | Dashboard | Yes (scaffold: always allows) |
| `/workspace` | Workspace | Yes |
| `/history/:id` | HistoryDetails | Yes |
| `/profile` | Profile | Yes |
| `/settings` | Settings | Yes |
| `*` | NotFound | No |

## Getting Started

```bash
npm install
npm run dev
```

Env vars are not required in Phase 1 — see `.env.example` for upcoming keys.

## Theme

Light/Dark toggle via `ThemeContext` — persists in `localStorage`, applies `dark` class on `<html>`.

## Notes

- Phase 1 is scaffold only — no AI or Firebase logic.
- `ProtectedRoute` currently always allows navigation.
- Firebase files export placeholders.





Phase 2 complete — Landing page rebuilt as ReplyWise AI productivity SaaS (src/pages/Landing.jsx:1). Verified vite build ✓ and vite dev 200 OK.
Branding: Renamed MailCraft AI → ReplyWise AI (src/utils/constants.js:1, index.html:7, src/components/layout/Navbar.jsx:1, src/components/layout/Footer.jsx:1).
Design shift: Removed violet/fuchsia/neon gradients, glassmorphism, blobs. Now white #fcfcfd (dark slate-950), indigo-600 accent only, rounded-xl/2xl, soft shadows, Inter font (src/index.css:1). Button.jsx:1 primary now solid indigo.
Navbar (src/components/layout/LandingNavbar.jsx:1): Sticky, shadow on scroll (window.scrollY > 8), left mail icon + text, center desktop links (Features/How It Works/FAQ with smooth scroll offset 72px), right Login/Get Started + ThemeToggle, Framer Motion mobile drawer. Footer (src/components/layout/LandingFooter.jsx:1): 3 columns (Product/Company/Resources) + bottom line © 2026 ReplyWise AI. Built with React and Firebase.
Landing sections in order (all in src/pages/Landing.jsx:1):
1. Hero — two-col, left headline Write Better Emails in Seconds. + Get Started/Live Demo + React/Firebase/Gemini badges, right static email preview + AI reply (indigo border, no glow)
2. Features — 2×3 grid via src/components/common/FeatureCard.jsx:1 (6 items, hover elevation only)
3. How It Works — 3 src/components/common/StepCard.jsx:1 with desktop connecting line, vertical stack mobile
4. Preview — two cards Original/Generated with Professional badge + Copy/Save UI-only buttons
5. Summarizer — left long email + right 4 bordered containers (Summary/Key Points/Action Items/Deadline)
6. Tone Showcase — 10 src/components/common/ToneChip.jsx:1 chips (Professional…Empathetic), selected state → indigo, preview text switches per tone
7. FAQ — src/components/common/FAQAccordion.jsx:1 (5 questions, AnimatePresence height animation, single-open)
8. CTA — centered bordered card via src/components/common/CTASection.jsx:1
9. Footer above
Animations: Reveal wrapper (fade+slide 0.45s), accordion rotate, subtle hover only — no heavy/particle effects. All buttons route to /signup//workspace placeholders; dark mode via existing ThemeContext.
Reusable components added: FeatureCard, StepCard, ToneChip, FAQAccordion, EmailPreviewCard, CTASection, LandingNavbar, LandingFooter.
▣  Build · Muse Spark 1.2 Free · 6m 50s