# Vera Real Estate — Full-Stack Emlak Portalı

> Modern, güvenli ve ölçeklenebilir bir full-stack emlak portalı.  
> Kullanıcılar ilan oluşturabilir, görsel yükleyebilir, filtreleyebilir, haritada keşfedebilir ve kendi dashboard alanından ilanlarını yönetebilir.

---

## Proje Mimarisi

```
┌─────────────────────────────────────────────────────────┐
│                     Vera Real Estate                     │
├───────────────────────────┬─────────────────────────────┤
│   realestate-frontend     │   realestate-backend        │
│   Next.js 15 App Router   │   Express 5 REST API        │
│   Port: 3000              │   Port: 5050                │
│                           │                             │
│  ┌─ (public)              │  ┌─ /api/auth               │
│  │   Home, Listings,      │  │   register, login, me,   │
│  │   Detail, Map          │  │   avatar, password       │
│  │                        │  │                          │
│  ├─ (auth)                │  └─ /api/properties         │
│  │   Login, Register      │      list, create, update,  │
│  │                        │      delete, images, my     │
│  └─ (dashboard)           │                             │
│      my-listings,         │  MongoDB  ←→  Cloudinary    │
│      add-listing,         │  (Atlas)       (images)     │
│      edit-listing,        │                             │
│      profile              │  JWT Auth + Helmet + CORS   │
└───────────────────────────┴─────────────────────────────┘
```

---

## Tech Stack

### Frontend

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 15 (App Router), React 19 |
| Styling | Tailwind CSS v4, shadcn/ui (base-nova), tw-animate-css |
| State | Zustand (`useAuthStore`) |
| Data Fetching | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| HTTP | Axios (interceptor ile JWT header) |
| Maps | Leaflet + react-leaflet |
| Icons | lucide-react |
| Toasts | Sonner |

### Backend

| Katman | Teknoloji |
|--------|-----------|
| Framework | Express 5 |
| Veritabanı | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Dosya Yükleme | Multer + Cloudinary |
| Validasyon | Zod + Joi |
| Loglama | Winston + Morgan |
| Güvenlik | Helmet, CORS, Rate Limit, HPP, Mongo Sanitize |
| Dokümantasyon | Swagger UI (swagger-jsdoc) |

---

## Özellikler

- **Kimlik Doğrulama** — JWT tabanlı register/login, token yenileme, `rememberMe` (1 gün / 30 gün)
- **Kullanıcı Profili** — Ad/email güncelleme, avatar yükleme (Cloudinary), şifre değiştirme, hesap silme
- **İlan Yönetimi** — 4 adımlı sihirbaz (temel bilgiler, konum & fiyat, özellikler, görseller)
- **Dashboard** — İlan istatistikleri, görüntülenme sayaçları, aktif/pasif yönetimi, düzenleme
- **Listeleme & Filtreleme** — Şehir, fiyat, oda, ilan tipi, kiralık/satılık filtreleri; sayfalama
- **Harita** — Leaflet ile konum görselleştirme
- **Görsel Yükleme** — Drag & drop, max 12 görsel/ilan, Cloudinary CDN
- **Bildirim Sistemi** — Gerçek ilan verisi tabanlı dinamik bildirimler (frontend)
- **SEO** — Next.js `generateMetadata`, OG tags, structured data
- **Güvenlik** — Helmet, rate limiting, HPP, Mongo sanitize, owner kontrolü

---

## Hızlı Başlangıç

### Gereksinimler

- Node.js ≥ 18
- MongoDB (local veya Atlas)
- Cloudinary hesabı (görsel yükleme için)

### Kurulum

```bash
# 1. Klonla
git clone https://github.com/mehmetcancopur16/vera-real-estate.git
cd vera-real-estate

# 2. Tüm bağımlılıkları kur
npm run install:all

# 3. Backend env ayarla
cp realestate-backend/.env.example realestate-backend/.env
# → MONGO_URI, JWT_SECRET, CLOUDINARY_* değerlerini doldur

# 4. Frontend env ayarla
cp realestate-frontend/.env.local.example realestate-frontend/.env.local
# → NEXT_PUBLIC_API_URL=http://localhost:5050/api

# 5. Geliştirme sunucusunu başlat (iki process aynı anda)
npm run dev
```

Uygulama açılır:
- Frontend: `http://localhost:3000`
- API: `http://localhost:5050/api`
- Swagger: `http://localhost:5050/api-docs`

### Seed Verisi (Opsiyonel)

```bash
cd realestate-backend
npm run seed
```

Admin hesabı: `admin@vera.com` / `123456`

---

## Script Açıklamaları

| Script | Açıklama |
|--------|----------|
| `npm run dev` | Backend + Frontend aynı anda başlatır (concurrently) |
| `npm run dev:backend` | Yalnızca backend başlatır |
| `npm run dev:frontend` | Yalnızca frontend başlatır |
| `npm run install:all` | Root + backend + frontend bağımlılıklarını kurar |

---

## Ortam Değişkenleri

### Backend (`realestate-backend/.env`)

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `MONGO_URI` | ✅ | MongoDB bağlantı URL'i |
| `JWT_SECRET` | ✅ | Token imzalama anahtarı (min 32 karakter önerilir) |
| `PORT` | — | API portu (varsayılan: 5050) |
| `NODE_ENV` | — | `development` / `production` |
| `JWT_EXPIRES_IN` | — | Token geçerlilik süresi (varsayılan: `1d`) |
| `CORS_ORIGINS` | — | İzin verilen origin'ler (virgülle ayrılmış) |
| `CLOUDINARY_CLOUD_NAME` | — | Cloudinary cloud adı |
| `CLOUDINARY_API_KEY` | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | — | Cloudinary API secret |

### Frontend (`realestate-frontend/.env.local`)

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL (ör. `http://localhost:5050/api`) |

---

## API Endpoint Özeti

### Auth — `/api/auth`

| Method | Path | Auth | Açıklama |
|--------|------|------|----------|
| POST | `/register` | — | Yeni kullanıcı kaydı |
| POST | `/login` | — | Giriş, JWT döner |
| GET | `/me` | JWT | Profil bilgisi |
| PATCH | `/me` | JWT | Ad / email güncelle |
| PATCH | `/password` | JWT | Şifre değiştir |
| POST | `/avatar` | JWT | Avatar yükle (multipart) |
| DELETE | `/me` | JWT | Hesap sil |

### Properties — `/api/properties`

| Method | Path | Auth | Açıklama |
|--------|------|------|----------|
| GET | `/` | — | Filtreli ilan listesi |
| GET | `/featured` | — | Öne çıkan 6 ilan |
| GET | `/my` | JWT | Kullanıcının kendi ilanları |
| GET | `/:id` | — | İlan detayı |
| POST | `/` | JWT | Yeni ilan oluştur |
| PUT | `/:id` | JWT + Owner | İlan güncelle |
| DELETE | `/:id` | JWT + Owner | İlan sil |
| POST | `/:id/images` | JWT + Owner | Görsel yükle (max 5/istek) |
| DELETE | `/:id/images/:imgId` | JWT + Owner | Görsel sil |

---

## Deployment

### Frontend → Vercel

```bash
# Vercel CLI
npx vercel --cwd realestate-frontend

# Environment Variables (Vercel Dashboard):
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
```

### Backend → Render / Railway

```bash
# Root dizini: realestate-backend
# Build command: npm install
# Start command: node server.js

# Gerekli env var'lar: MONGO_URI, JWT_SECRET, CLOUDINARY_*
# CORS_ORIGINS=https://your-frontend.vercel.app
```

### Veritabanı → MongoDB Atlas

1. Atlas'ta yeni cluster oluştur
2. Database user ekle
3. Connection string'i `MONGO_URI` olarak ayarla
4. Network Access → `0.0.0.0/0` (veya Render/Railway IP'si)

---

## Proje Yapısı

```
vera-real-estate/
├── package.json              # Root scripts (concurrently)
├── README.md
├── realestate-backend/
│   ├── server.js             # Express başlatma
│   ├── .env.example
│   └── src/
│       ├── app.js            # Middleware, route mount
│       ├── config/           # DB, Cloudinary
│       ├── controllers/      # auth, property
│       ├── middlewares/      # auth, upload, validate, error
│       ├── models/           # User, Property
│       ├── routes/           # auth, property routes
│       ├── scripts/          # seed.js
│       ├── utils/            # ApiError, logger
│       └── validations/      # Zod schemas
└── realestate-frontend/
    ├── app/
    │   ├── (public)/         # Home, listings, detail
    │   ├── (auth)/           # Login, register
    │   ├── (dashboard)/      # my-listings, add/edit-listing, profile
    │   ├── globals.css
    │   └── layout.tsx
    ├── components/
    │   ├── ui/               # shadcn bileşenleri
    │   ├── forms/            # PropertyForm
    │   ├── layout/           # Navbar, Footer
    │   ├── property/         # PropertyCard, PropertyList
    │   └── map/              # MapView
    ├── services/             # auth.service.js, property.service.js
    ├── store/                # useAuthStore.js
    └── lib/                  # axios.js, utils.ts
```

---

## Katkıda Bulunma

1. Bu repo'yu fork'la
2. Feature branch oluştur: `git checkout -b feat/yeni-ozellik`
3. Değişikliklerini commit'le: `git commit -m "feat: yeni özellik"`
4. Branch'ini push'la: `git push origin feat/yeni-ozellik`
5. Pull Request aç

---

## Lisans

MIT © 2025 Vera Real Estate

---

## Admin Panel

Admin kullanıcılar `/admin` route grubuna erişebilir (role: `admin`).

### Admin Rotaları

| Rota | Açıklama |
|------|----------|
| `/admin` | Genel bakış — kullanıcı/ilan istatistikleri, plan dağılımı |
| `/admin/users` | Kullanıcı yönetimi — plan/rol değiştir, kullanıcı sil |
| `/admin/listings` | İlan yönetimi — aktif/pasif yap, ilan sil |

### Admin Seed Kullanıcısı

MongoDB'de bir kullanıcının `role` alanını `"admin"` olarak güncelle:

```js
db.users.updateOne({ email: "admin@vera.com" }, { $set: { role: "admin" } })
```

---

## Abonelik Sistemi

| Plan | İlan Limiti | Ücret |
|------|-------------|-------|
| Free | 3 ilan | Ücretsiz |
| Professional | 7 ilan | ₺299/ay |
| Corporate | Sınırsız | ₺799/ay |

### Mock Ödeme Akışı

1. `/upgrade` — Plan seçim sayfası
2. `/upgrade/checkout?plan=professional` — Görsel kart flip animasyonu ile ödeme formu
3. `/upgrade/success?plan=professional` — Konfeti animasyonu ile başarı ekranı

> Not: Bu platform demo amaçlıdır; gerçek ödeme alınmaz.
