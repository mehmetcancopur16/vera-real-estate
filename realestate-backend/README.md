# Vera Real Estate — Backend API

> Express 5 tabanlı RESTful API. JWT kimlik doğrulama, Cloudinary görsel yönetimi, MongoDB veri katmanı ve kapsamlı güvenlik middleware'leri içerir.

- **Base URL (local):** `http://localhost:5050/api`
- **Swagger UI:** `http://localhost:5050/api-docs`
- **Varsayılan port:** `5050` (`.env` ile değiştirilebilir)

---

## Kurulum

```bash
cd realestate-backend
npm install

# Env dosyasını hazırla
cp .env.example .env
# → .env içindeki değerleri doldur (aşağıya bakın)

# Geliştirme sunucusu (nodemon ile)
npm run dev

# Prodüksiyon
npm start
```

---

## Ortam Değişkenleri

Zorunlu değişkenleri ayarlamadan sunucu başlamaz.

| Değişken | Zorunlu | Varsayılan | Açıklama |
|----------|---------|------------|----------|
| `MONGO_URI` | ✅ | — | MongoDB bağlantı URL'i (Atlas veya local) |
| `JWT_SECRET` | ✅ | — | JWT imzalama anahtarı (min 32 karakter önerilir) |
| `PORT` | — | `5050` | Sunucu portu |
| `NODE_ENV` | — | `development` | Ortam modu |
| `JWT_EXPIRES_IN` | — | `1d` | Token varsayılan geçerlilik süresi |
| `CORS_ORIGINS` | — | `http://localhost:3000` | İzin verilen origin'ler (virgülle ayrılmış) |
| `LOG_LEVEL` | — | `info` | Winston log seviyesi |
| `CLOUDINARY_CLOUD_NAME` | — | — | Cloudinary cloud adı |
| `CLOUDINARY_API_KEY` | — | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | — | — | Cloudinary API secret |

> Cloudinary değişkenleri tanımlı değilse görsel yükleme endpoint'leri `500` döner. Diğer tüm endpoint'ler çalışmaya devam eder.

---

## Proje Yapısı

```
realestate-backend/
├── server.js               # MongoDB bağlantısı + Express başlatma
├── .env.example            # Örnek env dosyası
└── src/
    ├── app.js              # Middleware stack, route mount, hata handler
    ├── config/
    │   ├── db.js           # Mongoose bağlantısı
    │   └── cloudinary.js   # Cloudinary SDK config
    ├── controllers/
    │   ├── auth.controller.js      # register, login, getMe, updateMe, ...
    │   └── property.controller.js  # CRUD + images + view count
    ├── middlewares/
    │   ├── auth.middleware.js   # protect (JWT), isOwner
    │   ├── upload.middleware.js # multer (memory storage)
    │   ├── validate.middleware.js # Zod schema validation
    │   └── error.middleware.js  # Global error handler
    ├── models/
    │   ├── User.model.js       # name, email, password (hashed), avatarUrl, role
    │   └── Property.model.js   # title, type, price, location, features, images, ...
    ├── routes/
    │   ├── auth.routes.js      # /api/auth/*
    │   └── property.routes.js  # /api/properties/*
    ├── scripts/
    │   └── seed.js             # Admin + örnek ilan oluştur
    ├── utils/
    │   ├── ApiError.js         # Custom hata sınıfı
    │   └── logger.js           # Winston logger
    └── validations/
        ├── auth.validation.js      # register, login, updateMe, ... şemaları
        └── property.validation.js  # createProperty, updateProperty şemaları
```

---

## API Endpoint Referansı

Tüm endpoint'ler `Content-Type: application/json` döner.  
Korumalı endpoint'ler için header: `Authorization: Bearer <token>`

### Kimlik Doğrulama — `/api/auth`

| Method | Path | Auth | Body | Açıklama |
|--------|------|------|------|----------|
| `POST` | `/register` | — | `name, email, password` | Yeni kullanıcı kaydı. `{ user, token }` döner. |
| `POST` | `/login` | — | `email, password, rememberMe?` | Giriş. `rememberMe=true` → 30 günlük token. |
| `GET` | `/me` | JWT | — | Giriş yapan kullanıcının profili |
| `PATCH` | `/me` | JWT | `name?, email?` | Ad veya email güncelle |
| `PATCH` | `/password` | JWT | `currentPassword, newPassword` | Şifre değiştir |
| `POST` | `/avatar` | JWT | `multipart/form-data` → `avatar` | Avatar yükle (Cloudinary) |
| `DELETE` | `/me` | JWT | `currentPassword` | Hesap + tüm ilanlar kalıcı silinir |

### İlanlar — `/api/properties`

| Method | Path | Auth | Açıklama |
|--------|------|------|----------|
| `GET` | `/` | — | Filtreli ilan listesi. Query: `city, type, listingType, minPrice, maxPrice, minRooms, page, limit, sort` |
| `GET` | `/featured` | — | Öne çıkan 6 ilan (`isFeatured: true`) |
| `GET` | `/my` | JWT | Giriş yapan kullanıcının ilanları. Query: `page, limit, includeInactive` |
| `GET` | `/:id` | — | Tek ilan detayı (her istekte `viewCount++`) |
| `POST` | `/` | JWT | Yeni ilan oluştur |
| `PUT` | `/:id` | JWT + Owner | İlan güncelle |
| `DELETE` | `/:id` | JWT + Owner | İlan sil |
| `POST` | `/:id/images` | JWT + Owner | Görsel yükle (`images` field, max 5/istek, Cloudinary) |
| `DELETE` | `/:id/images/:imgId` | JWT + Owner | Tek görsel sil (Cloudinary'den de silinir) |

#### Filtreleme Parametreleri (`GET /api/properties`)

```
city=Istanbul
type=apartment|house|land|commercial
listingType=sale|rent
minPrice=500000
maxPrice=5000000
minRooms=2
page=1
limit=12
sort=newest|price_asc|price_desc|views
```

#### Örnek İlan Payload (`POST /api/properties`)

```json
{
  "title": "Merkezi Konumda 3+1 Daire",
  "description": "Şehir merkezine yürüme mesafesinde...",
  "type": "apartment",
  "listingType": "sale",
  "price": 2500000,
  "size": 120,
  "location": {
    "city": "İstanbul",
    "district": "Kadıköy",
    "address": "Moda Caddesi No:12"
  },
  "features": {
    "rooms": 3,
    "bathrooms": 1,
    "floor": 3,
    "heating": "kombi"
  },
  "amenities": ["Balkon", "Asansör", "Otopark"],
  "yearBuilt": 2018,
  "status": "ready",
  "parking": true,
  "furnished": false
}
```

---

## Güvenlik Katmanları

| Middleware | Paket | Açıklama |
|------------|-------|----------|
| HTTP Güvenlik Header | `helmet` | XSS, clickjacking, MIME sniff koruması |
| CORS | `cors` | Whitelist tabanlı origin kontrolü |
| Rate Limiting | `express-rate-limit` | 100 istek / 15 dakika / IP |
| NoSQL Enjeksiyon | `express-mongo-sanitize` | `$` ve `.` içeren field'ları temizler |
| HTTP Param Pollution | `hpp` | Duplicate query param saldırıları |
| JWT Doğrulama | `jsonwebtoken` | Bearer token, `protect` middleware |
| Owner Kontrolü | custom | `isOwner(Model)` — yalnızca ilanın sahibi düzenleyebilir |
| Hata Maskeleme | custom | Production'da stack trace gizlenir |

---

## Veri Modelleri

### User

```
_id, name, email, password (hashed), avatarUrl, role (user|admin)
createdAt, updatedAt
```

### Property

```
_id, owner (ref: User), title, description
type (apartment|house|land|commercial)
listingType (sale|rent)
price, currency, size, yearBuilt, status (ready|under-construction)
deedStatus, maintenanceFee, totalFloors
parking, furnished, virtualTourUrl, isFeatured
features: { rooms, bathrooms, floor, heating }
location: { city, district, address }
amenities: [String]
images: [String] (Cloudinary URL'leri)
viewCount, isActive
createdAt, updatedAt
```

---

## Swagger API Dokümantasyonu

Tüm endpoint'ler OpenAPI 3.0 formatında dokümante edilmiştir.

```
http://localhost:5050/api-docs
```

Development ortamında Swagger UI otomatik açılır. Production'da `NODE_ENV=production` olduğunda devre dışı bırakılabilir.

---

## Seed Script

Veritabanını temizler, admin kullanıcı ve örnek ilanlar oluşturur.

```bash
cd realestate-backend
npm run seed
```

**Oluşturulan veriler:**
- Admin: `admin@vera.com` / `123456`
- 6 örnek ilan (İstanbul + Konya, farklı tip ve fiyatlar)

> **Uyarı:** Seed script mevcut tüm `User` ve `Property` kayıtlarını siler.

---

## Hata Yanıt Formatı

Tüm hata yanıtları aynı yapıyı izler:

```json
{
  "success": false,
  "message": "Hata açıklaması",
  "statusCode": 400
}
```

Validation hataları:

```json
{
  "success": false,
  "message": "Validasyon hatası",
  "errors": [
    { "field": "email", "message": "Geçerli bir e-posta adresi girin" }
  ]
}
```

---

## Loglama

Winston + Morgan kombinasyonu kullanılır.

- HTTP istekleri: Morgan → `combined` formatı
- Uygulama logları: Winston → `logs/combined.log` + `logs/error.log`
- Console renklendirme: Development modunda aktif

Log seviyesi `LOG_LEVEL` env değişkeni ile kontrol edilir (`error`, `warn`, `info`, `debug`).
