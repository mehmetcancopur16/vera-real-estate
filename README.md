# Vera Real Estate — Emlak İlan Portalı

A full-stack real estate listing platform built with **Next.js 15** (frontend) and **Node.js / Express 5** (backend). Users can browse properties, create listings, manage subscriptions, and administrators can oversee all platform activity through a dedicated admin panel.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Property Model Fields](#property-model-fields)
- [Subscription Plans](#subscription-plans)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Admin Routes](#admin-routes)
- [Swagger / API Docs](#swagger--api-docs)
- [Deployment](#deployment)

---

## Architecture

```
vera-real-estate/
├── realestate-frontend/   # Next.js 15 App Router
└── realestate-backend/    # Express 5 REST API
```

The frontend communicates with the backend via a shared Axios instance. JWT tokens are stored in `localStorage` and sent in the `Authorization` header.

---

## Tech Stack

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript / JSX |
| Styling | Tailwind CSS v4, Shadcn UI |
| State | Zustand (`useAuthStore`, `usePropertyStore`) |
| Data Fetching | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| Maps | Leaflet + react-leaflet |
| Icons | lucide-react |

### Backend
| Layer | Technology |
|-------|-----------|
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Validation | Joi / Zod |
| File Uploads | Multer |
| Security | Helmet, express-rate-limit, HPP |
| API Docs | swagger-jsdoc + swagger-ui-express |

---

## Features

### Public
- Browse and filter property listings (type, listing type, city, price, rooms, size)
- Property detail pages with gallery, map, virtual tour link, and all field data
- Featured properties on the home page
- Contact form, blog, about, and static pages

### Authenticated Users
- Dashboard with listing management (create, edit, delete, toggle active/inactive)
- Profile management (avatar, password, notification preferences)
- Subscription plan selection (Free / Professional / Corporate)
- Listing limit enforcement per plan

### Admin Panel
- Overview dashboard with animated metrics, plan distribution, recent users & listings
- User management (list, update role/plan, delete)
- Listing management (list all, toggle active, delete any)
- Contact messages (list, mark as read, delete)
- Newsletter subscribers (list, delete)

---

## Property Model Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Listing title |
| `description` | String | Full description |
| `type` | Enum | `apartment` / `house` / `land` / `commercial` |
| `listingType` | Enum | `sale` / `rent` |
| `price` | Number | Price |
| `currency` | String | Default `TRY` |
| `size` | Number | Area in m² |
| `amenities` | [String] | List of amenities |
| `yearBuilt` | Number | Construction year |
| `status` | Enum | `available` / `sold` / `rented` |
| `deedStatus` | Enum | `freehold` / `leasehold` / `shared` |
| `maintenanceFee` | Number | Monthly maintenance fee |
| `totalFloors` | Number | Total floors in building |
| `parking` | Boolean | Parking available |
| `furnished` | Boolean | Furnished |
| `virtualTourUrl` | String | Virtual tour URL |
| `isFeatured` | Boolean | Show on home page |
| `features.rooms` | Number | Number of rooms |
| `features.bathrooms` | Number | Number of bathrooms |
| `features.floor` | Number | Floor number |
| `features.heating` | String | Heating type |
| `location.city` | String | City (required) |
| `location.district` | String | District |
| `location.address` | String | Full address |
| `viewCount` | Number | View counter |
| `images` | [String] | Image URLs |
| `isActive` | Boolean | Listing visibility |
| `owner` | ObjectId | Ref to User |

---

## Subscription Plans

| Plan | Price | Listing Limit | Key Features |
|------|-------|--------------|--------------|
| Free | Free | 3 | Basic visibility, email support |
| Professional | ₺299/mo | 7 | Featured listings, stats, priority support, profile badge |
| Corporate | ₺799/mo | Unlimited | All Professional features + API access, dedicated account manager, advanced analytics |

---

## Project Structure

```
vera-real-estate/
├── package.json                          # Root workspace scripts
├── README.md
│
├── realestate-frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.jsx
│   │   │   └── register/page.jsx
│   │   ├── (public)/
│   │   │   ├── page.jsx                  # Home
│   │   │   ├── properties/page.jsx
│   │   │   ├── properties/[id]/page.jsx
│   │   │   ├── contact/page.jsx
│   │   │   ├── about/page.jsx
│   │   │   ├── blog/page.jsx
│   │   │   ├── terms-of-service/page.jsx
│   │   │   └── privacy-policy/page.jsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.jsx
│   │   │   ├── my-listings/page.jsx
│   │   │   ├── add-listing/page.jsx
│   │   │   ├── edit-listing/[id]/page.jsx
│   │   │   ├── profile/page.jsx
│   │   │   ├── upgrade/page.jsx
│   │   │   ├── upgrade/checkout/page.jsx
│   │   │   └── upgrade/success/page.jsx
│   │   └── (admin)/
│   │       ├── layout.jsx
│   │       ├── admin/page.jsx            # Overview dashboard
│   │       ├── users/page.jsx
│   │       ├── listings/page.jsx
│   │       ├── contacts/page.jsx
│   │       └── newsletters/page.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   └── property/
│   │       ├── PropertyCard.jsx
│   │       ├── PropertyCardList.jsx
│   │       └── PropertyForm.jsx
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── property.service.js
│   │   ├── admin.service.js
│   │   ├── contact.service.js
│   │   └── subscription.service.js
│   └── store/
│       ├── useAuthStore.js
│       └── usePropertyStore.js
│
└── realestate-backend/
    ├── src/
    │   ├── app.js                        # Express app + Swagger
    │   ├── controllers/
    │   │   ├── auth.controller.js
    │   │   ├── property.controller.js
    │   │   ├── admin.controller.js
    │   │   ├── subscription.controller.js
    │   │   ├── contact.controller.js
    │   │   └── newsletter.controller.js
    │   ├── routes/
    │   │   ├── auth.routes.js
    │   │   ├── property.routes.js
    │   │   ├── admin.routes.js
    │   │   ├── subscription.routes.js
    │   │   ├── contact.routes.js
    │   │   └── newsletter.routes.js
    │   ├── models/
    │   │   ├── User.model.js
    │   │   ├── Property.model.js
    │   │   ├── Contact.model.js
    │   │   └── Newsletter.model.js
    │   ├── middlewares/
    │   │   ├── auth.middleware.js
    │   │   ├── upload.middleware.js
    │   │   ├── validate.middleware.js
    │   │   └── error.middleware.js
    │   └── scripts/
    │       └── seed.js
    └── uploads/
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone
git clone <repo-url>
cd vera-real-estate

# Install all dependencies
npm install          # installs both workspaces

# Backend
cd realestate-backend
cp .env.example .env   # fill in values
npm run seed           # seed 4 users + 20 properties

# Frontend
cd ../realestate-frontend
cp .env.example .env.local   # fill in values
```

### Development

```bash
# From root
npm run dev            # starts both frontend (3000) and backend (5050)

# Or individually:
cd realestate-backend && npm run dev
cd realestate-frontend && npm run dev
```

---

## Environment Variables

### Backend (`realestate-backend/.env`)
```env
PORT=5050
MONGO_URI=mongodb://localhost:27017/vera-real-estate
JWT_SECRET=your_very_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend (`realestate-frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

---

## API Reference

### Auth — `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | — | Register new user |
| POST | `/login` | — | Login, returns JWT |
| GET | `/me` | JWT | Get current user |
| PUT | `/update-profile` | JWT | Update profile |
| PUT | `/change-password` | JWT | Change password |

### Properties — `/api/properties`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | List all properties (filterable) |
| GET | `/featured` | — | Get featured properties |
| GET | `/my` | JWT | Get own properties (includes inactive) |
| GET | `/:id` | — | Get property by ID |
| POST | `/` | JWT | Create property |
| PUT | `/:id` | JWT + Owner | Update property (incl. `isActive`) |
| DELETE | `/:id` | JWT + Owner | Delete property |
| POST | `/:id/images` | JWT + Owner | Upload images |
| DELETE | `/:id/images/:imgId` | JWT + Owner | Delete image |

### Subscription — `/api/subscription`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/plans` | — | List available plans |
| POST | `/upgrade` | JWT | Upgrade to a plan `{ plan }` |

### Contact — `/api/contact`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | — | Submit contact form |

### Newsletter — `/api/newsletter`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/subscribe` | — | Subscribe to newsletter |
| POST | `/unsubscribe` | — | Unsubscribe |

### Admin — `/api/admin` (JWT + role:admin)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/stats` | Platform stats (users, listings, plans, contacts, newsletters) |
| GET | `/users` | List all users (paginated, searchable) |
| PATCH | `/users/:id` | Update user (role, plan) |
| DELETE | `/users/:id` | Delete user |
| GET | `/listings` | List all listings (paginated, filterable) |
| PATCH | `/listings/:id/toggle` | Toggle listing active/inactive |
| DELETE | `/listings/:id` | Delete any listing |
| GET | `/contacts` | List contact messages |
| PATCH | `/contacts/:id/read` | Mark contact as read |
| DELETE | `/contacts/:id` | Delete contact message |
| GET | `/newsletters` | List newsletter subscribers |
| DELETE | `/newsletters/:id` | Delete subscriber |

---

## Admin Routes

| URL | Page |
|-----|------|
| `/admin` | Overview dashboard |
| `/admin/users` | User management |
| `/admin/listings` | Listing management |
| `/admin/contacts` | Contact messages |
| `/admin/newsletters` | Newsletter subscribers |

Admin pages are protected by the `(admin)/layout.jsx` which redirects non-admin users to `/my-listings`.

---

## Swagger / API Docs

The backend exposes an interactive API documentation at:

| URL | Description |
|-----|-------------|
| `http://localhost:5050/docs` | Swagger UI (primary) |
| `http://localhost:5050/api-docs` | Swagger UI (alternate) |
| `http://localhost:5050/docs.json` | OpenAPI JSON spec |

The Swagger UI features a custom professional theme with color-coded HTTP method badges, JetBrains Mono for code, and a sticky dark navbar.

---

## Deployment

### Frontend — Vercel
```bash
cd realestate-frontend
vercel --prod
# Set NEXT_PUBLIC_API_URL to your backend URL
```

### Backend — Render / Railway
```bash
# Set env vars in dashboard:
# MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV=production
npm start
```
