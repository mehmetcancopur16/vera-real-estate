# Vera Real Estate

Full-stack emlak ilan portalı. Next.js 15 (App Router) ile yazılmış bir web istemcisi ve Express 5 tabanlı bir REST API'den oluşur. Kullanıcılar ilan oluşturup yönetebilir, ziyaretçiler ilanları filtreleyip detaylarını görüntüleyebilir, yöneticiler tüm platformu tek panelden denetleyebilir.

## Mimari

```
vera-real-estate/
├── realestate-frontend/   Next.js 15 — App Router (React 19, Tailwind CSS 4)
└── realestate-backend/    Express 5 — MongoDB, JWT, Zod, Multer
```

İstemci ile API arasındaki iletişim ortak bir Axios örneği üzerinden gerçekleşir. Kimlik doğrulama için JWT kullanılır; token istemci tarafında `localStorage`'da tutulur ve `Authorization: Bearer <token>` başlığıyla iletilir.

## Teknoloji

| Katman   | Teknoloji                                                                 |
|----------|---------------------------------------------------------------------------|
| Frontend | Next.js 15, React 19, Tailwind CSS 4, Shadcn UI, Zustand, TanStack Query  |
| Backend  | Express 5, MongoDB (Mongoose), JWT, bcryptjs, Zod, Multer                 |
| Güvenlik | Helmet, express-rate-limit, HPP, CORS allowlist, mongo-sanitize           |
| Dokümantasyon | Swagger UI + OpenAPI (swagger-jsdoc)                                 |

Servis ve modül detayları için alt klasörlerin README dosyalarına bakın:

- [realestate-backend/README.md](realestate-backend/README.md)
- [realestate-frontend/README.md](realestate-frontend/README.md)

## Hızlı Başlangıç

Gereksinimler: Node.js 20+, yerel veya bulut tabanlı MongoDB.

```bash
git clone <repo-url>
cd vera-real-estate
npm run install:all

cp realestate-backend/.env.example  realestate-backend/.env
cp realestate-frontend/.env.example realestate-frontend/.env.local

npm run seed   # opsiyonel: örnek veri seti yükler
npm run dev    # frontend (3000) + backend (5050) eşzamanlı
```

Tek tek başlatmak için:

```bash
npm run dev:backend
npm run dev:frontend
```

## Ortam Değişkenleri

`realestate-backend/.env`

```env
PORT=5050
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/vera_real_estate
JWT_SECRET=<64_karakterlik_random_hex>
JWT_EXPIRES_IN=7d
# Üretim: virgülle ayrılmış izinli frontend origin'leri
# CORS_ORIGINS=https://your-frontend.vercel.app
```

`JWT_SECRET` üretmek için:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`realestate-frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

## API Genel Bakış

Tüm rotalar `/api` öneki altındadır. Tam endpoint listesi ve gövde şemaları için Swagger UI'a bakın.

| Grup         | Önek                | Notlar                                        |
|--------------|---------------------|-----------------------------------------------|
| Auth         | `/api/auth`         | Register, login, profil, şifre, avatar        |
| Properties   | `/api/properties`   | CRUD, filtreleme, görsel yükleme, öne çıkanlar|
| Subscription | `/api/subscription` | Planlar ve yükseltme                          |
| Contact      | `/api/contact`      | İletişim formu                                |
| Newsletter   | `/api/newsletter`   | Bülten aboneliği                              |
| Admin        | `/api/admin`        | Yönetici operasyonları (JWT + role: admin)    |
| System       | `/api/health`       | Sağlık kontrolü                               |

Swagger UI: `http://localhost:5050/docs`
OpenAPI JSON: `http://localhost:5050/docs.json`

## Abonelik Planları

| Plan         | Fiyat   | İlan limiti | Notlar                                |
|--------------|---------|-------------|---------------------------------------|
| Free         | Ücretsiz| 3           | Standart görünürlük                   |
| Professional | 299 ₺/ay| 7           | Öne çıkan ilan, istatistik, öncelik    |
| Corporate    | 799 ₺/ay| Sınırsız    | Tüm Pro özellikler + analitik, destek  |

Bu bir demo portaldır; ödeme entegrasyonu çalıştırılmaz.

## Dağıtım

- Frontend: Vercel. `NEXT_PUBLIC_API_URL` üretim backend URL'ine ayarlanmalı, gerekli ek görsel kaynakları `next.config.ts` `images.remotePatterns` listesine eklenmelidir.
- Backend: Render, Railway veya Fly.io. Tüm `.env` değişkenleri panelden tanımlanmalı; `NODE_ENV=production` ve `CORS_ORIGINS` mutlaka set edilmelidir.

## Lisans

ISC.
