import Link from "next/link";
import {
  ArrowRight,
  Cookie,
  Database,
  Eye,
  FileCheck,
  Globe,
  Lock,
  Mail,
  Scale,
  Shield,
  ShieldCheck,
  Sparkles,
  Timer,
  UserCheck,
  Users,
} from "lucide-react";

const sections = [
  {
    num: "01",
    icon: FileCheck,
    title: "Amaç ve Kapsam",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    accent: "bg-blue-600",
    content:
      "Bu Gizlilik Politikası; Vera Real Estate web sitesi ve ilgili dijital kanallar üzerinden elde edilen kişisel verilerin işlenmesine ilişkin esasları açıklar. Bu metin, kullanıcıların veri işleme süreçlerini şeffaf biçimde anlamasına yardımcı olmak amacıyla hazırlanmıştır.",
  },
  {
    num: "02",
    icon: Users,
    title: "Veri Sorumlusu",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accent: "bg-emerald-600",
    content: "Bu politika kapsamında veri sorumlusu, Vera Real Estate'tir. İletişim için info@vera.com adresi üzerinden bize ulaşabilirsiniz.",
  },
  {
    num: "03",
    icon: Database,
    title: "Toplanan Veriler",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    accent: "bg-purple-600",
    subsections: [
      {
        title: "Doğrudan Sağlanan Veriler",
        text: "İletişim formu, bülten aboneliği ve hesap işlemleri sırasında; ad-soyad, e-posta, telefon, mesaj içeriği gibi bilgiler tarafınızca sağlanabilir.",
      },
      {
        title: "Otomatik Toplanan Veriler",
        text: "Site kullanımınıza ilişkin; IP adresi, tarayıcı türü, cihaz bilgisi, sayfa görüntüleme kayıtları ve benzeri teknik veriler güvenlik ve performans amaçlarıyla otomatik olarak kaydedilebilir.",
      },
    ],
  },
  {
    num: "04",
    icon: Cookie,
    title: "Çerezler (Cookies)",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    accent: "bg-amber-600",
    content:
      "Sitemiz; kullanıcı deneyimini geliştirmek ve güvenliği sağlamak için çerezleri kullanabilir. Çerez tercihleri tarayıcı ayarlarınız üzerinden yönetilebilir. Zorunlu çerezler kapatıldığında bazı özellikler sınırlı çalışabilir.",
  },
  {
    num: "05",
    icon: Eye,
    title: "İşleme Amaçları",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    accent: "bg-rose-600",
    content:
      "Kişisel veriler; taleplerinizi yanıtlamak, bülten aboneliğinizi yönetmek, hizmet kalitesini artırmak, dolandırıcılık girişimlerini önlemek, yasal yükümlülükleri yerine getirmek ve meşru menfaatlerimizi korumak amaçlarıyla işlenebilir.",
  },
  {
    num: "06",
    icon: Globe,
    title: "Üçüncü Taraf Paylaşımları",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    accent: "bg-indigo-600",
    content:
      "Verileriniz, hizmetin sağlanması için gerekli olması halinde; altyapı sağlayıcıları, barındırma hizmetleri, ölçümleme/analitik servisleri gibi üçüncü taraflarla, mevzuata uygun olarak sınırlı ölçüde paylaşılabilir.",
  },
  {
    num: "07",
    icon: Timer,
    title: "Saklama Süresi",
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    accent: "bg-slate-600",
    content:
      "Veriler, işleme amaçlarının gerektirdiği süre boyunca saklanır; amaç ortadan kalktığında yasal zorunluluklar çerçevesinde silinir, yok edilir veya anonim hale getirilir.",
  },
  {
    num: "08",
    icon: UserCheck,
    title: "Kullanıcı Hakları",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    accent: "bg-teal-600",
    content:
      "KVKK kapsamında; verilerinize erişim, düzeltme, silme/yok etme, işlemeye itiraz ve aktarımın sınırlandırılması gibi haklara sahipsiniz. Başvurularınızı info@vera.com adresi üzerinden iletebilirsiniz.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-12 pb-12">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-8 py-16 text-center shadow-2xl premium-ring">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-emerald-500/8 blur-2xl animate-float-delayed" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent backdrop-blur-sm">
            <Lock className="h-3.5 w-3.5" />
            Vera Real Estate
          </span>
          <h1 className="mt-5 text-4xl font-extrabold text-white md:text-5xl">
            Gizlilik{" "}
            <span className="text-gradient-gold">Politikası</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-300">
            Kişisel verilerinizin nasıl toplandığını, işlendiğini ve korunduğunu şeffaf biçimde açıklıyoruz.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Son Güncelleme: Mart 2026 · KVKK Uyumlu
          </p>
        </div>
      </section>

      {/* ── QUICK SUMMARY ── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Lock, title: "Verileriniz Güvende", desc: "End-to-end şifreleme ve güvenli depolama ile korunur.", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Scale, title: "KVKK Uyumlu", desc: "Tüm işlemler Türk veri koruma mevzuatına uygundur.", color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: Shield, title: "Şeffaf İşleme", desc: "Verilerinizin nasıl kullanıldığını her zaman bilebilirsiniz.", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm hover-lift-sm">
            <div className={`shrink-0 rounded-xl ${item.bg} p-3`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <div>
              <p className="font-bold text-foreground">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── SECTIONS ── */}
      <section className="space-y-4">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <div
              key={section.num}
              className={`group relative overflow-hidden rounded-2xl border ${section.border} bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg card-entrance`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`absolute left-0 top-0 h-full w-1 ${section.accent}`} />

              <div className="flex gap-4 p-6 pl-7">
                <div className={`shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl ${section.bg}`}>
                  <Icon className={`h-5 w-5 ${section.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-black tracking-widest ${section.color} opacity-50`}>
                      {section.num}
                    </span>
                    <h2 className="text-base font-bold text-slate-900">{section.title}</h2>
                  </div>

                  {section.content && (
                    <p className="text-sm leading-relaxed text-slate-600">{section.content}</p>
                  )}

                  {section.subsections && (
                    <div className="space-y-3 mt-1">
                      {section.subsections.map((sub) => (
                        <div key={sub.title} className="pl-3 border-l-2 border-slate-200">
                          <p className="text-sm font-semibold text-slate-800">{sub.title}</p>
                          <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{sub.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center premium-ring">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.18),transparent_65%)]" />
        <div className="relative mx-auto max-w-xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Gizlilik Haklarınız
          </span>
          <h2 className="text-2xl font-bold text-white">Veri Haklarınızı Kullanın</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            Kişisel verilerinize erişim, düzeltme veya silme talebiniz için ekibimizle iletişime geçin.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:brightness-110"
            >
              Başvuru Yap <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="mailto:info@vera.com"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-accent hover:bg-white/5 hover:text-accent"
            >
              <Mail className="h-4 w-4" />
              info@vera.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
