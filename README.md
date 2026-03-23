# Vera Real Estate

Modern, güvenli ve SEO odaklı bir full-stack emlak portalı.

Bu monorepo; backend (Node.js + Express + MongoDB) ve frontend (Next.js + Tailwind + shadcn/ui) katmanlarını tek projede birleştirir. Kullanıcılar JWT ile giriş yapabilir, ilan oluşturabilir, görsel yükleyebilir, ilanlarını yönetebilir, gelişmiş filtreleme yapabilir ve ilanları harita üzerinde görüntüleyebilir.

## Monorepo Yapısı

```text
vera-real-estate/
├── realestate-backend/    # Express API, MongoDB, Cloudinary, Swagger
├── realestate-frontend/   # Next.js 15 App Router, Zustand, React Query
└── README.md              # Bu dosya
```

## Teknoloji Özeti

- Frontend: Next.js 15, React 19, Tailwind CSS v4, shadcn/ui, Zustand, TanStack Query, Leaflet
- Backend: Node.js 22, Express 5, MongoDB + Mongoose, JWT, Cloudinary, Zod, Winston, Swagger

## Öne Çıkan Özellikler

- JWT authentication + protected routes
- Role/owner authorization (admin/sahip kontrolü)
- Dinamik ilan filtreleme (şehir, fiyat, oda, metin arama, sayfalama)
- Cloudinary çoklu görsel yükleme ve görsel silme
- Dashboard: ilan ekleme, ilan listeleme, soft delete
- Harita entegrasyonu (Leaflet + SSR-safe dynamic import)
- Next.js dinamik metadata ile ilan detay SEO
- Merkezi hata yakalama, rate-limit, mongo sanitize, hpp güvenlik katmanı

## Hızlı Başlangıç

### 1) Repo klonla

```bash
git clone https://github.com/mehmetcancopur16/vera-real-estate.git
cd vera-real-estate
```

### 2) Tüm bağımlılıkları tek komutla kur

```bash
npm run install:all
```

### 3) Ortam değişkenlerini ayarla

- Backend: `realestate-backend/.env.example` dosyasını `realestate-backend/.env` olarak kopyala ve doldur.
- Frontend: `realestate-frontend/.env.local` oluştur:

```env
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

### 4) Tek komutla backend + frontend başlat

```bash
npm run dev
```

## Kullanılan Root Scriptler

- `npm run dev:backend` → backend dev server
- `npm run dev:frontend` → frontend dev server
- `npm run dev` → concurrently ile ikisini birden çalıştırır
- `npm run install:all` → root + backend + frontend bağımlılıklarını kurar

## Yerel Erişim Adresleri

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5050](http://localhost:5050)
- Swagger: [http://localhost:5050/api-docs](http://localhost:5050/api-docs)

## Seed (Örnek Veri) Kullanımı

```bash
cd realestate-backend
npm run seed
```

Bu komut veritabanını temizler, 1 admin kullanıcı ve örnek ilanlar oluşturur.

- Admin email: `admin@vera.com`
- Admin şifre: `123456`

## Deployment Özeti

- Backend (Render/Railway): `realestate-backend` dizinini servis root olarak kullan.
- Frontend (Vercel): `realestate-frontend` dizinini root directory seç.
- MongoDB: Atlas kullan ve `MONGO_URI` değerini production ortam değişkenlerinde tanımla.
- Frontend production env: `NEXT_PUBLIC_API_URL=https://<backend-domain>/api`

## Dokümantasyon

- Backend detayları: `realestate-backend/README.md`
- Frontend detayları: `realestate-frontend/README.md`

## Sık Karşılaşılan Sorunlar

- Frontend API çağrıları başarısız:
  - `realestate-frontend/.env.local` içindeki `NEXT_PUBLIC_API_URL` değerini kontrol et.
- CORS hatası:
  - Backend `CORS_ORIGINS` ortam değişkenine frontend originini ekle.
- Cloudinary yükleme çalışmıyor:
  - Backend `.env` içindeki `CLOUDINARY_*` değerlerini kontrol et.
- Swagger açılmıyor:
  - Backend’in gerçekten `5050` portunda çalıştığını doğrula.
