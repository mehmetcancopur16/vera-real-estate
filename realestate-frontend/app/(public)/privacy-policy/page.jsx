export default function PrivacyPolicyPage() {
  return (
    <div>
      <section className="rounded-3xl bg-slate-50 px-6 py-14 text-center">
        <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">Gizlilik Politikası</h1>
        <p className="mt-3 text-sm text-slate-600">Son Güncelleme: Mart 2026</p>
      </section>

      <section className="mx-auto max-w-4xl py-12 px-4">
        <div className="space-y-8 text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">1. Amaç ve Kapsam</h2>
            <p className="mt-3 text-sm">
              Bu Gizlilik Politikası; Vera Real Estate web sitesi ve ilgili dijital kanallar üzerinden elde edilen
              kişisel verilerin işlenmesine ilişkin esasları açıklar. Bu metin, kullanıcıların veri işleme süreçlerini
              şeffaf biçimde anlamasına yardımcı olmak amacıyla hazırlanmıştır.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">2. Veri Sorumlusu</h2>
            <p className="mt-3 text-sm">
              Bu politika kapsamında veri sorumlusu, Vera Real Estate’tir. İletişim için{" "}
              <span className="font-semibold">info@vera.com</span> adresi üzerinden bize ulaşabilirsiniz.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">3. Toplanan Veriler</h2>
            <h3 className="mt-4 text-lg font-semibold text-slate-800">3.1. Doğrudan sağlanan veriler</h3>
            <p className="mt-2 text-sm">
              İletişim formu, bülten aboneliği ve hesap işlemleri sırasında; ad-soyad, e-posta, telefon, mesaj içeriği
              gibi bilgiler tarafınızca sağlanabilir.
            </p>
            <h3 className="mt-4 text-lg font-semibold text-slate-800">3.2. Otomatik toplanan veriler</h3>
            <p className="mt-2 text-sm">
              Site kullanımınıza ilişkin; IP adresi, tarayıcı türü, cihaz bilgisi, sayfa görüntüleme kayıtları ve benzeri
              teknik veriler güvenlik ve performans amaçlarıyla otomatik olarak kaydedilebilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">4. Çerezler (Cookies)</h2>
            <p className="mt-3 text-sm">
              Sitemiz; kullanıcı deneyimini geliştirmek ve güvenliği sağlamak için çerezleri kullanabilir. Çerez tercihleri
              tarayıcı ayarlarınız üzerinden yönetilebilir. Zorunlu çerezler kapatıldığında bazı özellikler sınırlı çalışabilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">5. İşleme Amaçları</h2>
            <p className="mt-3 text-sm">
              Kişisel veriler; taleplerinizi yanıtlamak, bülten aboneliğinizi yönetmek, hizmet kalitesini artırmak,
              dolandırıcılık girişimlerini önlemek, yasal yükümlülükleri yerine getirmek ve meşru menfaatlerimizi korumak
              amaçlarıyla işlenebilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">6. Üçüncü Taraf Paylaşımları</h2>
            <p className="mt-3 text-sm">
              Verileriniz, hizmetin sağlanması için gerekli olması halinde; altyapı sağlayıcıları, barındırma hizmetleri,
              ölçümleme/analitik servisleri gibi üçüncü taraflarla, mevzuata uygun olarak sınırlı ölçüde paylaşılabilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">7. Saklama Süresi</h2>
            <p className="mt-3 text-sm">
              Veriler, işleme amaçlarının gerektirdiği süre boyunca saklanır; amaç ortadan kalktığında yasal zorunluluklar
              çerçevesinde silinir, yok edilir veya anonim hale getirilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">8. Kullanıcı Hakları</h2>
            <p className="mt-3 text-sm">
              KVKK kapsamında; verilerinize erişim, düzeltme, silme/yok etme, işlemeye itiraz ve aktarımın sınırlandırılması gibi
              haklara sahipsiniz. Başvurularınızı{" "}
              <span className="font-semibold">info@vera.com</span> adresi üzerinden iletebilirsiniz.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

