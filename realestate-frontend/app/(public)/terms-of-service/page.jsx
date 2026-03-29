import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Lock,
  Mail,
  Scale,
  Shield,
  ShieldCheck,
  Sparkles,
  UserCheck,
  XCircle,
  Zap,
} from "lucide-react";

const sections = [
  {
    num: "01",
    icon: BookOpen,
    title: "Genel Hükümler",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    accent: "bg-blue-600",
    content:
      "Bu Kullanım Şartları, Vera Real Estate web sitesini ziyaret eden ve/veya hizmetlerinden yararlanan tüm kullanıcılar için geçerlidir. Siteyi kullanmanız, bu şartları kabul ettiğiniz anlamına gelir. Şartları kabul etmiyorsanız platforma erişimden kaçınmanızı öneririz.",
  },
  {
    num: "02",
    icon: Zap,
    title: "Hizmet Tanımı",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accent: "bg-emerald-600",
    content:
      "Vera Real Estate; gayrimenkul ilanlarının görüntülenmesi, filtreleme, iletişim taleplerinin alınması ve bülten aboneliği gibi özellikler sunar. Hizmet kapsamı zaman içinde güncellenebilir. Tüm özellikler önceden bildirim yapılmaksızın değiştirilebilir veya kaldırılabilir.",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Fikri Mülkiyet",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    accent: "bg-purple-600",
    content:
      "Site içeriği, tasarım unsurları, metinler ve arayüz bileşenleri dahil olmak üzere; ilgili mevzuat kapsamında korunur. İzinsiz kopyalama, çoğaltma, yeniden yayınlama ve ticari kullanım yasaktır. Tüm haklar Vera Real Estate'e aittir.",
  },
  {
    num: "04",
    icon: FileText,
    title: "İlan Kuralları",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    accent: "bg-amber-600",
    subsections: [
      {
        title: "Doğruluk ve Güncellik",
        text: "İlan içeriklerinin doğruluğu, güncelliği ve mevzuata uygunluğu ilan sahibi/kullanıcı sorumluluğundadır. Yanıltıcı veya eksik içerikler tespit edildiğinde ilanlar kısıtlanabilir veya kaldırılabilir.",
      },
      {
        title: "Yasaklı İçerikler",
        text: "Hukuka aykırı, yanıltıcı, hak ihlali içeren veya üçüncü kişilerin kişisel verilerini izinsiz paylaşan içerikler yayınlanamaz.",
      },
    ],
  },
  {
    num: "05",
    icon: XCircle,
    title: "Yasaklı Kullanım",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    accent: "bg-red-600",
    content:
      "Sisteme yetkisiz erişim girişimleri, otomasyon/bot ile veri toplama, hizmeti engellemeye yönelik eylemler, kullanıcıları yanıltma ve benzeri kötüye kullanım davranışları kesinlikle yasaktır.",
  },
  {
    num: "06",
    icon: Scale,
    title: "Sorumluluk Reddi",
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    accent: "bg-slate-600",
    content:
      "Vera Real Estate, ilan içeriklerinin doğruluğunu garanti etmez. Hizmetin kesintisiz veya hatasız olacağına dair taahhüt verilmez. Dolaylı zararlar ve üçüncü taraf kaynaklı kesintiler için sorumluluk kabul edilmez.",
  },
  {
    num: "07",
    icon: UserCheck,
    title: "Sonlandırma",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    accent: "bg-indigo-600",
    content:
      "Şartların ihlali, güvenlik riski veya yasal gereklilik durumunda; hesaplar geçici veya kalıcı olarak sınırlandırılabilir. Bu durum, hizmet güvenliğini sağlamak için uygulanabilir.",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="space-y-12 pb-12">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-8 py-16 text-center shadow-2xl premium-ring">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-blue-500/8 blur-2xl animate-float-delayed" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent backdrop-blur-sm">
            <Shield className="h-3.5 w-3.5" />
            Vera Real Estate
          </span>
          <h1 className="mt-5 text-4xl font-extrabold text-white md:text-5xl">
            Kullanım{" "}
            <span className="text-gradient-gold">Şartları</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-300">
            Vera Real Estate platformunu kullanmadan önce bu şartları dikkatle okuyunuz.
            Platforma erişiminiz bu şartları kabul ettiğiniz anlamına gelir.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs text-slate-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Son Güncelleme: Mart 2026
          </p>
        </div>
      </section>

      {/* ── QUICK SUMMARY ── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, title: "Güvenli Platform", desc: "Tüm verileriniz KVKK uyumlu şekilde korunur.", color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: FileText, title: "Şeffaf Kurallar", desc: "Tüm hizmet koşulları açık ve anlaşılır biçimde belirtilmiştir.", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Lock, title: "Hesap Güvenliği", desc: "Hesabınızın güvenliğinden siz sorumlusunuz.", color: "text-purple-600", bg: "bg-purple-50" },
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
              {/* Left accent bar */}
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
            Sorularınız mı var?
          </span>
          <h2 className="text-2xl font-bold text-white">Daha Fazla Bilgi Alın</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            Kullanım şartları hakkında sorularınız için iletişim ekibimize ulaşabilirsiniz.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:brightness-110"
            >
              Bize Ulaşın <ArrowRight className="h-4 w-4" />
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
