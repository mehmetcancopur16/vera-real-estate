# Vera Real Estate — Frontend

Next.js 15 frontend for the Vera Real Estate platform. Built with the App Router, React 19, Tailwind CSS v4, and Shadcn UI.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript / JSX |
| Styling | Tailwind CSS v4, Shadcn UI, class-variance-authority |
| State Management | Zustand |
| Data Fetching | TanStack React Query v5 |
| HTTP Client | Axios (`lib/axios.js`) |
| Forms | React Hook Form + Zod + @hookform/resolvers |
| Maps | Leaflet + react-leaflet |
| Icons | lucide-react |
| Notifications | sonner (toast) |
| Animation | tw-animate-css + custom keyframes |

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
npm run dev   # http://localhost:3000
npm run build
npm start
```

---

## App Directory Structure

```
app/
├── globals.css                    # Custom keyframes, utility classes
├── layout.jsx                     # Root layout (providers, fonts)
│
├── (auth)/
│   ├── login/page.jsx
│   └── register/page.jsx
│
├── (public)/
│   ├── page.jsx                   # Home — hero, featured, how-it-works, why Vera
│   ├── properties/page.jsx        # Listing browser with filters and grid/list toggle
│   ├── properties/[id]/page.jsx   # Full property detail
│   ├── contact/page.jsx
│   ├── about/page.jsx
│   ├── blog/page.jsx
│   ├── terms-of-service/page.jsx
│   └── privacy-policy/page.jsx
│
├── (dashboard)/
│   ├── layout.jsx                 # Dark header + sidebar (auth guard)
│   ├── my-listings/page.jsx       # Manage own listings (toggle, edit, delete)
│   ├── add-listing/page.jsx       # Create new listing
│   ├── edit-listing/[id]/page.jsx # Edit existing listing
│   ├── profile/page.jsx           # Account, security, notifications, subscription
│   ├── upgrade/page.jsx           # Plan pricing page
│   ├── upgrade/checkout/page.jsx  # Upgrade confirmation
│   └── upgrade/success/page.jsx   # Post-upgrade success
│
└── (admin)/
    ├── layout.jsx                  # Dark sidebar auth guard (admin role only)
    ├── admin/page.jsx              # Overview — metrics, plan distribution, activity
    ├── users/page.jsx              # User management
    ├── listings/page.jsx           # Listing management
    ├── contacts/page.jsx           # Contact messages
    └── newsletters/page.jsx        # Newsletter subscribers
```

---

## Components

### Layout
| Component | Description |
|-----------|-------------|
| `components/layout/Navbar.jsx` | Public top navigation with auth state |
| `components/layout/Footer.jsx` | Footer with social links and scroll-to-top |

### Property
| Component | Description |
|-----------|-------------|
| `components/property/PropertyCard.jsx` | Grid card for public listings |
| `components/property/PropertyCardList.jsx` | Horizontal list card |
| `components/property/PropertyForm.jsx` | Multi-step create/edit form |

### UI (Shadcn)
Located in `components/ui/` — Button, Input, Card, Dialog, Select, Tabs, Badge, Avatar, Skeleton, Switch, AlertDialog, DropdownMenu, Sheet, and more.

---

## Services

| File | Backend Endpoints |
|------|------------------|
| `services/auth.service.js` | `/api/auth/*` — register, login, me, update, password |
| `services/property.service.js` | `/api/properties/*` — CRUD, images, my listings |
| `services/admin.service.js` | `/api/admin/*` — stats, users, listings, contacts, newsletters |
| `services/subscription.service.js` | `/api/subscription/plans`, `/api/subscription/upgrade` |
| `services/contact.service.js` | `/api/contact` — submit form |

---

## State Management

### `store/useAuthStore.js`
- `user` — current user object (includes `subscription.plan`, `subscription.expiresAt`)
- `isAuthenticated`, `isLoading`
- `checkAuth()` — validates token on mount
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
  └── render layout (header + sidebar + children)

(admin)/layout.jsx
  │
  ├── same checks +
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

## Tailwind Theme Highlights

Custom variables in `globals.css`:
- `--header`: dark navbar background color
- `--accent`: gold (`#d4af37`)
- `.gradient-text-shimmer`: animated gold shimmer text
- `.glass-card`: frosted-glass card
- `.card-entrance`: fade + slide-up entrance animation
- `.hover-lift-sm`: subtle hover elevation
- `.bg-gold-gradient`: gold gradient background
- `.premium-ring`: decorative ring effect

---

## Deployment (Vercel)

```bash
vercel --prod
```

Set environment variable `NEXT_PUBLIC_API_URL` to your production backend URL.

Image domains must be added to `next.config.js` under `images.domains` if using external image sources.
