export default function TermsOfServicePage() {
  return (
    <div>
      <section className="rounded-3xl bg-slate-50 px-6 py-14 text-center">
        <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">Kullanım Şartları</h1>
        <p className="mt-3 text-sm text-slate-600">Son Güncelleme: Mart 2026</p>
      </section>

      <section className="mx-auto max-w-4xl py-12 px-4">
        <div className="space-y-8 text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">1. Genel Hükümler</h2>
            <p className="mt-3 text-sm">
              Bu Kullanım Şartları, Vera Real Estate web sitesini ziyaret eden ve/veya hizmetlerinden yararlanan tüm
              kullanıcılar için geçerlidir. Siteyi kullanmanız, bu şartları kabul ettiğiniz anlamına gelir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">2. Hizmet Tanımı</h2>
            <p className="mt-3 text-sm">
              Vera Real Estate; gayrimenkul ilanlarının görüntülenmesi, filtreleme, iletişim taleplerinin alınması ve
              bülten aboneliği gibi özellikler sunar. Hizmet kapsamı zaman içinde güncellenebilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">3. Fikri Mülkiyet</h2>
            <p className="mt-3 text-sm">
              Site içeriği, tasarım unsurları, metinler ve arayüz bileşenleri dahil olmak üzere; ilgili mevzuat kapsamında
              korunur. İzinsiz kopyalama, çoğaltma, yeniden yayınlama ve ticari kullanım yasaktır.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">4. İlan Kuralları</h2>
            <h3 className="mt-4 text-lg font-semibold text-slate-800">4.1. Doğruluk ve güncellik</h3>
            <p className="mt-2 text-sm">
              İlan içeriklerinin doğruluğu, güncelliği ve mevzuata uygunluğu ilan sahibi/kullanıcı sorumluluğundadır.
              Yanıltıcı veya eksik içerikler tespit edildiğinde ilanlar kısıtlanabilir veya kaldırılabilir.
            </p>
            <h3 className="mt-4 text-lg font-semibold text-slate-800">4.2. Yasaklı içerikler</h3>
            <p className="mt-2 text-sm">
              Hukuka aykırı, yanıltıcı, hak ihlali içeren veya üçüncü kişilerin kişisel verilerini izinsiz paylaşan içerikler
              yayınlanamaz.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">5. Yasaklı Kullanım</h2>
            <p className="mt-3 text-sm">
              Sisteme yetkisiz erişim girişimleri, otomasyon/bot ile veri toplama, hizmeti engellemeye yönelik eylemler,
              kullanıcıları yanıltma ve benzeri kötüye kullanım davranışları kesinlikle yasaktır.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">6. Sorumluluk Reddi</h2>
            <p className="mt-3 text-sm">
              Vera Real Estate, ilan içeriklerinin doğruluğunu garanti etmez. Hizmetin kesintisiz veya hatasız olacağına
              dair taahhüt verilmez. Dolaylı zararlar ve üçüncü taraf kaynaklı kesintiler için sorumluluk kabul edilmez.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">7. Sonlandırma</h2>
            <p className="mt-3 text-sm">
              Şartların ihlali, güvenlik riski veya yasal gereklilik durumunda; hesaplar geçici veya kalıcı olarak
              sınırlandırılabilir. Bu durum, hizmet güvenliğini sağlamak için uygulanabilir.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

