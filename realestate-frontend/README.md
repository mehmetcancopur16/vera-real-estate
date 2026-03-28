# Vera Real Estate — Frontend

> Next.js 15 App Router tabanlı modern emlak portalı arayüzü.  
> Kullanıcı dostu dashboard, 4 adımlı ilan sihirbazı, Leaflet harita entegrasyonu ve tam responsive tasarım.

- **Framework:** Next.js 15 (App Router)
- **Port:** `3000`
- **API:** `NEXT_PUBLIC_API_URL` env değişkeni ile yapılandırılır

---

## Kurulum

```bash
cd realestate-frontend
npm install

# Env dosyasını hazırla
cp .env.local.example .env.local
# → NEXT_PUBLIC_API_URL=http://localhost:5050/api

npm run dev
```

---

## Ortam Değişkenleri

| Değişken | Zorunlu | Örnek | Açıklama |
|----------|---------|-------|----------|
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:5050/api` | Backend API base URL |

---

## Sayfa Yapısı

```
app/
├── layout.tsx               # Root layout: font, providers, Toaster
├── globals.css              # Tailwind v4, CSS vars (light/dark), animasyonlar
├── providers.jsx            # QueryClientProvider + ThemeProvider
│
├── (public)/                # Herkese açık sayfalar
│   ├── page.tsx             # Ana sayfa — hero, öne çıkan ilanlar, arama
│   ├── properties/
│   │   ├── page.jsx         # İlan listesi — filtreler, sayfalama
│   │   └── [id]/page.jsx    # İlan detayı — galeri, harita, özellikler
│   └── layout.jsx           # Navbar + Footer
│
├── (auth)/                  # Kimlik doğrulama sayfaları
│   ├── login/page.jsx       # Giriş formu
│   └── register/page.jsx    # Kayıt formu
│
└── (dashboard)/             # Korumalı kullanıcı paneli
    ├── layout.jsx           # App-shell: fixed header + sidebar + content
    ├── my-listings/page.jsx # İlan portföyü — metrikler, grid/liste, düzenleme
    ├── add-listing/page.jsx # 4 adımlı ilan oluşturma sihirbazı
    ├── edit-listing/
    │   └── [id]/page.jsx    # Mevcut ilan düzenleme
    └── profile/page.jsx     # Profil — kişisel bilgiler, güvenlik, tercihler
```

---

## Bileşen Dizini

```
components/
├── ui/                      # shadcn/ui bileşenleri (base-nova preset)
│   ├── button.tsx           # @base-ui/react + cva varyantları
│   ├── input.tsx
│   ├── card.tsx
│   ├── tabs.tsx
│   ├── select.tsx
│   ├── alert-dialog.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── skeleton.tsx
│   ├── sheet.tsx
│   ├── switch.tsx
│   ├── separator.tsx
│   ├── progress.tsx
│   ├── dropdown-menu.tsx
│   └── ...
│
├── forms/
│   └── PropertyForm.jsx     # 4 adımlı ilan formu (RHF + Zod)
│                            # Prop: propertyId, defaultValues (edit modu)
│
├── layout/
│   ├── Navbar.jsx           # Public sayfa navigasyonu
│   └── Footer.jsx
│
├── property/
│   ├── PropertyCard.jsx     # İlan kartı (liste görünümü)
│   ├── PropertyGrid.jsx     # İlan grid'i
│   └── PropertyFilters.jsx  # Filtre paneli
│
└── map/
    └── MapView.jsx          # Leaflet harita (dynamic import, SSR disabled)
```

---

## Routing & Korumalı Sayfalar

Dashboard rotaları (`/my-listings`, `/add-listing`, `/edit-listing/*`, `/profile`) `app/(dashboard)/layout.jsx` ile korunur.

### Koruma Mekanizması

```
Kullanıcı dashboard sayfasına girer
        ↓
layout.jsx → checkAuth() çağrısı
        ↓
localStorage'da token var mı?
    ├── Hayır → /login'e yönlendir
    └── Evet → GET /api/auth/me
            ├── Başarısız (401) → token sil → /login
            └── Başarılı → user state'i doldur → sayfa render
```

> Next.js `middleware.ts` kullanılmamıştır. Yetki kontrolü client-side `useEffect` ile yapılır. Sayfa render edilmeden önce kısa bir yükleme ekranı gösterilir.

---

## State Yönetimi

### Zustand — `store/useAuthStore.js`

```js
{
  user: null,           // User objesi (name, email, avatarUrl, role, ...)
  isAuthenticated: false,
  isLoading: false,

  login(credentials),   // POST /auth/login → token localStorage'a kaydedilir
  register(data),       // POST /auth/register
  logout(),             // token silinir, state temizlenir
  checkAuth(),          // token varsa GET /auth/me ile doğrular
  refreshMe(),          // Profil güncellemelerinden sonra user'ı yeniler
}
```

### TanStack React Query v5

Tüm API veri çağrıları React Query ile yönetilir. `providers.jsx` içinde `QueryClientProvider` sarıcısı vardır.

Örnek query key'ler:

| Key | Açıklama |
|-----|----------|
| `["my-properties", { includeInactive: 1 }]` | Kullanıcının tüm ilanları |
| `["property", id]` | Tek ilan detayı |
| `["properties", filters]` | Filtrelenmiş ilan listesi |

---

## Servis Katmanı

### `services/auth.service.js`

```js
login({ email, password, rememberMe })  // POST /auth/login
register({ name, email, password })      // POST /auth/register
getMe()                                  // GET  /auth/me
updateMe({ name, email })               // PATCH /auth/me
changePassword({ currentPassword, newPassword })  // PATCH /auth/password
uploadAvatar(file)                       // POST /auth/avatar (multipart)
deleteAccount({ currentPassword })       // DELETE /auth/me
```

### `services/property.service.js`

```js
getProperties(filters)                   // GET  /properties
getPropertyById(id)                      // GET  /properties/:id
getMyProperties(params)                  // GET  /properties/my
createProperty(payload)                  // POST /properties
updateProperty(id, payload)              // PUT  /properties/:id
deleteMyProperty(id)                     // DELETE /properties/:id
uploadPropertyImages(id, files)          // POST /properties/:id/images
deletePropertyImage(propertyId, imgId)   // DELETE /properties/:id/images/:imgId
```

### `lib/axios.js`

Tüm servisler ortak bir Axios instance kullanır:
- `baseURL`: `process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api"`
- Request interceptor: `localStorage.token` varsa `Authorization: Bearer <token>` ekler
- Response interceptor: `401` alınırsa token silinir

---

## Form Mimarisi — PropertyForm

`components/forms/PropertyForm.jsx` — 4 adımlı ilan oluşturma/düzenleme formu.

```
Adım 1 — Temel Bilgiler
  title, description, type (apartment|house|land|commercial), listingType (sale|rent)

Adım 2 — Konum & Fiyat
  city (combobox, 81 il), district, address, price, size

Adım 3 — Özellikler
  rooms, bathrooms, floor, totalFloors, heating, yearBuilt, status,
  deedStatus, maintenanceFee, parking, furnished, virtualTourUrl,
  amenities (multi-select, 30 seçenek)

Adım 4 — Görsel Yükleme
  Drag & drop, max 12 görsel, önizleme, kapak görseli
```

**Props:**

| Prop | Tip | Açıklama |
|------|-----|----------|
| `propertyId` | `string \| null` | Dolu ise edit modu — `PUT /properties/:id` çağırır |
| `defaultValues` | `object \| null` | Edit modunda form alanlarını önceden doldurur |

**Validasyon:** Zod schema — her adımda ilgili field'lar `form.trigger()` ile doğrulanır; hata varsa sonraki adıma geçilmez.

---

## Stil Sistemi

Tailwind CSS v4 (`@import "tailwindcss"`) + shadcn/ui `base-nova` preset.

### CSS Değişkenleri (`:root`)

```css
--accent: #d4af37        /* Vera altın */
--gold:   #d4af37
--gold-hover: #b4942f
--surface: #f1f5f9
--surface-elevated: #ffffff
```

### Özel Utility Sınıfları (`globals.css`)

| Sınıf | Açıklama |
|-------|----------|
| `.bg-gold-gradient` | 120° altın gradient |
| `.text-gradient-gold` | Gradient metin efekti |
| `.panel-surface` | Surface panel (hafif altın tonu + shadow) |
| `.premium-ring` | Altın glow ring shadow |
| `.animate-shimmer` | Skeleton sweep animasyonu |
| `.animate-glow-pulse` | Glowing pulse (avatar gibi) |
| `.animate-float` | Yukarı-aşağı yüzme efekti |
| `.metric-card` | Hover lift + shadow geçişi |
| `.section-label` | Küçük büyük harf etiket |

---

## Dashboard Layout Yapısı

`app/(dashboard)/layout.jsx` üç katmandan oluşur:

```
┌─────────────────────────────────────────────────────┐
│  FIXED HEADER (z-50, h-16)                          │
│  Logo · Breadcrumb · Yeni İlan · Bell · User Menu   │
├────────────────┬────────────────────────────────────┤
│ FIXED SIDEBAR  │ SCROLLABLE CONTENT                 │
│ (z-40, w-272)  │ (pt-16, ml-272 desktop)            │
│                │                                    │
│ Brand          │ ┌─ Sticky Sub-Header ───────────┐  │
│ Nav Items      │ │ Sayfa başlığı + durum pill'ler│  │
│ + Yeni İlan    │ └───────────────────────────────┘  │
│ + Çıkış Yap    │                                    │
│                │ {children} — sayfa içeriği         │
└────────────────┴────────────────────────────────────┘
```

**Bildirim Sistemi:**
Bell butonu gerçek ilan verisiyle çalışan bir dropdown açar:
- Son 7 günde eklenen ilanlar
- En çok görüntülenen ilan
- Pasif ilan uyarısı
- Okundu/okunmadı takibi (`localStorage`)

---

## Scripts

| Script | Açıklama |
|--------|----------|
| `npm run dev` | Geliştirme sunucusu (hot-reload) |
| `npm run build` | Production build |
| `npm run start` | Production sunucu |
| `npm run lint` | ESLint kontrolü |

---

## Deployment (Vercel)

```bash
# Vercel CLI
npx vercel

# Gerekli env var (Vercel Dashboard → Settings → Environment Variables):
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

**Build ayarları:**
- Framework: Next.js (otomatik algılanır)
- Root Directory: `realestate-frontend`
- Build Command: `npm run build`
- Output Directory: `.next`

**Bilinen sorunlar:**

| Sorun | Çözüm |
|-------|-------|
| `401 Unauthorized` | `NEXT_PUBLIC_API_URL` doğru mu? |
| CORS hatası | Backend `CORS_ORIGINS` env'ine Vercel URL'ini ekle |
| Harita SSR hatası | `MapView` zaten `dynamic import + ssr: false` ile yükleniyor |
| Avatar görünmüyor | `http://localhost:5050/uploads/` URL'inin backend'de static serve edildiğinden emin ol |

---

## Admin Panel

Admin kullanıcılar `/admin` route grubuna erişir (MongoDB `role: "admin"`).

| Rota | Açıklama |
|------|----------|
| `/admin` | Dashboard — istatistikler, plan dağılımı, son kayıtlar |
| `/admin/users` | Tüm kullanıcılar — plan/rol select, silme |
| `/admin/listings` | Tüm ilanlar — aktif toggle, silme, detay linki |

---

## Abonelik & Ödeme Akışı

| Rota | Açıklama |
|------|----------|
| `/upgrade` | 3-tier fiyatlandırma kartları |
| `/upgrade/checkout?plan=professional` | Mock ödeme formu (kart flip animasyonu) |
| `/upgrade/success?plan=professional` | Başarı ekranı (konfeti animasyonu) |

Profil sayfasının **Abonelik** sekmesinde mevcut plan, kullanım çubuğu ve yükseltme butonu bulunur.

> Demo amaçlıdır — gerçek ödeme alınmaz.
