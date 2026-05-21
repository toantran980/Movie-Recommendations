# Movie Recommendations App — Future Roadmap

## Current Baseline (Phase 0 — Already Built)

| Layer | What exists |
|---|---|
| **Backend** | Express server, TMDB proxy routes: `/popular`, `/genres`, `/search`, `/:id` (with credits, videos, recommendations). In-memory cache (10 min TTL). |
| **Frontend** | React + Vite, React Router (3 pages), Context API for favorites/watchlist (localStorage persistence), MovieCard, MovieDetailsModal (backdrop hero, cast, trailer embed, recommendations, user rating ★, notes), genre filter pills, skeleton loading, toast notifications. |

---

## Phase 1 — UI/UX Polish & Design System Overhaul

> **Goal:** Make the app feel premium and cohesive. Establish a design token system so all future phases inherit a consistent look.

### Changes

- **Design Tokens** (`index.css`) — Full CSS custom-property system: color palette, spacing scale, border radii, shadows, transitions. Import Google Font (`Inter` or `Outfit`). Cinematic dark base (deep navy/charcoal).
- **App Layout** (`App.css`) — Responsive layout tokens, max-width container, scrollbar styling.
- **Navbar** — Glassmorphism sticky navbar with blur backdrop. Active route animated underline. Favorites & Watchlist badge counts. Hamburger menu for mobile.
- **Movie Cards** — Hover: poster zoom + gradient overlay with quick-action buttons (❤️ / 📌 / ▶ details). TMDB rating badge on poster corner. Staggered fade-in entrance animation.
- **Skeletons** — Shimmer animation matching card aspect ratio.
- **Movie Details Modal** — Backdrop hero parallax. Horizontal cast scroller with smooth snap scroll. Better mobile responsiveness.
- **Toast** — Slide-in/out animation, icon-prefixed types (✅ success, ℹ️ info, ❌ error).
- **Hero Section** (NEW) — Animated full-width hero banner cycling through top popular movies' backdrop images with fade crossfade and "Explore Now" CTA.

---

## Phase 2 — Discovery & Filtering Enhancement

> **Goal:** Give users much richer ways to find movies. Add pagination, multi-filter support, and new browse modes.

### Backend

- `GET /movies/discover` — Proxy TMDB `/discover/movie` with params: `genre`, `year`, `sort_by`, `page`.
- `GET /movies/trending` — Proxy TMDB `/trending/movie/week`.
- `GET /movies/top-rated` — Proxy TMDB `/movie/top_rated`.
- `GET /movies/upcoming` — Proxy TMDB `/movie/upcoming`.
- Add `page` param support to existing `/popular` and `/search`.

### Frontend

- **Browse Mode Tabs:** Popular · Trending · Top Rated · Upcoming.
- **Advanced Filter Panel** (NEW component) — Collapsible slide-down panel with year range slider, sort-by dropdown (popularity, rating, release date), multi-genre pills with × remove.
- **Infinite Scroll / Load More** button with page counter.
- **URL-persisted filters** (`?tab=trending&genre=28`).
- **Favorites & Watchlist improvements** — Sort/filter (by title A–Z, rating, date added), stats card (total movies, avg rating, genre breakdown), bulk remove via checkboxes.

---

## Phase 3 — User Authentication & Persistent Backend Storage

> **Goal:** Move favorites/watchlist from localStorage to a real database so data survives across devices. Add user accounts.

### Backend

- **Database module** (`db.js`) — MongoDB (Mongoose) or PostgreSQL (Prisma).
- **User model** — `email`, `passwordHash`, `createdAt`.
- **UserList model** — `userId`, `movieId`, `type` (`favorite` | `watchlist`), `rating`, `notes`, `addedAt`.
- **Auth routes** (`/auth`) — `POST /register`, `POST /login`, `POST /logout`, `GET /me`.
- **List routes** (`/lists`) — Full CRUD for favorites and watchlist (auth required).
- **Auth middleware** — JWT verification, `req.user` injection.
- **Security** — `helmet`, `express-rate-limit`.

### Frontend

- **Login & Register pages** — Elegant auth forms with animated inputs, error states, loading spinners.
- **AuthContext** — JWT in httpOnly cookie, expose `user`, `login()`, `logout()`, `register()`.
- **MovieContext updated** — API calls to `/lists/*` when authenticated, localStorage fallback for guest mode.
- **Protected routes** — `/favorites` and `/watchlist` require login.

---

## Phase 4 — Smart Recommendations & Social Features

> **Goal:** Make the app genuinely useful for discovery by learning from the user's taste. Add light social features.

### Backend

- `GET /recommendations/for-me` — Derive genre/actor preferences from user's favorites → query TMDB `/discover/movie` with those seeds → return ranked results.
- `GET /recommendations/similar/:movieId` — Proxy TMDB `/movie/:id/similar`.
- `GET /recommendations/by-mood` — Accept mood tags (e.g., "feel-good", "thriller", "cry") → map to TMDB genre/keyword combos.

### Frontend

- **For You page** (NEW) — Personalized recommendation feed. "Because you liked _X_" attribution labels. Mood picker with emoji chips (😂 Comedy · 😱 Horror · ❤️ Romance · 🎭 Drama · 🚀 Sci-Fi).
- **Taste Profile component** (NEW) — Visual breakdown of top genres, avg rating, most-watched actors.
- **Profile page** (NEW) — User settings, taste profile visualization, viewing history timeline.
- **Movie Details Modal updates** — "Similar Movies" tab alongside Recommendations. Share button (copy deep link `/movie/12345`).

---

## Verification Plan

| Phase | How to verify |
|---|---|
| **1** | Visual review (desktop + mobile viewport), check all hover/animation states, Lighthouse audit |
| **2** | Each browse tab loads distinct results, URL params persist on back/forward, pagination appends movies |
| **3** | Register → Login → Add favorites → Logout → Re-login → favorites still present. localStorage NOT used when authenticated. JWT expiry → redirect to login. |
| **4** | For-You returns results seeded from favorited genres. Mood picker matches expected genre combos. Share link opens modal on direct navigation. |
