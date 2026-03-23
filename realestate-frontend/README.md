# Vera Real Estate Frontend

Next.js 15 App Router tabanlı kullanıcı arayüzü.  
Landing sayfaları, ilan kartları, harita görünümü, dashboard paneli, form validasyonu, auth state yönetimi ve SEO metadata akışını içerir.

## Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form + Zod
- Leaflet / React Leaflet
- Axios (interceptor ile token yönetimi)

## Klasör Yapısı (Özet)

```text
realestate-frontend/
├── app/
│   ├── (public)/              # Landing ve public sayfalar
│   ├── (dashboard)/           # Korumalı kullanıcı paneli
│   ├── providers.jsx          # QueryClientProvider
│   └── layout.tsx             # Root layout + toaster
├── components/
│   ├── forms/                 # Property formu
│   ├── layout/                # Navbar/Footer
│   ├── map/                   # Map + dynamic wrapper
│   ├── property/              # Card/Grid
│   └── ui/                    # shadcn bileşenleri
├── lib/
│   └── axios.js               # API client + request interceptor
├── services/                  # Auth/Property API servisleri
└── store/                     # Zustand store'lar
```

## Kurulum

```bash
cd realestate-frontend
npm install
```

`realestate-frontend/.env.local` oluştur:

```env
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

## Scriptler

- `npm run dev` → development server (`http://localhost:3000`)
- `npm run build` → production build
- `npm run start` → production serve
- `npm run lint` → lint kontrolü

## API Entegrasyonu

- Axios instance: `lib/axios.js`
- Tüm istekler `NEXT_PUBLIC_API_URL` üzerinden yapılır.
- Request interceptor localStorage’daki `token` değerini otomatik olarak `Authorization: Bearer <token>` header’ına ekler.

## State ve Data Akışı

- Auth state: `store/useAuthStore.js`
  - `user`, `isAuthenticated`, `isLoading`
  - `login`, `logout`, `checkAuth`
- Property state/filter: `store/usePropertyStore.js`
- Server state: TanStack Query (`app/providers.jsx`)

## Önemli Özellikler

- Korumalı dashboard layout (`(dashboard)` route grubu)
- İlan oluşturma formu:
  - 1. adım: ilan verisi oluşturma
  - 2. adım: varsa görselleri ilgili ilana upload etme
- İlanlarım tablosu + silme aksiyonu + empty/loading states
- Public ana sayfada canlı veri çekimi + error/loading fallback
- İlan detay sayfasında dinamik metadata (`generateMetadata`)
- Harita için SSR-safe dynamic import (`MapView`)

## Backend Bağımlılığı

Frontend bu backend endpointlerine bağlıdır:

- Auth: `/api/auth/*`
- Properties: `/api/properties/*`

Backend’in aktif ve erişilebilir olması gerekir:
- API: `http://localhost:5050`
- Docs: `http://localhost:5050/api-docs`

## Deployment (Vercel)

- Root directory: `realestate-frontend`
- Environment variables:
  - `NEXT_PUBLIC_API_URL=https://<your-backend-domain>/api`
- Build command: `npm run build`
- Start command: `npm run start`

## Troubleshooting

- API çağrıları başarısız:
  - `.env.local` içindeki `NEXT_PUBLIC_API_URL` değerini doğrula.
- 401 auth hataları:
  - LocalStorage token var mı kontrol et.
  - Backend JWT secret/environment doğru mu kontrol et.
- CORS hatası:
  - Backend `CORS_ORIGINS` env içine frontend originini ekle.
- Harita SSR hatası:
  - Sadece `MapView` bileşenini kullan; direkt `Map` import etme.
