# Vera Real Estate Backend

Express 5 tabanlı REST API katmanı.  
Kimlik doğrulama, ilan yönetimi, görsel yükleme, validasyon, güvenlik middleware’leri ve Swagger dokümantasyonu içerir.

## Stack

- Node.js 22
- Express 5
- MongoDB + Mongoose
- JWT auth
- Cloudinary + Multer
- Zod validation
- Winston logging
- Swagger (OpenAPI)

## Proje Yapısı

```text
realestate-backend/
├── src/
│   ├── config/          # db, swagger, cloudinary
│   ├── controllers/     # auth, property
│   ├── middlewares/     # auth, validation, error, upload
│   ├── models/          # User, Property
│   ├── routes/          # auth, property routes
│   ├── scripts/         # seed script
│   └── utils/           # logger, ApiError
├── .env.example
├── server.js
└── package.json
```

## Kurulum

```bash
cd realestate-backend
npm install
cp .env.example .env
```

## Ortam Değişkenleri

### Zorunlu

- `MONGO_URI` (veya `MONGODB_URI`)  
  MongoDB bağlantı adresi.
- `JWT_SECRET`  
  JWT imzalama secret değeri.

### Önerilen / Opsiyonel

- `PORT` (default fallback: `5000`, proje standardı: `5050`)
- `NODE_ENV` (`development`/`production`)
- `JWT_EXPIRES_IN` (default: `1d`)
- `CORS_ORIGINS` (virgülle ayrılmış origin listesi)
- `LOG_LEVEL` (default: `info`)

### Özelliğe Bağlı (görsel upload için gerekli)

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Scriptler

- `npm run dev` → nodemon ile development server
- `npm start` → production benzeri server çalıştırma
- `npm run seed` → örnek admin + ilan verisi yükleme

## API Erişim Noktaları

- Health: `GET /api/health`
- Swagger UI: `GET /api-docs`
- Auth base: `/api/auth`
- Properties base: `/api/properties`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (JWT gerekir)

### Properties

- `GET /api/properties`
- `GET /api/properties/featured`
- `GET /api/properties/my` (JWT gerekir)
- `GET /api/properties/:id`
- `POST /api/properties` (JWT gerekir)
- `PUT /api/properties/:id` (owner/admin)
- `DELETE /api/properties/:id` (owner/admin, soft delete)
- `POST /api/properties/:id/images` (owner/admin)
- `DELETE /api/properties/:id/images/:imgId` (owner/admin)

## Güvenlik Notları

- `helmet`, `hpp`, mongo sanitize ve rate limit aktif.
- JWT olmayan istekler korumalı route’larda reddedilir.
- Owner kontrolü ve role bazlı kısıtlama middleware ile uygulanır.
- Production modunda global error handler stack trace göstermez.

## Seed Verisi

```bash
npm run seed
```

Seed script:
- `User` ve `Property` koleksiyonlarını temizler
- Admin kullanıcı oluşturur: `admin@vera.com / 123456`
- Konya ve İstanbul odaklı örnek ilanlar ekler

## Yerel Çalıştırma

```bash
npm run dev
```

Varsayılan erişim:
- API: [http://localhost:5050](http://localhost:5050)
- Docs: [http://localhost:5050/api-docs](http://localhost:5050/api-docs)

## Deployment Checklist

- `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*` ortam değişkenlerini platformda tanımla.
- `NODE_ENV=production` kullan.
- Frontend originini `CORS_ORIGINS` içine ekle.
- Canlı backend URL’i frontend tarafında `NEXT_PUBLIC_API_URL` olarak tanımla.
