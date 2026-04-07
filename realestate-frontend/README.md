# Vera Real Estate — Frontend

Next.js 15 frontend for the Vera Real Estate platform. Built with the App Router, React 19, Tailwind CSS v4, and Shadcn UI.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | JSX |
| Styling | Tailwind CSS v4, Shadcn UI, class-variance-authority |
| State Management | Zustand |
| Data Fetching | TanStack React Query v5 |
| HTTP Client | Axios (`lib/axios.js`) |
| Forms | React Hook Form + Zod + @hookform/resolvers |
| Maps | Leaflet + react-leaflet |
| Icons | lucide-react |
| Notifications | sonner (toast) |
| Animation | tw-animate-css + custom keyframes in `globals.css` |

---

## Installation

```bash
npm install
cp .env.example .env.local
```

### `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

### Run

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve production build
npm run lint    # ESLint check
```

### Run from Monorepo Root

```bash
# From vera-real-estate/ root directory:
npm run install:all  # installs all workspace dependencies
npm run dev          # starts both frontend (3000) and backend (5050)
```

---

## App Directory Structure

```
app/
├── globals.css                     # Custom CSS tokens, keyframes, utility classes
├── layout.jsx                      # Root layout (providers, fonts)
│
├── (auth)/
│   ├── login/page.jsx
│   └── register/page.jsx
│
├── (public)/
│   ├── page.jsx                    # Home — hero, featured, how-it-works, why Vera
│   ├── properties/page.jsx         # Listing browser with filters and grid/list toggle
│   ├── properties/[id]/page.jsx    # Full property detail with gallery and map
│   ├── contact/page.jsx
│   ├── about/page.jsx
│   ├── blog/page.jsx
│   ├── blog/[slug]/page.jsx        # Static blog post detail
│   ├── terms-of-service/page.jsx
│   └── privacy-policy/page.jsx
│
├── (dashboard)/
│   ├── layout.jsx                  # Dark header + sidebar (auth guard → /login)
│   ├── my-listings/page.jsx        # Manage own listings (toggle, edit, delete)
│   ├── add-listing/page.jsx        # Create new listing (multi-step form)
│   ├── edit-listing/[id]/page.jsx  # Edit existing listing
│   ├── profile/page.jsx            # Account, security, notifications, subscription
│   ├── upgrade/page.jsx            # Plan pricing comparison page
│   ├── upgrade/checkout/page.jsx   # Upgrade confirmation
│   └── upgrade/success/page.jsx    # Post-upgrade success with confetti
│
└── (admin)/
    ├── layout.jsx                   # Dark header (auth guard → /my-listings for non-admins)
    ├── admin/page.jsx               # Overview — metrics, plan distribution, activity
    ├── admin/users/page.jsx         # User management
    ├── admin/listings/page.jsx      # Listing management
    ├── admin/contacts/page.jsx      # Contact messages
    └── admin/newsletters/page.jsx   # Newsletter subscribers
```

---

## Components

### Layout
| Component | Description |
|-----------|-------------|
| `components/layout/Navbar.jsx` | Public top navigation with auth state, animated on scroll |
| `components/layout/Footer.jsx` | Footer with social links and scroll-to-top |

### Property
| Component | Description |
|-----------|-------------|
| `components/property/PropertyCard.jsx` | Grid card for public listings |
| `components/property/PropertyCardList.jsx` | Horizontal list card |
| `components/property/PropertyForm.jsx` | Multi-step create/edit form (6 steps) |

### UI (Shadcn)
Located in `components/ui/` — AlertDialog, Avatar, Badge, Button, Card, Checkbox, Dialog, DropdownMenu, Input, Select, Separator, Sheet, Skeleton, Sonner, Switch, Tabs, Textarea, and more.

---

## Services

| File | Backend Endpoints |
|------|------------------|
| `services/auth.service.js` | `/api/auth/*` — register, login, me, update-profile, change-password, upload-avatar, delete-me |
| `services/property.service.js` | `/api/properties/*` — CRUD, images, my listings |
| `services/admin.service.js` | `/api/admin/*` — stats, users, listings, contacts, newsletters |
| `services/subscription.service.js` | `/api/subscription/plans`, `/api/subscription/upgrade` |
| `services/contact.service.js` | `/api/contact` — submit form |

---

## State Management

### `store/useAuthStore.js`
- `user` — current user object (includes `subscription.plan`, `subscription.expiresAt`, `role`)
- `isAuthenticated`, `isLoading`
- `checkAuth()` — validates token on mount
- `login(token)` — sets token and fetches user
- `logout()` — clears user and token

### `store/usePropertyStore.js`
- `filters` — active filter state for property browsing
- `setFilters()`, `resetFilters()`

---

## Dashboard Auth Flow

```
(dashboard)/layout.jsx
  │
  ├── checkAuth() on mount
  ├── isLoading  → show spinner
  ├── !isAuthenticated → redirect /login
  └── render layout (dark header + sidebar + children)

(admin)/layout.jsx
  │
  ├── same auth checks +
  ├── user.role !== 'admin' → redirect /my-listings
  └── render admin layout
```

---

## PropertyForm Steps

1. **Temel Bilgiler** — title, type, listingType, description
2. **Fiyat & Boyut** — price, currency, size, maintenanceFee
3. **Özellikler** — rooms, bathrooms, floor, totalFloors, heating, yearBuilt, deedStatus, parking, furnished
4. **Konum** — city, district, address (+ Leaflet map picker)
5. **Görseller** — image upload (up to 5), virtualTourUrl, isFeatured
6. **Olanaklar** — amenities checkboxes

---

## Admin Pages

| Route | Description |
|-------|-------------|
| `/admin` | Overview: 6 metric cards, plan distribution, recent users/listings, quick links |
| `/admin/users` | Paginated user table — update role, plan, delete |
| `/admin/listings` | Paginated listing table — toggle active, delete |
| `/admin/contacts` | Contact messages — mark read, delete |
| `/admin/newsletters` | Newsletter subscribers — delete |

---

## `next.config.ts` — External Image Domains

The following remote image hostnames are whitelisted for `next/image`:

- `images.unsplash.com`
- `ui-avatars.com`
- `localhost` (port 5050 for uploaded images)

---

## Tailwind Theme Highlights

Custom variables and utilities in `app/globals.css`:

| Token / Class | Description |
|---------------|-------------|
| `--accent` | Gold (`#d4af37`) — primary brand color |
| `--muted-foreground` | Readable dark grey (`#64748b`) for placeholders and muted text |
| `--header` | Dark navbar background color |
| `.bg-gold-gradient` | Gold gradient background |
| `.text-gradient-gold` | Transparent gold gradient text |
| `.gradient-text-shimmer` | Animated shimmer gold text |
| `.glass-card` | Frosted-glass card with backdrop-filter |
| `.card-entrance` | Fade + slide-up entrance animation |
| `.hover-lift-sm` | Subtle hover elevation |
| `.premium-ring` | Decorative ring glow effect |
| `.animate-shimmer` | Skeleton loading sweep animation |
| `.animate-float` | Floating orb animation |
| `.btn-press` | Active scale-down button feedback |
| `.status-dot-active` | Animated green dot indicator |
| `.page-transition` | Page enter animation |
| `.delay-{100-800}` | Animation delay helpers |
| Scrollbar styling | Custom thin scrollbar for table/sidebar areas |

---

## Deployment (Vercel)

```bash
vercel --prod
```

Set environment variable `NEXT_PUBLIC_API_URL` to your production backend URL.

Add any additional external image domains to `next.config.ts` under `images.remotePatterns` as needed.
