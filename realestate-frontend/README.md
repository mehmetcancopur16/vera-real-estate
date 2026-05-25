# Vera Real Estate — Frontend

Next.js 15 App Router üzerinde çalışan kullanıcı arayüzü. React 19, Tailwind CSS 4 ve Shadcn UI ile yazılmıştır.

## Teknoloji

| Katman           | Teknoloji                                      |
|------------------|------------------------------------------------|
| Framework        | Next.js 15 (App Router) + React 19             |
| Stil             | Tailwind CSS 4, Shadcn UI                      |
| Durum yönetimi   | Zustand                                        |
| Veri çekme       | TanStack React Query 5                         |
| HTTP             | Axios (`lib/axios.js`)                         |
| Formlar          | React Hook Form + Zod                          |
| Harita           | Leaflet + react-leaflet                        |
| İkonlar          | lucide-react                                   |
| Bildirimler      | sonner                                         |

## Kurulum

```bash
npm install
cp .env.example .env.local
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # build'i serve eder
npm run lint     # ESLint
```

Backend ile birlikte çalıştırmak için kök dizinde `npm run dev`.

## Ortam Değişkenleri

`.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

## Klasör Yapısı

```
app/
├── layout.tsx, providers.jsx, globals.css
├── (auth)/        login, register
├── (public)/      home, properties, blog, about, contact, terms, privacy, docs
├── (dashboard)/   my-listings, add-listing, edit-listing, profile, upgrade
└── (admin)/       admin, admin/users, admin/listings, admin/contacts, admin/newsletters

components/
├── layout/        Navbar, Footer
├── property/      PropertyCard, PropertyCardList, ShareButton
├── forms/         PropertyForm (çok adımlı oluştur/düzenle formu)
├── map/           Map, MapView (dinamik Leaflet importu)
└── ui/            Shadcn tabanlı temel bileşenler

services/         REST katmanı (auth, property, admin, contact, subscription)
store/            Zustand: useAuthStore, usePropertyStore
lib/              axios, blog-data, utils
```

## Auth Akışı

`(dashboard)/layout.jsx` ve `(admin)/layout.jsx` `useAuthStore.checkAuth()`'u mount anında çağırır:

- Token yoksa veya doğrulanamazsa `/login`'e yönlendirir.
- Admin rotaları kullanıcı `admin` değilse `/my-listings`'e yönlendirir.

Token istemci tarafında `localStorage`'da tutulur ve Axios interceptor'ı tarafından her isteğe `Authorization: Bearer <token>` olarak eklenir.

## `next.config.ts` — İzinli Görsel Kaynakları

`next/image` için aşağıdaki uzak host'lar izinlidir:

- `images.unsplash.com`
- `localhost:5050/uploads/**` (yerel backend dosyaları)
- `127.0.0.1:5050/uploads/**`

Üretimde, backend'in görsel servisi yapan domain'i `images.remotePatterns` listesine eklenmelidir.

## Dağıtım (Vercel)

```bash
vercel --prod
```

`NEXT_PUBLIC_API_URL` üretim backend URL'ine ayarlanmalı; ek görsel host'ları `next.config.ts` içine eklenmelidir.
