import { ArrowRight } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-14 md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.22),transparent_55%)]" />
        <div className="relative max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Kullanım Şartları</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900 md:text-5xl">
            Vera Real Estate Kullanım Koşulları
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
            Bu sayfa; web sitemizi kullanan ziyaretçilerin ve üyelerin uyması gereken şartları özetler.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 md:p-10">
        <div className="space-y-8 text-slate-700">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">1. Hizmetin Kapsamı</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Vera Real Estate; emlak ilanlarının görüntülenmesi, kullanıcıların iletişim taleplerinin alınması ve
              bülten aboneliği gibi hizmetler sunar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">2. Hesap ve Sorumluluklar</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Üye olan kullanıcıların doğru ve güncel bilgi vermesi esastır. Kullanıcılar, üçüncü kişilerin haklarını
              ihlal edecek şekilde içerik paylaştıklarında doğabilecek sonuçlardan sorumludur.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">3. İptal ve Sonlandırma</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Kullanıcı talepleri, yasal gereklilikler ve hizmet güvenliği dikkate alınarak değerlendirilebilir.
              Şüpheli kullanım hallerinde hesaplar geçici veya kalıcı olarak kısıtlanabilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">4. Sorumluluk Sınırları</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Kullanıcı içeriklerinin ve ilan metinlerinin doğruluğuna ilişkin sorumluluk ilgili kullanıcıya/ilan sahibine aittir.
              Vera Real Estate, hizmetin kesintisiz olacağını garanti etmez.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">5. Gizlilik Politikası ile Bağlantı</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Bu şartlar; Gizlilik Politikası ile birlikte değerlendirilir. Kişisel verilerinizin işlenmesi Gizlilik Politikası
              hükümlerine göre yapılır.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-accent">
              <ArrowRight className="h-4 w-4" />
              <p className="text-sm font-semibold">Not</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed">
              Bu metinler örnek/prototip amaçlı hazırlanmıştır. Yasal danışman onayıyla son halinize getirilebilir.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

