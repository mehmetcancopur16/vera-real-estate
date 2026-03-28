export const AUTHOR = "Vera Editör Ekibi";

export function slugify(title) {
  return title
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const BLOG_POSTS = [
  /* ── Yatırım Rehberi ── */
  {
    slug: "konyada-yatirim-yapmanin-avantajlari",
    category: "Yatırım Rehberi",
    categoryColor: "from-emerald-500 to-teal-600",
    categoryBg: "bg-emerald-500",
    title: "Konya'da Yatırım Yapmanın Avantajları",
    date: "12 Mart 2026",
    readTime: "5 dk okuma",
    excerpt:
      "Bölgesel büyüme, ulaşım yatırımları ve doğru zamanlama ile değer yaratın. Konya'nın emlak piyasası 2026'da neden öne çıkıyor?",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400&auto=format&fit=crop",
    featured: true,
    content: {
      intro:
        "Konya, son yıllarda hız kazanan altyapı yatırımları ve artan nüfusuyla Türkiye'nin en cazip gayrimenkul pazarlarından biri haline gelmiştir. Yüksek hızlı tren bağlantısı, organize sanayi bölgeleri ve üniversite kampüsleri, şehrin değerini her geçen yıl artırmaktadır.",
      sections: [
        {
          title: "Ulaşım Altyapısı Yatırımları",
          body: "Konya-Ankara YHT hattının güçlendirilmesi ve planlanan iç hat uçuş kapasitesi artışı, şehri ticari açıdan daha erişilebilir kılmaktadır. Merkezi konumlardaki konut projeleri, bu gelişmelerle birlikte yüksek kira getirisi sunmaktadır.",
        },
        {
          title: "Üniversite ve Genç Nüfus Dinamiği",
          body: "Selçuk Üniversitesi ve Konya Teknik Üniversitesi başta olmak üzere şehirdeki 7 üniversite, yıllık 100.000'i aşkın öğrenci nüfusu yaratmaktadır. Bu durum kiralık konut talebini sürekli canlı tutmakta ve yatırımcılar için düzenli gelir imkânı sağlamaktadır.",
        },
        {
          title: "Fiyat Avantajı ve Getiri Oranları",
          body: "İstanbul ve Ankara ile kıyaslandığında Konya'da metrekare fiyatları hâlâ erişilebilir düzeydedir. Ancak değer artış hızı son 3 yılda %45'i aşmıştır. Erken yatırım yapanlar bu farkı yakın vadede kapatacak getiriyle ödüllendirilecektir.",
        },
      ],
      tips: [
        "Selçuklu ve Karatay ilçelerindeki yeni konut projelerini yakından takip edin.",
        "Öğrenci nüfusuna yakın stüdyo ve 1+1 dairelerin kira getirisi yüksektir.",
        "Organize Sanayi Bölgesi çevresindeki ticari gayrimenkuller değer kazanmaktadır.",
      ],
      conclusion:
        "Konya, hem konut hem ticari gayrimenkul yatırımcıları için 2026'nın en stratejik şehirlerinden biridir. Doğru lokasyon seçimi ve uzman danışmanlıkla yapılan yatırımlar, orta vadede tatmin edici getiriler sunmaya devam edecektir.",
    },
  },
  {
    slug: "fiyat-analizi-satin-alma-mi-kiralama-mi",
    category: "Yatırım Rehberi",
    categoryColor: "from-emerald-500 to-teal-600",
    categoryBg: "bg-emerald-500",
    title: "Fiyat Analizi: Satın Alma mı Kiralama mı?",
    date: "05 Mart 2026",
    readTime: "4 dk okuma",
    excerpt:
      "Yaşam hedeflerinize göre bütçe stratejisi oluşturmanın pratik yolları. Her iki seçeneğin avantaj ve dezavantajları.",
    image:
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1400&auto=format&fit=crop",
    featured: false,
    content: {
      intro:
        "Konut kararlarında en kritik sorulardan biri satın alma mı yoksa kiralama mı yapılması gerektiğidir. Bu tercihi etkileyen birçok finansal ve kişisel faktör bulunmaktadır.",
      sections: [
        {
          title: "Satın Alma Avantajları",
          body: "Konut sahibi olmak uzun vadede kira ödemelerini ortadan kaldırır ve mülk değer artışından yararlanmanızı sağlar. Mortgage faiz ödemeleri belli koşullarda vergi avantajı sunabilir.",
        },
        {
          title: "Kiralama Esnekliği",
          body: "Özellikle kariyerinin başında olanlar veya yüksek hareketliliğe sahip profesyoneller için kiralama, sermayeyi serbest bırakır. Bu sermaye yatırım araçlarında daha yüksek getiri sağlayabilir.",
        },
        {
          title: "Break-Even Hesabı",
          body: "Satın almanın kiralaya kıyasla kazançlı olmaya başladığı eşik noktası, genellikle 5-7 yıldır. Bu süreyi geçmeden satmak durumundaysanız kiralama ekonomik açıdan daha avantajlı olabilir.",
        },
      ],
      tips: [
        "Peşinat miktarınız toplam fiyatın en az %20'si olmalıdır.",
        "Kredi taksitleri net gelirinizin %35'ini geçmemeli.",
        "Lokasyon değer artışı potansiyelini araştırın.",
      ],
      conclusion:
        "Her iki seçenek de doğru koşullarda avantajlı olabilir. Kendi finansal durumunuzu ve yaşam hedeflerinizi göz önünde bulundurarak karar verin. Uzman bir danışmandan destek almak bu süreçte büyük fark yaratır.",
    },
  },
  {
    slug: "tapu-ve-surec-kontrol-listesi",
    category: "Yatırım Rehberi",
    categoryColor: "from-emerald-500 to-teal-600",
    categoryBg: "bg-emerald-500",
    title: "Tapu ve Süreç Kontrol Listesi",
    date: "26 Şubat 2026",
    readTime: "6 dk okuma",
    excerpt:
      "Satın alma sürecinde dikkat edilmesi gereken belgeler ve kritik adımlar. Tapu devri öncesi kontrol edilmesi gerekenler.",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1400&auto=format&fit=crop",
    featured: false,
    content: {
      intro:
        "Gayrimenkul alım sürecindeki belge yönetimi, en sık atlanan kritik adımları içerir. Doğru hazırlık hem zaman hem para kaybını önler.",
      sections: [
        {
          title: "Tapu Tescil Öncesi Kontroller",
          body: "İpotekli, hacizli veya şerhli taşınmazlar ciddi riskler doğurabilir. Tapu Sicil Müdürlüğü'nden alınacak resmi kayıt belgesi bu riskleri açığa çıkarır.",
        },
        {
          title: "İmar ve Ruhsat Durumu",
          body: "Yapı ruhsatı, iskan belgesi ve imar planı uyumluluğu kontrol edilmelidir. İmar kirliliği olan yapılar yıkım riski taşıyabilir.",
        },
        {
          title: "Sözleşme ve Ön Protokol",
          body: "Tapu devri öncesi imzalanan satış vaadi sözleşmesinin noterde onaylı olması hukuki güvence sağlar. Cayma bedeli ve teslim tarihleri net biçimde belirtilmelidir.",
        },
      ],
      tips: [
        "Tapu devri sırasında güncel rayiç bedel kontrolü yapın.",
        "Banka değerleme raporu bağımsız eksper ile teyit edilmeli.",
        "DASK sigortası ve zorunlu deprem sigortasını ihmal etmeyin.",
      ],
      conclusion:
        "Tapu sürecindeki her adım titizlikle yönetilmelidir. Deneyimli bir emlak avukatıyla çalışmak, olası uyuşmazlıkları baştan önler.",
    },
  },

  /* ── Lüks Yaşam ── */
  {
    slug: "luks-satin-almada-dogru-strateji",
    category: "Lüks Yaşam",
    categoryColor: "from-violet-500 to-purple-600",
    categoryBg: "bg-violet-500",
    title: "Lüks Satın Almada Doğru Strateji",
    date: "18 Mart 2026",
    readTime: "5 dk okuma",
    excerpt:
      "Seçkin portföylerde doğru karar için şeffaflık, analiz ve danışmanlık uyumu. Premium gayrimenkulde karar süreçleri.",
    image:
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=1400&auto=format&fit=crop",
    featured: true,
    content: {
      intro:
        "Premium gayrimenkul piyasasında başarılı bir satın alma, titiz bir strateji ve güvenilir danışmanlık gerektirir. Lüks segmentte fiyat müzakeresi ve mülk değerlendirmesi farklı dinamikler içerir.",
      sections: [
        {
          title: "Pazar Analizi ve Karşılaştırma",
          body: "Hedef bölgedeki son 12 aydaki satış verilerini inceleyin. Benzer özellikteki mülklerin satış fiyatları ile ilan fiyatları arasındaki fark, pazarlık marjını gösterir.",
        },
        {
          title: "Danışman Seçimi",
          body: "Lüks segmentte uzmanlaşmış, portföyünü sadece premium mülklerden oluşturan bir danışman tercih edin. Ağ genişliği ve off-market erişimi kritik avantaj sağlar.",
        },
        {
          title: "Due Diligence Süreci",
          body: "Bağımsız teknik ekspertiz, hukuki tarama ve finansal analiz üçlüsü premium alımlarda vazgeçilmezdir. Bu süreçleri atlamak ciddi kayıplara yol açabilir.",
        },
      ],
      tips: [
        "Yalnızca ilan fiyatına değil, toplam sahip olma maliyetine bakın.",
        "Aidat, yönetim giderleri ve vergileri hesaba katın.",
        "Mülkün yeniden satış potansiyelini değerlendirin.",
      ],
      conclusion:
        "Lüks gayrimenkul, doğru stratejiyle hem prestij hem de güçlü yatırım getirisi sunar. Aceleci kararlardan kaçınmak ve tüm aşamalarda uzman desteği almak başarının anahtarıdır.",
    },
  },
  {
    slug: "manzara-isik-plan-degerin-3-anahtari",
    category: "Lüks Yaşam",
    categoryColor: "from-violet-500 to-purple-600",
    categoryBg: "bg-violet-500",
    title: "Manzara, Işık, Plan: Değerin 3 Anahtarı",
    date: "08 Mart 2026",
    readTime: "4 dk okuma",
    excerpt:
      "Premium gayrimenkulde değer algısını belirleyen kritik detaylar ve pratik öneriler. Alıcılar neden bu üç unsura öncelik veriyor?",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop",
    featured: false,
    content: {
      intro:
        "Üst segment gayrimenkulde fiyatı belirleyen unsurlar incelendiğinde üç temel faktör öne çıkar: görünüm, doğal ışık kalitesi ve iç mekân düzeni.",
      sections: [
        {
          title: "Manzara Değeri",
          body: "Deniz, orman ya da şehir silüeti manzarası, aynı konumdaki mülk fiyatını %20-40 artırabilir. Bu değer, uzun vadede korunma eğilimindedir.",
        },
        {
          title: "Işık Kalitesi",
          body: "Güneş alan cepheler ve yüksek tavan yüksekliği, mekânı hem fiziksel hem psikolojik olarak genişletir. Aydınlık mülkler daha kısa sürede alıcı bulur.",
        },
        {
          title: "Plan ve Akışkanlık",
          body: "Fonksiyonel oda düzeni, açık mutfak-salon bağlantısı ve yeterli depolama alanları, günlük yaşam kalitesini doğrudan etkiler.",
        },
      ],
      tips: [
        "Farklı saatlerde mülkü ziyaret ederek ışık değişimini gözlemleyin.",
        "Manzaranın önündeki yapılaşma durumunu imar planıyla doğrulayın.",
        "Plan verimliliğini kullanılabilir metrekare bazında değerlendirin.",
      ],
      conclusion:
        "Bu üç unsuru bütünleşik değerlendiren alıcılar, uzun vadede daha tatmin edici sonuçlar elde etmektedir. Vera danışmanları her mülkü bu kriterler açısından detaylıca analiz etmektedir.",
    },
  },
  {
    slug: "butik-site-yasami-artilari-ve-eksileri",
    category: "Lüks Yaşam",
    categoryColor: "from-violet-500 to-purple-600",
    categoryBg: "bg-violet-500",
    title: "Butik Site Yaşamı: Artıları ve Eksileri",
    date: "22 Şubat 2026",
    readTime: "4 dk okuma",
    excerpt:
      "Güvenlik, sosyal alanlar ve aidat dengesi için karar rehberi. Büyük siteler mi, butik projeler mi?",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1400&auto=format&fit=crop",
    featured: false,
    content: {
      intro:
        "Butik konut projeleri, az sayıda bağımsız birim sunarak hem özel hem huzurlu bir yaşam vaat eder. Ancak bu modelin bazı dezavantajları da göz önünde bulundurulmalıdır.",
      sections: [
        {
          title: "Güvenlik ve Mahremiyet",
          body: "Az kişi sayısı komşuluğu güçlendirir. 7/24 güvenlik ve kamera sistemi bakım maliyeti daha düşük olduğundan aidat oranları da daha makul tutulabilir.",
        },
        {
          title: "Sosyal Alanlar",
          body: "Büyük sitelerin sunduğu spor salonları ve havuzlar butik projelerde sınırlı kalabilir. Ancak ortak alanların bakımı çok daha hızlı ve etkin şekilde yapılır.",
        },
        {
          title: "Aidat ve Yönetim",
          body: "Az bağımsız birim nedeniyle ortak giderlerin kişi başına düşen payı yüksek olabilir. Öte yandan yönetim kararlarına daha aktif katılım sağlanabilir.",
        },
      ],
      tips: [
        "Site yönetim kurulunun son 3 yıllık finansal tablolarını inceleyin.",
        "Mevcut sakinlerle görüşerek pratik deneyimleri öğrenin.",
        "Rezerv fonu büyüklüğüne dikkat edin.",
      ],
      conclusion:
        "Butik site yaşamı, doğru beklentilerle değerlendirildiğinde premium bir deneyim sunar. Aidat dengesi ve proje kalitesi ön planda tutulmalıdır.",
    },
  },

  /* ── Emlak Trendleri ── */
  {
    slug: "2026-emlak-trendleri",
    category: "Emlak Trendleri",
    categoryColor: "from-blue-500 to-indigo-600",
    categoryBg: "bg-blue-500",
    title: "2026 Emlak Trendleri",
    date: "20 Mart 2026",
    readTime: "7 dk okuma",
    excerpt:
      "Konut, arsa ve ticari alanlarda 2026'yı şekillendiren fırsat alanları. Sektörü hangi dinamikler yönlendiriyor?",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop",
    featured: true,
    content: {
      intro:
        "2026 yılı Türk gayrimenkul sektöründe belirleyici dönüşümlere sahne olmaktadır. Döviz kuru stabilitesi, yüksek konut talebi ve yeşil bina standartları piyasayı şekillendiren başlıca güçlerdir.",
      sections: [
        {
          title: "Konut Talebinde Demografik Dönüşüm",
          body: "Y ve Z kuşağının ev sahibi olma talebi, özellikle büyükşehirlerde kompakt ve akıllı konutlara olan ilgiyi artırmaktadır. Akıllı ev sistemleri artık standart haline geliyor.",
        },
        {
          title: "Yeşil Bina Sertifikasyonu",
          body: "LEED ve BREEAM sertifikalı yapılar, hem kiraya hem satışa daha yüksek fiyat commandeden etkilenmektedir. Enerji verimliliği, alıcı kararlarında belirleyici kriter hâline gelmiştir.",
        },
        {
          title: "Anadolu Şehirlerine Göç Dalgası",
          body: "Uzaktan çalışma modelinin kalıcılaşmasıyla birlikte Ankara, İzmir dışındaki Anadolu şehirleri cazip seçenekler haline gelmiştir. Bu trend, ikinci el konut fiyatlarını yukarı çekmektedir.",
        },
      ],
      tips: [
        "Enerji verimliliği yüksek projelere odaklanın.",
        "Yeni nesil alıcıların beklentilerini proje seçiminde gözetin.",
        "Anadolu'daki büyüyen şehir merkezlerini araştırın.",
      ],
      conclusion:
        "2026, iyi hazırlanmış yatırımcılar için kritik fırsatlar sunan bir yıl olacaktır. Trendleri erken okuyanlar rekabet avantajı elde edecektir.",
    },
  },
  {
    slug: "surdurulebilir-yapilar-ve-enerji-verimliligi",
    category: "Emlak Trendleri",
    categoryColor: "from-blue-500 to-indigo-600",
    categoryBg: "bg-blue-500",
    title: "Sürdürülebilir Yapılar ve Enerji Verimliliği",
    date: "02 Mart 2026",
    readTime: "5 dk okuma",
    excerpt:
      "Yeni nesil projelerde enerji tasarrufu ve uzun vadeli değer artışı. Çevreci yapılar neden daha değerli?",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1400&auto=format&fit=crop",
    featured: false,
    content: {
      intro:
        "Sürdürülebilir yapılar artık tercih değil; zorunluluk haline gelmektedir. Yönetmelik değişiklikleri ve tüketici bilinci, sektörü yeşil dönüşüme zorlamaktadır.",
      sections: [
        {
          title: "Enerji Performans Sertifikası",
          body: "A sınıfı enerji performans sertifikasına sahip yapılar, ısıtma ve soğutma maliyetlerini %40'a kadar düşürebilir. Bu durum hem kiracı hem alıcı tercihini doğrudan etkiler.",
        },
        {
          title: "Yenilenebilir Enerji Entegrasyonu",
          body: "Güneş paneli ve ısı pompası sistemleri binaların karbon ayak izini azaltırken sakinlere uzun vadeli tasarruf imkânı sunar.",
        },
        {
          title: "Yeşil Sertifika Getirisi",
          body: "Çeşitli Avrupa piyasalarında yeşil sertifikalı binalar %10-15 fiyat primi taşımaktadır. Türkiye'de bu trendin önümüzdeki 3-5 yılda belirginleşmesi beklenmektedir.",
        },
      ],
      tips: [
        "Yapı ruhsatı başvurularında enerji verimliliği belgesi istendiğini unutmayın.",
        "Yalıtım kalitesi ve cam sistemi karar sürecinizde belirleyici olsun.",
        "Yeşil bina yatırımlarında uzun vadeli bakış açısı benimseyın.",
      ],
      conclusion:
        "Çevreye duyarlı yapılar hem etik hem ekonomik açıdan üstün performans sergilemektedir. Bu segment, bilinçli yatırımcılar için büyük fırsat barındırmaktadır.",
    },
  },
  {
    slug: "ticari-gayrimenkulde-risk-yonetimi",
    category: "Emlak Trendleri",
    categoryColor: "from-blue-500 to-indigo-600",
    categoryBg: "bg-blue-500",
    title: "Ticari Gayrimenkulde Risk Yönetimi",
    date: "14 Şubat 2026",
    readTime: "6 dk okuma",
    excerpt:
      "Lokasyon, kira potansiyeli ve sözleşme yönetimiyle daha sağlam yatırım. Ticari gayrimenkulde tuzaklardan nasıl kaçınırsınız?",
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1400&auto=format&fit=crop",
    featured: false,
    content: {
      intro:
        "Ticari gayrimenkul, konut yatırımlarına göre daha yüksek kira getirisi sunarken, beraberinde daha kompleks risk profili de getirir.",
      sections: [
        {
          title: "Lokasyon ve Ticaret Hacmi",
          body: "Ticari mülklerde yaya trafiği, araç erişimi ve yakın çevredeki işletme yoğunluğu birincil değer belirleyicileridir. Boş dükkan oranı yüksek bölgelerde dikkatli olunmalıdır.",
        },
        {
          title: "Kiracı Profili ve Kira Sözleşmesi",
          body: "Uzun vadeli, garantili kira sözleşmeleri taşınmazın değerini artırır. Kiracının sektörel durumu ve finansal gücü düzenli aralıklarla değerlendirilmelidir.",
        },
        {
          title: "Boşluk Riski Yönetimi",
          body: "İki kiracı dönemindeki boşluk sürecini finanse edecek yedek sermaye bulundurmak, yatırımın sürdürülebilirliği için kritiktir.",
        },
      ],
      tips: [
        "Çoklu kiracı yapısı riski dağıtır.",
        "Kira artış endeksi sözleşmelere eklenmelidir.",
        "Bölgenin imar planı değişikliklerini takip edin.",
      ],
      conclusion:
        "Ticari gayrimenkul, sistematik risk yönetimiyle portföyün en güçlü bileşeni olabilir. Konum analizi ve sözleşme güvencesi her şeyin temelini oluşturur.",
    },
  },
];

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug) || null;
}

export const CATEGORIES = [...new Set(BLOG_POSTS.map((p) => p.category))];

export const FEATURED_POSTS = BLOG_POSTS.filter((p) => p.featured);
