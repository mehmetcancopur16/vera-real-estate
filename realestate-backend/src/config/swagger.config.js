/**
 * OpenAPI 3.0.3 — Vera Real Estate API
 * Comprehensive schema definitions + JWT Bearer auth
 */
export const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Vera Real Estate API',
      version: '2.0.0',
      description: `
## Vera Real Estate — REST API Dökümantasyonu

Full-stack emlak portalının backend API'si. Kullanıcı yönetimi, ilan CRUD,
abonelik sistemi, iletişim formu ve newsletter aboneliği içerir.

### Kimlik Doğrulama
Korumalı endpoint'ler için **Bearer JWT** kullanın.

1. \`POST /api/auth/login\` ile token alın
2. Her istekte \`Authorization: Bearer <token>\` header'ı gönderin
3. Swagger UI'da sağ üstteki **Authorize** butonuna token'ınızı girin

### Kullanıcı Rolleri
| Rol | Açıklama |
|-----|----------|
| \`user\` | Standart kullanıcı — kendi ilanlarını yönetir |
| \`admin\` | Tüm sisteme erişim — kullanıcı, ilan, mesaj, bülten yönetimi |

### Abonelik Planları
| Plan | İlan Limiti |
|------|-------------|
| \`free\` | 3 ilan |
| \`professional\` | 7 ilan |
| \`corporate\` | Sınırsız |

### Hata Yanıtları
Tüm hata yanıtları aynı formattadır: \`{ success: false, message: "..." }\`
      `.trim(),
      contact: {
        name: 'Vera Real Estate',
        url: 'https://github.com/mehmetcancopur16/vera-real-estate'
      },
      license: { name: 'MIT' }
    },
    servers: [
      {
        url: 'http://localhost:5050',
        description: 'Geliştirme sunucusu'
      }
    ],
    tags: [
      { name: 'System', description: 'Sağlık durumu ve genel bilgi' },
      { name: 'Auth', description: 'Kayıt, giriş, profil, şifre, avatar' },
      { name: 'Properties', description: 'İlan listeleme, oluşturma, güncelleme, silme, görsel yönetimi' },
      { name: 'Contact', description: 'İletişim formu mesajları' },
      { name: 'Newsletter', description: 'Email bülten aboneliği' },
      { name: 'Subscription', description: 'Kullanıcı abonelik planları' },
      { name: 'Admin — Stats', description: 'Yönetim paneli istatistikleri' },
      { name: 'Admin — Users', description: 'Kullanıcı yönetimi (Admin)' },
      { name: 'Admin — Listings', description: 'İlan yönetimi (Admin)' },
      { name: 'Admin — Contacts', description: 'Mesaj yönetimi (Admin)' },
      { name: 'Admin — Newsletters', description: 'Bülten abone yönetimi (Admin)' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: '`POST /api/auth/login` ile aldığınız token\'ı buraya girin'
        }
      },
      schemas: {
        /* ── Primitives ── */
        ObjectId: {
          type: 'string',
          pattern: '^[a-fA-F0-9]{24}$',
          example: '64f1a2b3c4d5e6f7a8b9c0d1'
        },

        /* ── Error ── */
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Hata mesajı' }
          }
        },

        /* ── Pagination ── */
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 20 },
            total: { type: 'integer', example: 150 },
            pages: { type: 'integer', example: 8 }
          }
        },

        /* ── Subscription ── */
        SubscriptionPlan: {
          type: 'string',
          enum: ['free', 'professional', 'corporate'],
          example: 'professional'
        },
        Subscription: {
          type: 'object',
          properties: {
            plan: { $ref: '#/components/schemas/SubscriptionPlan' },
            expiresAt: { type: 'string', format: 'date-time', nullable: true, example: '2026-06-01T00:00:00.000Z' }
          }
        },

        /* ── User ── */
        User: {
          type: 'object',
          properties: {
            _id: { $ref: '#/components/schemas/ObjectId' },
            name: { type: 'string', example: 'Ahmet Yılmaz' },
            email: { type: 'string', format: 'email', example: 'ahmet@vera.com' },
            avatarUrl: { type: 'string', format: 'uri', nullable: true, example: null },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            subscription: { $ref: '#/components/schemas/Subscription' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        UserWithListingCount: {
          allOf: [
            { $ref: '#/components/schemas/User' },
            {
              type: 'object',
              properties: {
                listingCount: { type: 'integer', example: 3 }
              }
            }
          ]
        },

        /* ── Property ── */
        PropertyType: {
          type: 'string',
          enum: ['apartment', 'house', 'land', 'commercial'],
          example: 'apartment'
        },
        ListingType: {
          type: 'string',
          enum: ['sale', 'rent'],
          example: 'sale'
        },
        PropertyFeatures: {
          type: 'object',
          properties: {
            rooms: { type: 'integer', example: 3 },
            bathrooms: { type: 'integer', example: 1 },
            floor: { type: 'integer', example: 4 },
            heating: { type: 'string', example: 'Kombi' }
          }
        },
        PropertyLocation: {
          type: 'object',
          required: ['city'],
          properties: {
            city: { type: 'string', example: 'İstanbul' },
            district: { type: 'string', example: 'Kadıköy' },
            address: { type: 'string', example: 'Moda Caddesi No:12' }
          }
        },
        Property: {
          type: 'object',
          properties: {
            _id: { $ref: '#/components/schemas/ObjectId' },
            owner: { $ref: '#/components/schemas/User' },
            title: { type: 'string', example: 'Kadıköy\'de Satılık 3+1 Daire' },
            description: { type: 'string', example: 'Deniz manzaralı, merkezi konumda...' },
            type: { $ref: '#/components/schemas/PropertyType' },
            listingType: { $ref: '#/components/schemas/ListingType' },
            price: { type: 'number', example: 4500000 },
            currency: { type: 'string', example: 'TRY' },
            size: { type: 'number', example: 110 },
            features: { $ref: '#/components/schemas/PropertyFeatures' },
            location: { $ref: '#/components/schemas/PropertyLocation' },
            amenities: { type: 'array', items: { type: 'string' }, example: ['Asansör', 'Kapalı Otopark'] },
            yearBuilt: { type: 'integer', example: 2015 },
            status: { type: 'string', enum: ['ready', 'under-construction'], example: 'ready' },
            deedStatus: { type: 'string', example: 'Kat Mülkiyeti' },
            maintenanceFee: { type: 'number', example: 800 },
            totalFloors: { type: 'integer', example: 8 },
            parking: { type: 'boolean', example: true },
            furnished: { type: 'boolean', example: false },
            virtualTourUrl: { type: 'string', format: 'uri', nullable: true },
            isFeatured: { type: 'boolean', example: false },
            images: { type: 'array', items: { type: 'string', format: 'uri' } },
            viewCount: { type: 'integer', example: 142 },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreatePropertyBody: {
          type: 'object',
          required: ['title', 'description', 'type', 'listingType', 'price', 'location'],
          properties: {
            title: { type: 'string', example: 'Kadıköy\'de Satılık 3+1 Daire' },
            description: { type: 'string', example: 'Deniz manzaralı, merkezi konumda...' },
            type: { $ref: '#/components/schemas/PropertyType' },
            listingType: { $ref: '#/components/schemas/ListingType' },
            price: { type: 'number', example: 4500000 },
            currency: { type: 'string', example: 'TRY' },
            size: { type: 'number', example: 110 },
            features: { $ref: '#/components/schemas/PropertyFeatures' },
            location: { $ref: '#/components/schemas/PropertyLocation' },
            amenities: { type: 'array', items: { type: 'string' } },
            yearBuilt: { type: 'integer', example: 2015 },
            status: { type: 'string', enum: ['ready', 'under-construction'] },
            deedStatus: { type: 'string' },
            maintenanceFee: { type: 'number' },
            totalFloors: { type: 'integer' },
            parking: { type: 'boolean' },
            furnished: { type: 'boolean' },
            virtualTourUrl: { type: 'string', format: 'uri' },
            isFeatured: { type: 'boolean' }
          }
        },

        /* ── Contact ── */
        Contact: {
          type: 'object',
          properties: {
            _id: { $ref: '#/components/schemas/ObjectId' },
            name: { type: 'string', example: 'Ayşe Kaya' },
            email: { type: 'string', format: 'email', example: 'ayse@ornek.com' },
            phone: { type: 'string', nullable: true, example: '+90 532 000 0000' },
            message: { type: 'string', example: 'Merhaba, ilan hakkında bilgi almak istiyorum.' },
            isRead: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateContactBody: {
          type: 'object',
          required: ['name', 'email', 'message'],
          properties: {
            name: { type: 'string', example: 'Ayşe Kaya' },
            email: { type: 'string', format: 'email', example: 'ayse@ornek.com' },
            phone: { type: 'string', example: '+90 532 000 0000' },
            message: { type: 'string', minLength: 10, example: 'Merhaba, ilan hakkında bilgi almak istiyorum.' }
          }
        },

        /* ── Newsletter ── */
        Newsletter: {
          type: 'object',
          properties: {
            _id: { $ref: '#/components/schemas/ObjectId' },
            email: { type: 'string', format: 'email', example: 'abone@ornek.com' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        /* ── Subscription Plan ── */
        PlanInfo: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'professional' },
            name: { type: 'string', example: 'Professional' },
            price: { type: 'number', example: 299 },
            listingLimit: { type: 'integer', example: 7 },
            features: { type: 'array', items: { type: 'string' } }
          }
        },

        /* ── Admin Stats ── */
        AdminStats: {
          type: 'object',
          properties: {
            totalUsers: { type: 'integer', example: 248 },
            totalListings: { type: 'integer', example: 512 },
            activeListings: { type: 'integer', example: 430 },
            inactiveListings: { type: 'integer', example: 82 },
            totalNewsletters: { type: 'integer', example: 96 },
            unreadContacts: { type: 'integer', example: 7 },
            planDistribution: {
              type: 'object',
              properties: {
                free: { type: 'integer', example: 180 },
                professional: { type: 'integer', example: 52 },
                corporate: { type: 'integer', example: 16 }
              }
            },
            recentUsers: {
              type: 'array',
              items: { $ref: '#/components/schemas/User' }
            },
            recentListings: {
              type: 'array',
              items: { $ref: '#/components/schemas/Property' }
            }
          }
        }
      },

      /* ── Reusable Responses ── */
      responses: {
        Unauthorized: {
          description: 'Kimlik doğrulama gerekli veya geçersiz token',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        Forbidden: {
          description: 'Bu işlem için yetkiniz yok',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        NotFound: {
          description: 'Kaynak bulunamadı',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        BadRequest: {
          description: 'Geçersiz istek verisi',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      },

      /* ── Reusable Parameters ── */
      parameters: {
        IdParam: {
          name: 'id',
          in: 'path',
          required: true,
          schema: { $ref: '#/components/schemas/ObjectId' },
          description: 'MongoDB ObjectId'
        },
        PageParam: {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1, minimum: 1 },
          description: 'Sayfa numarası'
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20, minimum: 1, maximum: 50 },
          description: 'Sayfa başına kayıt sayısı'
        },
        SearchParam: {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Arama terimi'
        }
      }
    },
    security: []
  },
  apis: ['./src/routes/**/*.js', './src/app.js']
};
