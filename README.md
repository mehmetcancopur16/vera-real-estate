# Vera Real Estate — Full-Stack Emlak Portalı

> Modern, güvenli ve ölçeklenebilir full-stack emlak portalı.  
> Next.js 15 frontend + Express 5 REST API + MongoDB + Cloudinary.

[![API Docs](https://img.shields.io/badge/API%20Docs-Swagger%20UI-85EA2D?logo=swagger)](http://localhost:5050/docs)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=next.js)](http://localhost:3000)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## Proje Mimarisi

```
┌──────────────────────────────────────────────────────────────────┐
│                         Vera Real Estate                         │
├─────────────────────────────┬────────────────────────────────────┤
│   realestate-frontend       │   realestate-backend               │
│   Next.js 15 App Router     │   Express 5 REST API               │
│   Port: 3000                │   Port: 5050                       │
│                             │                                    │
│  ┌─ (public)                │  /api/auth        → JWT auth       │
│  │  Home, Listings, Detail  │  /api/properties  → İlan CRUD      │
│  │  Blog, Contact, About    │  /api/contact     → Form mesajı    │
│  │  /docs → API Docs sayfası│  /api/newsletter  → Abonelik       │
│  │                          │  /api/subscription→ Plan yönetimi  │
│  ├─ (auth)                  │  /api/admin       → Admin panel    │
│  │  Login, Register         │                                    │
│  │                          │  /docs    → Swagger UI             │
│  ├─ (dashboard)             │  /api-docs → Swagger UI (alias)    │
│  │  my-listings, add/edit   │  /docs.json → OpenAPI spec         │
│  │  profile, upgrade        │                                    │
│  │                          │  MongoDB  ←→  Cloudinary           │
│  └─ (admin)                 │  JWT + Helmet + Rate Limit         │
│     /admin → Dashboard      └────────────────────────────────────┘
│     /admin/users
│     /admin/listings
│     /admin/contacts
│     /admin/newsletters
└─────────────────────────────
```

---

## Tech Stack

### Frontend

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 15 (App Router), React 19 |
| Styling | Tailwind CSS v4, shadcn/ui (base-nova) |
| State | Zustand (`useAuthStore`) |
| Data Fetching | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| HTTP | Axios (JWT interceptor) |
| Maps | Leaflet + react-leaflet |
| Icons | lucide-react |
| Toasts | Sonner |
| UI Primitives | @base-ui/react |

### Backend

| Katman | Teknoloji |
|--------|-----------|
| Framework | Express 5 |
| Veritabanı | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Dosya Yükleme | Multer + Cloudinary |
| Validasyon | Zod |
| Loglama | Winston + Morgan |
| Güvenlik | Helmet, CORS, Rate Limit, HPP, Mongo Sanitize |
| Dokümantasyon | **Swagger UI** (swagger-jsdoc + swagger-ui-express) |

---

## Özellikler

### Genel Kullanıcı
- JWT tabanlı register/login (`rememberMe` ile 1 gün / 30 gün)
- Profil güncelleme, avatar yükleme (Cloudinary), şifre değiştirme
- 4 adımlı ilan oluşturma sihirbazı
- İlan listeleme: şehir, fiyat, oda, tip, kiralık/satılık filtreleri
- Leaflet haritasında konum görselleştirme
- Drag & drop görsel yükleme (max 12/ilan, Cloudinary CDN)
- Bildirim sistemi (ilan verisi tabanlı)
- Abonelik sistemi: Free / Professional / Corporate

### Admin Panel (`/admin`)
- Genel bakış: kullanıcı/ilan/mesaj/bülten istatistikleri, plan dağılımı
- Kullanıcı yönetimi: arama, plan/rol değiştirme, silme
- İlan yönetimi: aktif/pasif yapma, silme
- Mesaj yönetimi: okundu işaretleme, email yanıt, silme
- Newsletter yönetimi: abone listeleme, silme

### API Dokümantasyonu
- Swagger UI: `http://localhost:5050/docs`
- OpenAPI JSON spec: `http://localhost:5050/docs.json`
- Frontend özet sayfası: `http://localhost:3000/docs`

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

# 3. Backend env
cp realestate-backend/.env.example realestate-backend/.env
# → .env içine MONGO_URI, JWT_SECRET ve Cloudinary bilgilerini gir

# 4. Frontend env
cp realestate-frontend/.env.local.example realestate-frontend/.env.local
# → NEXT_PUBLIC_API_URL=http://localhost:5050/api

# 5. Geliştirme sunucusunu başlat
npm run dev
```

| URL | Servis |
|-----|--------|
| `http://localhost:3000` | Frontend |
| `http://localhost:5050/api` | REST API |
| `http://localhost:5050/docs` | Swagger UI |
| `http://localhost:3000/docs` | API özet sayfası |

### Seed Verisi (Opsiyonel)

```bash
cd realestate-backend && npm run seed
```

Oluşturulan admin hesabı: `admin@vera.com` / `123456`

---

## Scriptler

| Script | Açıklama |
|--------|----------|
| `npm run dev` | Backend + Frontend eş zamanlı başlatır |
| `npm run dev:backend` | Yalnızca backend |
| `npm run dev:frontend` | Yalnızca frontend |
| `npm run install:all` | Tüm bağımlılıkları kurar |

---

## Ortam Değişkenleri

### Backend (`realestate-backend/.env`)

| Değişken | Zorunlu | Açıklama |
|----------|:-------:|----------|
| `MONGO_URI` | ✅ | MongoDB bağlantı URL'i |
| `JWT_SECRET` | ✅ | Token imzalama anahtarı (≥ 32 karakter) |
| `PORT` | — | API portu (varsayılan: 5050) |
| `NODE_ENV` | — | `development` / `production` |
| `JWT_EXPIRES_IN` | — | Token geçerlilik süresi (varsayılan: `1d`) |
| `CORS_ORIGINS` | — | İzin verilen origin'ler (virgülle ayrılmış) |
| `CLOUDINARY_CLOUD_NAME` | — | Cloudinary cloud adı |
| `CLOUDINARY_API_KEY` | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | — | Cloudinary API secret |

### Frontend (`realestate-frontend/.env.local`)

| Değişken | Zorunlu | Açıklama |
|----------|:-------:|----------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL (`http://localhost:5050/api`) |

---

## API Endpoint Özeti

> Tam etkileşimli dokümantasyon için → **[Swagger UI](http://localhost:5050/docs)**

### Auth — `/api/auth`

| Method | Path | Auth | Açıklama |
|--------|------|:----:|----------|
| POST | `/register` | — | Yeni kullanıcı kaydı |
| POST | `/login` | — | Giriş, JWT döner |
| GET | `/me` | JWT | Profil bilgisi |
| PATCH | `/me` | JWT | Ad / email güncelle |
| PATCH | `/password` | JWT | Şifre değiştir |
| POST | `/avatar` | JWT | Avatar yükle (multipart) |
| DELETE | `/me` | JWT | Hesap sil |

### Properties — `/api/properties`

| Method | Path | Auth | Açıklama |
|--------|------|:----:|----------|
| GET | `/` | — | Filtreli ilan listesi |
| GET | `/featured` | — | Öne çıkan 6 ilan |
| GET | `/my` | JWT | Kullanıcının ilanları |
| GET | `/:id` | — | İlan detayı |
| POST | `/` | JWT | Yeni ilan oluştur |
| PUT | `/:id` | JWT+Owner | İlan güncelle |
| DELETE | `/:id` | JWT+Owner | İlan sil |
| POST | `/:id/images` | JWT+Owner | Görsel yükle |
| DELETE | `/:id/images/:imgId` | JWT+Owner | Görsel sil |

### Contact — `/api/contact`

| Method | Path | Auth | Açıklama |
|--------|------|:----:|----------|
| POST | `/` | — | İletişim formu gönder |

### Newsletter — `/api/newsletter`

| Method | Path | Auth | Açıklama |
|--------|------|:----:|----------|
| POST | `/subscribe` | — | Email aboneliği |

### Subscription — `/api/subscription`

| Method | Path | Auth | Açıklama |
|--------|------|:----:|----------|
| GET | `/plans` | — | Mevcut planlar |
| POST | `/upgrade` | JWT | Plan yükselt |

### Admin — `/api/admin` _(Admin JWT gerekli)_

| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/stats` | Dashboard istatistikleri |
| GET | `/users` | Kullanıcı listesi |
| PATCH | `/users/:id` | Kullanıcı güncelle |
| DELETE | `/users/:id` | Kullanıcı sil |
| GET | `/listings` | Tüm ilanlar |
| PATCH | `/listings/:id/toggle` | Aktif/pasif yap |
| DELETE | `/listings/:id` | İlan sil |
| GET | `/contacts` | İletişim mesajları |
| PATCH | `/contacts/:id/read` | Okundu işaretle |
| DELETE | `/contacts/:id` | Mesaj sil |
| GET | `/newsletters` | Bülten aboneleri |
| DELETE | `/newsletters/:id` | Abone sil |

---

## API Dokümantasyonu (Swagger)

Tüm endpoint'ler OpenAPI 3.0.3 formatında belgelenmiştir.

### Erişim Yolları

| URL | Açıklama |
|-----|----------|
| `http://localhost:5050/docs` | Etkileşimli Swagger UI |
| `http://localhost:5050/api-docs` | Swagger UI (alias) |
| `http://localhost:5050/docs.json` | Ham OpenAPI JSON spec |
| `http://localhost:3000/docs` | Frontend özet sayfası |

### Swagger UI Özellikleri
- JWT Bearer token ile kimlik doğrulama (`Authorize` butonu)
- `persistAuthorization: true` — sayfa yenilemesinde token saklanır
- Endpoint filtreleme ve arama
- İstek süresi görüntüleme
- Tüm şemalar: User, Property, Contact, Newsletter, Subscription, Error, Pagination

### Swagger UI Ekran Görüntüsü

```
http://localhost:5050/docs
├── System
│   └── GET /api/health
├── Auth (7 endpoint)
├── Properties (9 endpoint)
├── Contact (1 endpoint)
├── Newsletter (1 endpoint)
├── Subscription (2 endpoint)
├── Admin — Stats (1 endpoint)
├── Admin — Users (3 endpoint)
├── Admin — Listings (3 endpoint)
├── Admin — Contacts (3 endpoint)
└── Admin — Newsletters (2 endpoint)
```

---

## Admin Panel

Admin kullanıcılar `/admin` route grubuna erişebilir. Navbar'daki profil menüsünde "Admin Panel" linki görünür (yalnızca `role: "admin"` kullanıcılarda).

### Admin Rotaları

| Rota | Açıklama |
|------|----------|
| `/admin` | Genel bakış dashboard |
| `/admin/users` | Kullanıcı yönetimi |
| `/admin/listings` | İlan yönetimi |
| `/admin/contacts` | İletişim mesaj yönetimi |
| `/admin/newsletters` | Newsletter abone yönetimi |

### Admin Kullanıcı Oluşturma

```js
// MongoDB shell
db.users.updateOne({ email: "admin@vera.com" }, { $set: { role: "admin" } })
```

---

## Abonelik Sistemi

| Plan | İlan Limiti | Ücret |
|------|:-----------:|-------|
| Free | 3 ilan | Ücretsiz |
| Professional | 7 ilan | ₺299/ay |
| Corporate | Sınırsız | ₺799/ay |

### Mock Ödeme Akışı

1. `/upgrade` — Plan seçim sayfası
2. `/upgrade/checkout?plan=professional` — Kart flip animasyonlu ödeme formu
3. `/upgrade/success?plan=professional` — Konfeti animasyonlu başarı ekranı

> Not: Bu platform demo amaçlıdır; gerçek ödeme alınmaz.

---

## Proje Yapısı

```
vera-real-estate/
├── package.json
├── README.md
├── realestate-backend/
│   ├── server.js
│   ├── .env.example
│   └── src/
│       ├── app.js                   # Middleware, route mount, Swagger setup
│       ├── config/
│       │   ├── db.js
│       │   └── swagger.config.js    # OpenAPI 3.0.3 tam şemalar
│       ├── controllers/
│       │   ├── admin.controller.js
│       │   ├── auth.controller.js
│       │   ├── contact.controller.js
│       │   ├── newsletter.controller.js
│       │   ├── property.controller.js
│       │   └── subscription.controller.js
│       ├── middlewares/
│       ├── models/
│       │   ├── User.model.js
│       │   ├── Property.model.js
│       │   ├── Contact.model.js
│       │   └── Newsletter.model.js
│       ├── routes/                  # Tüm route'larda @openapi JSDoc
│       ├── scripts/                 # seed.js
│       ├── utils/
│       └── validations/
└── realestate-frontend/
    ├── app/
    │   ├── (public)/
    │   │   ├── docs/page.jsx        # API özet sayfası → /docs
    │   │   └── ...
    │   ├── (auth)/
    │   ├── (dashboard)/
    │   └── (admin)/
    │       └── admin/
    │           ├── page.jsx
    │           ├── users/
    │           ├── listings/
    │           ├── contacts/
    │           └── newsletters/
    ├── components/
    ├── services/
    │   └── admin.service.js         # contacts + newsletters dahil
    ├── store/
    └── lib/
```

---

## Deployment

### Frontend → Vercel

```bash
npx vercel --cwd realestate-frontend
# Environment: NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
```

### Backend → Render / Railway

```
Root: realestate-backend
Build: npm install
Start: node server.js
Env: MONGO_URI, JWT_SECRET, CLOUDINARY_*, CORS_ORIGINS
```

### Veritabanı → MongoDB Atlas

1. Yeni cluster oluştur
2. Database user ekle
3. `MONGO_URI` olarak connection string'i ayarla
4. Network Access → `0.0.0.0/0`

---

## Katkıda Bulunma

1. Fork'la
2. Branch: `git checkout -b feat/yeni-ozellik`
3. Commit: `git commit -m "feat: yeni özellik"`
4. Push: `git push origin feat/yeni-ozellik`
5. Pull Request aç

---

## Lisans

MIT © 2025 Vera Real Estate
