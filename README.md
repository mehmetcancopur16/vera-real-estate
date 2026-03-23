# 🏠 Vera Real Estate — Modern Yaşamın Yeni Koordinatı

Modern, güvenli ve ölçeklenebilir bir full-stack emlak portalı.  
Kullanıcılar ilan oluşturabilir, görsel yükleyebilir, filtreleyebilir, haritada keşfedebilir ve kendi dashboard alanından ilanlarını yönetebilir.

## 🚀 Teknoloji Yığını

### Frontend
- ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
- ![React](https://img.shields.io/badge/React-19-20232A?logo=react)
- ![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)
- ![shadcn/ui](https://img.shields.io/badge/UI-shadcn-111111)
- ![Zustand](https://img.shields.io/badge/State-Zustand-7A4E1D)
- ![React Query](https://img.shields.io/badge/Data-TanStack%20Query-FF4154)
- ![Leaflet](https://img.shields.io/badge/Map-Leaflet-199900?logo=leaflet)

### Backend
- ![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)
- ![Express](https://img.shields.io/badge/Express-5-000000?logo=express)
- ![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
- ![Mongoose](https://img.shields.io/badge/ODM-Mongoose-880000)
- ![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens)
- ![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?logo=cloudinary)
- ![Swagger](https://img.shields.io/badge/API-Swagger-85EA2D?logo=swagger)
- ![Zod](https://img.shields.io/badge/Validation-Zod-3E67B1)

## ✨ Öne Çıkan Özellikler

- JWT tabanlı kimlik doğrulama ve korumalı endpointler
- Kullanıcı yetkilendirme (owner/admin) ve güvenli route akışı
- Gelişmiş dinamik ilan filtreleme (şehir, fiyat, oda, metin arama)
- Cloudinary ile çoklu görsel yükleme ve görsel silme
- Leaflet ile harita gösterimi (SSR-safe dynamic import)
- Dashboard: ilan ekleme, ilan listeleme, soft delete yönetimi
- Zod doğrulama katmanı (frontend + backend)
- Swagger üzerinden API dokümantasyonu
- Next.js dinamik metadata ile SEO uyumlu ilan detay sayfaları

## 🛠️ Kurulum

### 1) Reponun klonlanması

```bash
git clone https://github.com/mehmetcancopur16/vera-real-estate.git
cd vera-real-estate
```

### 2) Backend kurulumu

```bash
cd realestate-backend
npm install
cp .env.example .env
```

`realestate-backend/.env` örneği:

```env
PORT=5050
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/vera_real_estate
JWT_SECRET=super_secret_jwt_key_degistirilecek
JWT_EXPIRES_IN=1d
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 3) Frontend kurulumu

```bash
cd ../realestate-frontend
npm install
```

`realestate-frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

## 📦 Örnek Veri Yükleme (Seeding)

Backend için tek komutla hazır veri:

```bash
cd realestate-backend
npm run seed
```

Bu komut:
- Veritabanındaki `User` ve `Property` kayıtlarını temizler
- 1 admin kullanıcı oluşturur
- Konya/İstanbul lokasyonlu örnek ilanları ekler

Seed admin giriş bilgileri:
- **Email:** `admin@vera.com`
- **Şifre:** `123456`

## 🏃‍♂️ Çalıştırma

İki terminal açın:

```bash
# Terminal 1
cd realestate-backend
npm run dev
```

```bash
# Terminal 2
cd realestate-frontend
npm run dev
```

Erişim adresleri:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5050](http://localhost:5050)
- Swagger: [http://localhost:5050/api-docs](http://localhost:5050/api-docs)

## 📌 Notlar

- Deployment için backend ortam değişkenlerini Render/Railway tarafında tanımlayın.
- Frontend deployment (Vercel) için `NEXT_PUBLIC_API_URL` değerini canlı backend URL'i ile güncelleyin.
