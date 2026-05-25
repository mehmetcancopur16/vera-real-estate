# Vera Real Estate — Backend

Express 5 REST API. Kimlik doğrulama, ilan yönetimi, abonelik, admin işlemleri, iletişim formu ve bülten aboneliklerini barındırır.

## Teknoloji

| Katman           | Teknoloji                                  |
|------------------|---------------------------------------------|
| Framework        | Express 5 (ES modules)                      |
| Veritabanı       | MongoDB + Mongoose                          |
| Kimlik Doğrulama | JWT (`jsonwebtoken`) + bcryptjs (rounds 12) |
| Doğrulama        | Zod                                         |
| Dosya Yükleme    | Multer (yerel disk → `uploads/`)            |
| Güvenlik         | Helmet, express-rate-limit, HPP, CORS       |
| API Dokümantasyonu | swagger-jsdoc + swagger-ui-express        |

## Kurulum

```bash
npm install
cp .env.example .env
# .env içindeki JWT_SECRET'ı güçlü bir random değerle değiştirin:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npm run dev     # nodemon ile hot reload
npm start       # production
npm run seed    # örnek veri seti
```

## Klasör Yapısı

```
src/
├── app.js                  Express uygulaması (middleware, route, Swagger)
├── config/
│   ├── db.js               Mongoose bağlantısı
│   └── swagger.config.js   OpenAPI tanımları
├── controllers/            İş mantığı
├── routes/                 Express route tanımları
├── models/                 Mongoose şemaları (User, Property, Contact, Newsletter)
├── middlewares/            auth, upload, validate, error, mongo-sanitize
├── validations/            Zod şemaları
├── utils/                  ApiError, logger
└── scripts/seed.js         Geliştirme amaçlı örnek veri yükleyici
```

## Modeller (özet)

- **User** — `name`, `email` (unique), `password` (bcrypt, `select: false`), `avatarUrl`, `role` (`user|admin`), `subscription { plan, expiresAt }`.
- **Property** — `owner` (User ref), `title`, `description`, `type`, `listingType`, `price`, `size`, `features { rooms, bathrooms, floor, heating }`, `location { city, district, address }`, `images[]`, `isFeatured`, `isActive`, `viewCount` ve diğer detay alanları.
- **Contact** — `name`, `email`, `phone?`, `message`, `isRead`.
- **Newsletter** — `email` (unique), `isActive`.

## API Endpoint Özeti

Tüm rotalar `/api` öneki altındadır. Tam şemalar ve örnekler için Swagger UI.

### Auth — `/api/auth`
`/register` ve `/login` istekleri IP başına 15 dakikada 10 istekle sınırlandırılmıştır.

| Yöntem | Yol           | Yetki  | Açıklama                              |
|--------|---------------|--------|---------------------------------------|
| POST   | `/register`   | —      | Yeni kullanıcı kaydı                  |
| POST   | `/login`      | —      | Giriş, JWT döner                      |
| GET    | `/me`         | JWT    | Mevcut kullanıcıyı getir              |
| PATCH  | `/me`         | JWT    | Profil bilgilerini güncelle           |
| PATCH  | `/password`   | JWT    | Şifre değiştir                        |
| POST   | `/avatar`     | JWT    | Avatar yükle (multipart)              |
| DELETE | `/me`         | JWT    | Hesabı sil (şifre onaylı)             |

### Properties — `/api/properties`

| Yöntem | Yol                       | Yetki        | Açıklama                                          |
|--------|---------------------------|--------------|---------------------------------------------------|
| GET    | `/`                       | —            | Liste, filtreleme, arama, sayfalama, sıralama     |
| GET    | `/featured`               | —            | Öne çıkan ilanlar (`isFeatured: true`)            |
| GET    | `/my`                     | JWT          | Kullanıcının kendi ilanları                       |
| GET    | `/:id`                    | —            | İlan detayı (`viewCount` artırılır)              |
| POST   | `/`                       | JWT          | İlan oluştur (plan limiti uygulanır)              |
| PUT    | `/:id`                    | JWT + sahip  | İlanı güncelle                                    |
| DELETE | `/:id`                    | JWT + sahip  | İlanı ve diskteki görselleri sil                  |
| POST   | `/:id/images`             | JWT + sahip  | Görsel yükle (maks. 5 × 5 MB)                     |
| DELETE | `/:id/images/:imgId`      | JWT + sahip  | Tek görsel sil                                    |

### Subscription — `/api/subscription`

| Yöntem | Yol         | Yetki | Açıklama                                                |
|--------|-------------|-------|---------------------------------------------------------|
| GET    | `/plans`    | —     | Plan tanımlarını döner                                  |
| POST   | `/upgrade`  | JWT   | Planı değiştir: `{ plan: "free" \| "professional" \| "corporate" }` |

### Contact — `/api/contact`

| Yöntem | Yol  | Yetki | Açıklama                |
|--------|------|-------|-------------------------|
| POST   | `/`  | —     | İletişim formu gönderir |

### Newsletter — `/api/newsletter`

| Yöntem | Yol          | Yetki | Açıklama          |
|--------|--------------|-------|-------------------|
| POST   | `/subscribe` | —     | Bültene abone ol  |

### Admin — `/api/admin` (JWT + `role: admin`)

| Yöntem | Yol                          | Açıklama                                    |
|--------|------------------------------|---------------------------------------------|
| GET    | `/stats`                     | Toplam metrikler ve son aktiviteler         |
| GET    | `/users`                     | Kullanıcı listesi (arama, plan, rol filtre) |
| PATCH  | `/users/:id`                 | Rol veya plan güncelle                      |
| DELETE | `/users/:id`                 | Kullanıcıyı ve ilanlarını sil               |
| GET    | `/listings`                  | İlan listesi                                |
| PATCH  | `/listings/:id/toggle`       | Aktif/pasif çevir                           |
| DELETE | `/listings/:id`              | İlanı sil                                   |
| GET    | `/contacts`                  | İletişim mesajları                          |
| PATCH  | `/contacts/:id/read`         | Mesajı okundu işaretle                      |
| DELETE | `/contacts/:id`              | Mesajı sil                                  |
| GET    | `/newsletters`               | Aboneleri listele                           |
| DELETE | `/newsletters/:id`           | Aboneyi sil                                 |

### System

| Yöntem | Yol            | Açıklama        |
|--------|----------------|-----------------|
| GET    | `/api/health`  | Sağlık kontrolü |

## Güvenlik

- **Helmet** ile sıkı HTTP başlıkları; `/docs` rotalarında CSP gevşetilir.
- **Global rate limit:** IP başına 15 dakikada 100 istek (tüm `/api`).
- **Auth rate limit:** IP başına 15 dakikada 10 istek (`/login`, `/register`, `/avatar`).
- **HPP** ile HTTP Parameter Pollution engellenir.
- **CORS allowlist** — yalnızca `CORS_ORIGINS` ve yerel geliştirme adresleri kabul edilir.
- **mongo-sanitize** middleware NoSQL injection denemelerini temizler.
- **bcryptjs** (12 round) parola hashleme.
- **JWT** `JWT_SECRET` ile imzalanır; `JWT_EXPIRES_IN` ile süre yönetilir.
- **isOwner middleware** kaynak sahipliğini doğrular.
- **Zod** her yazma endpoint'inde gövde doğrulaması yapar.
- **Multer fileFilter** MIME ve uzantı çift doğrulamasıyla yalnızca JPEG/PNG/WebP kabul eder; dosya başına 5 MB limit vardır.
- `password` alanı `select: false` ile asla API yanıtına girmez.

## Seeder

```bash
npm run seed
```

Geliştirme amaçlı 6 kullanıcı, 23 ilan, 8 iletişim mesajı ve 12 bülten abonesi oluşturur. Test hesapları:

| Rol           | E-posta          | Parola |
|---------------|------------------|--------|
| Admin         | admin@vera.com   | 123456 |
| Professional  | pro@vera.com     | 123456 |
| Corporate     | corp@vera.com    | 123456 |
| User          | user1@vera.com   | 123456 |
| User          | user2@vera.com   | 123456 |
| User          | user3@vera.com   | 123456 |

Bu hesaplar yalnızca geliştirme/test ortamı içindir; üretimde kullanılmamalıdır.

## Swagger / API Dokümantasyonu

| URL                                | Açıklama         |
|------------------------------------|------------------|
| `http://localhost:5050/docs`       | Swagger UI       |
| `http://localhost:5050/docs.json`  | OpenAPI JSON     |
