# Vera Real Estate — Backend

Express 5 REST API for the Vera Real Estate platform. Handles authentication, property management, subscriptions, admin operations, contact forms, and newsletter subscriptions.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Authentication | JWT (`jsonwebtoken`) + bcrypt |
| Validation | Joi / Zod |
| File Uploads | Multer (local storage → `uploads/`) |
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
```

### Run

```bash
npm run dev    # nodemon (hot reload)
npm start      # production
npm run seed   # seed database (4 users + 20 properties)
```

---

## Project Structure

```
realestate-backend/
├── src/
│   ├── app.js                          # Express app, middleware, routes, Swagger
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
│   │   ├── auth.middleware.js     # protect, restrictTo, isOwner
│   │   ├── upload.middleware.js   # multer config
│   │   ├── validate.middleware.js # Joi/Zod request validation
│   │   └── error.middleware.js    # global error handler
│   ├── validations/
│   │   ├── auth.validation.js
│   │   └── property.validation.js
│   ├── utils/
│   │   └── ApiError.js
│   └── scripts/
│       └── seed.js                # Database seeder
└── uploads/                       # Uploaded images (gitignored)
```

---

## Models

### User
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name |
| `email` | String | Unique email |
| `password` | String | bcrypt hash (select: false) |
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
| `status` | Enum | `available` / `sold` / `rented` |
| `deedStatus` | Enum | `freehold` / `leasehold` / `shared` |
| `maintenanceFee` | Number | Monthly fee |
| `totalFloors` | Number | Floors in building |
| `parking` | Boolean | Has parking |
| `furnished` | Boolean | Is furnished |
| `virtualTourUrl` | String | 360° tour link |
| `isFeatured` | Boolean | Show on home page |
| `features.rooms` | Number | Room count |
| `features.bathrooms` | Number | Bathroom count |
| `features.floor` | Number | Unit floor |
| `features.heating` | String | Heating system |
| `location.city` | String | City (required) |
| `location.district` | String | District |
| `location.address` | String | Street address |
| `viewCount` | Number | View counter |
| `images` | [String] | Image paths/URLs |
| `isActive` | Boolean | Visible to public |

### Contact
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Sender name |
| `email` | String | Sender email |
| `phone` | String | Phone number |
| `message` | String | Message body |
| `isRead` | Boolean | Read status |

### Newsletter
| Field | Type | Description |
|-------|------|-------------|
| `email` | String | Unique subscriber email |
| `isActive` | Boolean | Active subscription |

---

## API Reference

All routes are prefixed with `/api`.

### Auth — `/api/auth`
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/register` | validate | Register new user |
| POST | `/login` | validate | Login, returns `{ token, user }` |
| GET | `/me` | protect | Get current user |
| PUT | `/update-profile` | protect | Update name, avatar |
| PUT | `/change-password` | protect, validate | Change password |

### Properties — `/api/properties`
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| GET | `/` | — | List all (filter: city, type, listingType, minPrice, maxPrice, rooms, minSize, search, page, limit) |
| GET | `/featured` | — | Featured listings |
| GET | `/my` | protect | Own listings (includes inactive) |
| GET | `/:id` | — | Property detail (increments viewCount) |
| POST | `/` | protect, validate | Create listing |
| PUT | `/:id` | protect, isOwner, validate | Update listing |
| DELETE | `/:id` | protect, isOwner | Delete listing |
| POST | `/:id/images` | protect, isOwner, multer | Upload images (max 5) |
| DELETE | `/:id/images/:imgId` | protect, isOwner | Delete image |

### Subscription — `/api/subscription`
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| GET | `/plans` | — | List plan definitions |
| POST | `/upgrade` | protect | Upgrade plan `{ plan: "professional" \| "corporate" \| "free" }` |

### Contact — `/api/contact`
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/` | — | Submit contact form |

### Newsletter — `/api/newsletter`
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/subscribe` | — | Subscribe |
| POST | `/unsubscribe` | — | Unsubscribe |

### Admin — `/api/admin` (protect + restrictTo('admin'))
| Method | Path | Description |
|--------|------|-------------|
| GET | `/stats` | Aggregated platform stats |
| GET | `/users` | Paginated user list (search, page, limit) |
| PATCH | `/users/:id` | Update user role / subscription plan |
| DELETE | `/users/:id` | Delete user |
| GET | `/listings` | Paginated listing list (search, isActive, page, limit) |
| PATCH | `/listings/:id/toggle` | Toggle listing `isActive` |
| DELETE | `/listings/:id` | Delete any listing |
| GET | `/contacts` | List contact messages |
| PATCH | `/contacts/:id/read` | Mark contact as read |
| DELETE | `/contacts/:id` | Delete contact message |
| GET | `/newsletters` | List newsletter subscribers |
| DELETE | `/newsletters/:id` | Delete subscriber |

---

## Middlewares

| File | Purpose |
|------|---------|
| `auth.middleware.js` | `protect` — validates JWT; `restrictTo(role)` — role guard; `isOwner(Model)` — resource ownership check |
| `upload.middleware.js` | Multer config; accepts `images` field, stores in `uploads/`, limits to 5 files × 5 MB |
| `validate.middleware.js` | Wraps Joi/Zod schemas, returns 400 with field-level errors |
| `error.middleware.js` | Global error handler — formats `ApiError`, Mongoose errors, JWT errors |

---

## Seeder

```bash
npm run seed
```

Creates **4 users** and **20 property listings** covering all model fields:

| User | Email | Password | Role | Plan |
|------|-------|----------|------|------|
| Vera Admin | admin@vera.com | 123456 | admin | corporate |
| Pro Kullanıcı | pro@vera.com | 123456 | user | professional |
| Ali Yılmaz | user1@vera.com | 123456 | user | free |
| Ayşe Kaya | user2@vera.com | 123456 | user | free |

Properties are spread across Istanbul, Ankara, Izmir, Konya, Bursa with varied types, listing types, deed status, amenities, and features.

---

## Swagger / API Docs

| URL | Description |
|-----|-------------|
| `http://localhost:5050/docs` | Swagger UI |
| `http://localhost:5050/api-docs` | Swagger UI (alternate) |
| `http://localhost:5050/docs.json` | OpenAPI JSON |

The Swagger UI uses a custom professional theme: dark navy topbar, color-coded HTTP badges, gold accent brand, JetBrains Mono for code, and smooth operation block animations.

---

## Security

- **Helmet** — sets security headers
- **express-rate-limit** — 100 req / 15 min per IP on `/api`
- **HPP** — prevents HTTP parameter pollution
- **CORS** — whitelist-based origin restriction
- **bcrypt** — rounds 12 for password hashing
- **JWT** — signed with `JWT_SECRET`, expires per `JWT_EXPIRES_IN`
- **isOwner middleware** — prevents users from modifying other users' resources
- Passwords are always excluded from API responses (`select: false`)
