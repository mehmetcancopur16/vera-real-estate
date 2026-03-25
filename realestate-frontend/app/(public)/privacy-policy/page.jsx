import Image from "next/image";

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-14 md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(2,132,199,0.18),transparent_50%)]" />
        <div className="relative max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Gizlilik Politikası</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900 md:text-5xl">
            Veri Toplama ve İşleme Yaklaşımımız
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
            Vera Real Estate olarak kişisel verilerinizi güvenle yönetmeyi ve şeffaf biçimde işlemeyi hedefleriz.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 md:p-10">
        <div className="space-y-6 text-slate-700">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">1. Kapsam</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Bu politika; Vera Real Estate web sitesi üzerinden toplanan bilgilerin nasıl işlendiğini,
              hangi amaçlarla kullanıldığını ve kullanıcı haklarını açıklar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">2. Toplanan Veriler</h2>
            <p className="mt-2 text-sm leading-relaxed">
              İletişim formu ve bülten aboneliği gibi işlemleriniz sırasında; ad-soyad, e-posta adresiniz,
              mesaj içerikleriniz ve talep detayları toplanabilir. Ayrıca site kullanımına ilişkin teknik bilgiler
              (ör. IP adresi, tarayıcı türü, erişim zamanı) otomatik olarak kaydedilebilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">3. Verilerin Kullanım Amaçları</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Toplanan veriler, taleplerinizi yanıtlamak, bülten aboneliğinizi yönetmek, güvenliği sağlamak,
              dolandırıcılık girişimlerini önlemek ve yasal yükümlülükleri yerine getirmek için kullanılabilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">4. Hukuki Dayanak</h2>
            <p className="mt-2 text-sm leading-relaxed">
              6698 sayılı KVKK kapsamında veriler, ilgili yasal dayanaklar ve açık rıza şartlarına uygun şekilde işlenir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">5. Saklama Süresi</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Veriler, işleme amaçlarının gerektirdiği süre boyunca saklanır. Sonrasında mevzuata uygun şekilde silinir,
              yok edilir veya anonim hale getirilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">6. Kullanıcı Hakları</h2>
            <p className="mt-2 text-sm leading-relaxed">
              KVKK uyarınca kullanıcılar; verilerine erişim, düzeltme, silme/yok etme, işleme itirazı ve
              verilerin üçüncü kişilerle paylaşımının durdurulması gibi haklara sahiptir.
              Haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">7. İletişim</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Bu politikayla ilgili sorularınız için info@vera.com adresinden bize ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

