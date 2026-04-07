# Vera Real Estate — Backend

Express 5 REST API for the Vera Real Estate platform. Handles authentication, property management, subscriptions, admin operations, contact forms, and newsletter subscriptions.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Express 5 |
| Entry Point | `src/app.js` (imported by `server.js` at root of package) |
| Database | MongoDB + Mongoose |
| Authentication | JWT (`jsonwebtoken`) + bcryptjs (rounds 12) |
| Validation | Zod |
| File Uploads | Multer (local disk storage → `uploads/`) |
| Security | Helmet, express-rate-limit, HPP, CORS |
| API Documentation | swagger-jsdoc + swagger-ui-express |
| Environment | dotenv |

---

## Installation

```bash
npm install
cp .env.example .env
```

### `.env`
```env
PORT=5050
MONGO_URI=mongodb://localhost:27017/vera-real-estate
JWT_SECRET=your_very_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
# Optional: comma-separated allowed origins for production CORS
CORS_ORIGINS=https://your-frontend.vercel.app
```

### Run

```bash
npm run dev    # nodemon with hot reload
npm start      # production
npm run seed   # seed database (6 users + 23 properties + 8 contacts + 12 newsletter subscribers)
```

---

## Project Structure

```
realestate-backend/
├── src/
│   ├── app.js                          # Express app, middleware, routes, Swagger setup
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
│   │   ├── auth.middleware.js         # protect, restrictTo, isOwner
│   │   ├── upload.middleware.js       # multer config (images, max 5 × 5 MB)
│   │   ├── validate.middleware.js     # Zod request validation wrapper
│   │   ├── error.middleware.js        # global error handler
│   │   └── mongo-sanitize.middleware.js
│   ├── validations/
│   │   ├── auth.validation.js
│   │   ├── property.validation.js
│   │   ├── admin.validation.js
│   │   ├── contact.validation.js
│   │   └── subscription.validation.js
│   ├── config/
│   │   ├── db.js                      # Mongoose connection
│   │   └── swagger.config.js          # Swagger JSDoc options + schemas
│   ├── utils/
│   │   ├── ApiError.js
│   │   └── logger.js
│   └── scripts/
│       └── seed.js                    # Database seeder
└── uploads/                           # Uploaded property images (gitignored)
```

---

## Models

### User
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name |
| `email` | String | Unique email |
| `password` | String | bcryptjs hash (select: false) |
| `avatarUrl` | String | Profile image URL |
| `role` | Enum | `user` / `admin` |
| `subscription.plan` | Enum | `free` / `professional` / `corporate` |
| `subscription.expiresAt` | Date | Plan expiry (null for free) |

Methods: `matchPassword(candidate)` · `toJSON` strips password.

### Property
| Field | Type | Description |
|-------|------|-------------|
| `owner` | ObjectId | Ref: User |
| `title` | String | Listing title |
| `description` | String | Full description |
| `type` | Enum | `apartment` / `house` / `land` / `commercial` |
| `listingType` | Enum | `sale` / `rent` |
| `price` | Number | Price |
| `currency` | String | Default `TRY` |
| `size` | Number | Area m² |
| `amenities` | [String] | List of amenities |
| `yearBuilt` | Number | Year of construction |
| `status` | Enum | `ready` / `under-construction` |
| `deedStatus` | String | Free text (e.g. `freehold`, `leasehold`, `shared`) |
| `maintenanceFee` | Number | Monthly fee |
| `totalFloors` | Number | Floors in building |
| `parking` | Boolean | Has parking |
| `furnished` | Boolean | Is furnished |
| `virtualTourUrl` | String | 360° tour link |
| `isFeatured` | Boolean | Show on home page |
| `features.rooms` | Number | Room count |
| `features.bathrooms` | Number | Bathroom count |
| `features.floor` | Number | Unit floor |
| `features.heating` | String | Heating system (free text) |
| `location.city` | String | City (required) |
| `location.district` | String | District |
| `location.address` | String | Street address |
| `viewCount` | Number | View counter |
| `images` | [String] | Image paths served from `/uploads/` |
| `isActive` | Boolean | Visible to public |

### Contact
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Sender name |
| `email` | String | Sender email |
| `phone` | String | Phone number (optional) |
| `message` | String | Message body |
| `isRead` | Boolean | Read status (default: false) |

### Newsletter
| Field | Type | Description |
|-------|------|-------------|
| `email` | String | Unique subscriber email |
| `isActive` | Boolean | Active subscription (default: true) |

---

## API Reference

All routes are prefixed with `/api`.

### Auth — `/api/auth`
> **Rate limited:** `/register` and `/login` are limited to 10 requests per 15 minutes per IP (failed requests only).

| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/register` | validate, authLimiter | Register new user |
| POST | `/login` | validate, authLimiter | Login, returns `{ token, user }` |
| GET | `/me` | protect | Get current user |
| PATCH | `/update-profile` | protect, validate | Update name, email |
| PATCH | `/change-password` | protect, validate | Change password |
| POST | `/upload-avatar` | protect, multer | Upload profile avatar |
| DELETE | `/me` | protect, validate | Delete own account (requires password) |

### Properties — `/api/properties`
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| GET | `/` | — | List all (filter: `city`, `type`, `listingType`, `minPrice`, `maxPrice`, `rooms`, `minSize`, `search`, `sortBy`, `page`, `limit`) |
| GET | `/featured` | — | Featured listings (isFeatured: true) |
| GET | `/my` | protect | Own listings (includes inactive) |
| GET | `/:id` | — | Property detail (increments viewCount) |
| POST | `/` | protect, validate | Create listing |
| PUT | `/:id` | protect, isOwner, validate | Update listing |
| DELETE | `/:id` | protect, isOwner | Delete listing + disk images |
| POST | `/:id/images` | protect, isOwner, multer | Upload images to disk (max 5) |
| DELETE | `/:id/images/:imgId` | protect, isOwner | Delete image from disk and DB |

### Subscription — `/api/subscription`
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| GET | `/plans` | — | List plan definitions |
| POST | `/upgrade` | protect, validate | Upgrade plan `{ plan: "free" \| "professional" \| "corporate" }` |

### Contact — `/api/contact`
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/` | — | Submit contact form |

### Newsletter — `/api/newsletter`
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/subscribe` | — | Subscribe with email |

### System
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Returns `{ success, message, service, timestamp }` |

### Admin — `/api/admin` (protect + restrictTo('admin'))
| Method | Path | Description |
|--------|------|-------------|
| GET | `/stats` | Aggregated platform stats |
| GET | `/users` | Paginated user list (query: `search`, `hasListings`, `isActive`, `page`, `limit`) |
| PATCH | `/users/:id` | Update user role / subscription plan |
| DELETE | `/users/:id` | Delete user |
| GET | `/listings` | Paginated listing list (query: `search`, `isActive`, `page`, `limit`) |
| PATCH | `/listings/:id/toggle` | Toggle listing `isActive` |
| DELETE | `/listings/:id` | Delete any listing |
| GET | `/contacts` | List contact messages (query: `isRead`, `page`, `limit`) |
| PATCH | `/contacts/:id/read` | Mark contact as read |
| DELETE | `/contacts/:id` | Delete contact message |
| GET | `/newsletters` | List newsletter subscribers (query: `isActive`, `page`, `limit`) |
| DELETE | `/newsletters/:id` | Delete subscriber |

> **Note:** `hasListings` and `isActive` query parameters must be sent as string `"true"` or `"false"`.

---

## Middlewares

| File | Purpose |
|------|---------|
| `auth.middleware.js` | `protect` — validates JWT; `restrictTo(role)` — role guard; `isOwner(Model)` — resource ownership check |
| `upload.middleware.js` | Multer config; accepts `images` field, stores in `uploads/`, limits to 5 files × 5 MB |
| `validate.middleware.js` | Wraps Zod schemas, returns 400 with field-level errors on validation failure |
| `error.middleware.js` | Global error handler — formats `ApiError`, Mongoose errors, JWT errors |
| `mongo-sanitize.middleware.js` | Sanitizes request body/query to prevent NoSQL injection |

---

## Seeder

```bash
npm run seed
```

Creates test data:

| User | Email | Password | Role | Plan |
|------|-------|----------|------|------|
| Vera Admin | admin@vera.com | 123456 | admin | corporate |
| Mehmet Çelik | pro@vera.com | 123456 | user | professional |
| Emre Doğan | corp@vera.com | 123456 | user | corporate |
| Ali Yılmaz | user1@vera.com | 123456 | user | free |
| Ayşe Kaya | user2@vera.com | 123456 | user | free |
| Selin Arslan | user3@vera.com | 123456 | user | free |

**Properties:** 23 listings across Istanbul, Ankara, Izmir, Bursa, Konya, and Antalya — covering all types (`apartment`, `house`, `land`, `commercial`), both `status` values (`ready`, `under-construction`), active and inactive listings.

**Contacts:** 8 messages with mixed read/unread status.

**Newsletter:** 12 subscribers with mixed active/inactive status.

---

## Swagger / API Docs

| URL | Description |
|-----|-------------|
| `http://localhost:5050/docs` | Swagger UI (primary) |
| `http://localhost:5050/api-docs` | Swagger UI (alternate) |
| `http://localhost:5050/docs.json` | OpenAPI JSON spec |

The Swagger UI uses a custom dark professional theme: navy topbar, color-coded HTTP method badges, gold accent branding, JetBrains Mono for code blocks, and smooth operation animations.

---

## Security

| Measure | Details |
|---------|---------|
| **Helmet** | Strict security headers (CSP relaxed only for Swagger routes) |
| **express-rate-limit (global)** | 100 req / 15 min per IP on all `/api` routes |
| **express-rate-limit (auth)** | 10 req / 15 min per IP on `/api/auth/login` and `/api/auth/register` (failed requests only) |
| **HPP** | Prevents HTTP parameter pollution |
| **CORS** | Whitelist-based origin restriction; extend via `CORS_ORIGINS` env var |
| **bcryptjs** | Rounds 12 for password hashing |
| **JWT** | Signed with `JWT_SECRET`, expires per `JWT_EXPIRES_IN` |
| **isOwner middleware** | Prevents users from modifying other users' resources |
| **Zod validation** | All mutating endpoints validate request body before controller |
| **select: false on password** | Password hash is never returned in API responses |
