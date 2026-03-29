"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart2,
  Bell,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Crown,
  Eye,
  Globe2,
  HeartHandshake,
  Key,
  LayoutDashboard,
  Lock,
  Minus,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { getMyProperties } from "@/services/property.service";
import { Button } from "@/components/ui/button";

/* ─── Plan data ─── */
const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceLabel: "Ücretsiz",
    priceNote: "Sonsuza kadar",
    listingLimit: 3,
    icon: Zap,
    iconBg: "bg-slate-100",
    iconText: "text-slate-600",
    gradient: "from-slate-500 to-slate-700",
    badge: null,
    cardBorder: "border-slate-200",
    cardBg: "bg-white",
    popular: false,
    features: [
      { text: "3 ilan yayınlama hakkı", icon: Building2, color: "text-slate-500" },
      { text: "Standart görünürlük", icon: Eye, color: "text-slate-500" },
      { text: "Temel arama filtreleri", icon: LayoutDashboard, color: "text-slate-500" },
      { text: "E-posta desteği", icon: Bell, color: "text-slate-500" },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 299,
    priceLabel: "₺299",
    priceNote: "/ ay · KDV dahil",
    listingLimit: 7,
    icon: Star,
    iconBg: "bg-blue-600",
    iconText: "text-white",
    gradient: "from-blue-600 to-indigo-700",
    badge: "En Popüler",
    badgeGradient: "from-blue-600 to-indigo-600",
    cardBorder: "border-blue-300",
    cardBg: "bg-white",
    popular: true,
    features: [
      { text: "7 ilan yayınlama hakkı", icon: Building2, color: "text-blue-600" },
      { text: "Öne çıkarılmış ilan seçeneği", icon: Star, color: "text-blue-600" },
      { text: "Gelişmiş arama filtreleri", icon: LayoutDashboard, color: "text-blue-600" },
      { text: "Öncelikli e-posta desteği", icon: Bell, color: "text-blue-600" },
      { text: "İlan görüntülenme istatistikleri", icon: BarChart2, color: "text-blue-600" },
      { text: "Özel profil rozeti", icon: Shield, color: "text-blue-600" },
    ],
  },
  {
    id: "corporate",
    name: "Corporate",
    price: 799,
    priceLabel: "₺799",
    priceNote: "/ ay · KDV dahil",
    listingLimit: null,
    icon: Crown,
    iconBg: "from-amber-400 to-orange-500",
    iconGradient: true,
    iconText: "text-white",
    gradient: "from-amber-500 to-orange-600",
    badge: "En Kapsamlı",
    badgeGradient: "from-amber-500 to-orange-500",
    cardBorder: "border-amber-300",
    cardBg: "bg-gradient-to-b from-amber-50/60 to-white",
    popular: false,
    features: [
      { text: "Sınırsız ilan yayınlama", icon: Building2, color: "text-amber-600" },
      { text: "Premium ilan görünürlüğü", icon: TrendingUp, color: "text-amber-600" },
      { text: "Tüm gelişmiş filtreler", icon: LayoutDashboard, color: "text-amber-600" },
      { text: "7/24 öncelikli destek", icon: Phone, color: "text-amber-600" },
      { text: "Detaylı analitik raporlar", icon: BarChart2, color: "text-amber-600" },
      { text: "Kurumsal profil rozeti", icon: Shield, color: "text-amber-600" },
      { text: "API erişimi", icon: Key, color: "text-amber-600" },
      { text: "Özel müşteri temsilcisi", icon: HeartHandshake, color: "text-amber-600" },
    ],
  },
];

/* ─── Feature comparison table rows ─── */
const COMPARISON_ROWS = [
  { label: "İlan Hakkı", free: "3", professional: "7", corporate: "Sınırsız" },
  { label: "Öne Çıkarma", free: false, professional: true, corporate: true },
  { label: "İlan İstatistikleri", free: false, professional: true, corporate: true },
  { label: "Gelişmiş Filtreler", free: false, professional: true, corporate: true },
  { label: "E-posta Desteği", free: "Standart", professional: "Öncelikli", corporate: "7/24" },
  { label: "Profil Rozeti", free: false, professional: true, corporate: "Kurumsal" },
  { label: "Analitik Raporlar", free: false, professional: "Temel", corporate: "Detaylı" },
  { label: "API Erişimi", free: false, professional: false, corporate: true },
  { label: "Özel Temsilci", free: false, professional: false, corporate: true },
];

/* ─── FAQ ─── */
const FAQS = [
  {
    q: "Gerçek ödeme alınıyor mu?",
    a: "Hayır. Bu platform tamamen demo amaçlıdır. Kart bilgileri işlenmez ve gerçek ödeme alınmaz. Abonelik sistemi işlevselliği test etmek için tasarlanmıştır.",
  },
  {
    q: "Planımı istediğim zaman değiştirebilir miyim?",
    a: "Evet. İstediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Değişiklik anında geçerli olur.",
  },
  {
    q: "Aylık aboneliği iptal edebilir miyim?",
    a: "Evet. Herhangi bir zamanda ücretsiz plana geçerek aboneliğinizi sonlandırabilirsiniz. Kalan süre için iade yapılmaz.",
  },
  {
    q: "Corporate ve Professional planı arasındaki fark nedir?",
    a: "Professional planı 7 ilan hakkı, temel istatistikler ve öncelikli destek sunar. Corporate; sınırsız ilan, API erişimi, detaylı analitik ve özel müşteri temsilcisi içerir.",
  },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-200 hover:border-accent/30">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-foreground text-sm">{faq.q}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-accent" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        )}
      </button>
      {open && (
        <div className="border-t border-border/40 px-5 py-4">
          <p className="text-sm leading-relaxed text-slate-500">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

function ComparisonCell({ value }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-emerald-500" />;
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-slate-300" />;
  return <span className="text-xs font-semibold text-foreground">{value}</span>;
}

export default function UpgradePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const currentPlan = user?.subscription?.plan || "free";

  const { data: myPropsData } = useQuery({
    queryKey: ["my-properties-upgrade"],
    queryFn: () => getMyProperties({ page: 1, limit: 1, includeInactive: 1 }),
    staleTime: 30_000,
  });
  const usedCount = myPropsData?.pagination?.total ?? 0;

  function handleUpgrade(planId) {
    if (planId === "free" || planId === currentPlan) return;
    router.push(`/upgrade/checkout?plan=${planId}`);
  }

  return (
    <div className="space-y-12 pb-8">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-8 py-14 text-white shadow-2xl md:px-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-48 w-48 rounded-full bg-blue-500/8 blur-2xl animate-float-delayed" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

        <div className="relative text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Abonelik Planları
          </span>
          <h1 className="mt-5 text-4xl font-extrabold md:text-5xl">
            Planınızı{" "}
            <span className="gradient-text-shimmer">Yükseltin</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300">
            İhtiyacınıza en uygun planı seçin. Daha fazla ilan yayınlayın, öne çıkarın ve premium analizlere erişin.
          </p>

          {/* Social proof strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {[
              { icon: Users, text: "500+ Aktif Kullanıcı" },
              { icon: Building2, text: "2.400+ İlan" },
              { icon: ShieldCheck, text: "Güvenli & İptal Edilebilir" },
              { icon: Globe2, text: "Türkiye Geneli" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur-sm">
                <Icon className="h-3.5 w-3.5 text-accent" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLAN CARDS ── */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PLANS.map((plan, i) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.id;
          const planLimit = plan.listingLimit;
          const usedPct = planLimit ? Math.min(100, Math.round((usedCount / planLimit) * 100)) : 0;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl card-entrance ${plan.cardBorder} ${plan.cardBg} ${plan.popular ? "ring-2 ring-blue-400/60 shadow-xl" : "shadow-sm"}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Badge */}
              {plan.badge && (
                <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r ${plan.badgeGradient} px-4 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-lg`}>
                  {plan.badge}
                </span>
              )}

              {/* Header */}
              <div className="mb-5 flex items-center gap-3">
                <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-md ${plan.iconGradient ? `bg-gradient-to-br ${plan.iconBg}` : plan.iconBg}`}>
                  <Icon className={`h-6 w-6 ${plan.iconText}`} />
                </span>
                <div>
                  <p className="text-xl font-extrabold text-foreground">{plan.name}</p>
                  <p className="text-xs font-semibold text-slate-500">
                    {plan.listingLimit ? `${plan.listingLimit} ilan hakkı` : "Sınırsız ilan"}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-5 pb-5 border-b border-border/60">
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-extrabold tabular-nums text-foreground">{plan.priceLabel}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{plan.priceNote}</p>

                {/* Usage bar for current plan */}
                {isCurrent && planLimit && (
                  <div className="mt-3">
                    <div className="mb-1.5 flex justify-between text-xs text-slate-500">
                      <span>Kullanım</span>
                      <span className="font-semibold">{usedCount}/{planLimit}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${usedPct >= 100 ? "bg-red-500" : usedPct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${usedPct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="mb-7 flex-1 space-y-2.5">
                {plan.features.map(({ text, icon: FIcon, color }) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <FIcon className={`h-4 w-4 shrink-0 ${color}`} />
                    {text}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <div className="flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-sm font-bold text-emerald-700">
                  <Check className="h-4 w-4" />
                  Mevcut Planınız
                </div>
              ) : plan.id === "free" ? (
                <button
                  type="button"
                  onClick={() => handleUpgrade("free")}
                  className="flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
                >
                  Ücretsiz Devam Et
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleUpgrade(plan.id)}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${plan.gradient} text-sm font-extrabold text-white shadow-lg transition hover:brightness-105 hover:-translate-y-0.5`}
                >
                  <Sparkles className="h-4 w-4" />
                  {plan.name}&apos;e Geç →
                </button>
              )}
            </div>
          );
        })}
      </section>

      {/* ── FEATURE COMPARISON TABLE ── */}
      <section>
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Detaylı Karşılaştırma</p>
          <h2 className="mt-1.5 text-2xl font-bold text-foreground">Plan Özellikleri</h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-border/60 bg-slate-50/80">
                  <th className="py-4 pl-5 pr-3 text-left text-xs font-bold uppercase tracking-widest text-slate-500 w-2/5">
                    Özellik
                  </th>
                  {PLANS.map((plan) => {
                    const Icon = plan.icon;
                    return (
                      <th key={plan.id} className="px-3 py-4 text-center text-sm font-bold text-foreground w-1/5">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${plan.iconGradient ? `bg-gradient-to-br ${plan.iconBg}` : plan.iconBg}`}>
                            <Icon className={`h-4 w-4 ${plan.iconText}`} />
                          </span>
                          {plan.name}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b border-border/40 last:border-0 transition-colors hover:bg-slate-50/50 ${i % 2 === 0 ? "" : "bg-slate-50/30"}`}
                  >
                    <td className="py-3.5 pl-5 pr-3 text-sm font-medium text-foreground">{row.label}</td>
                    <td className="px-3 py-3.5 text-center"><ComparisonCell value={row.free} /></td>
                    <td className="px-3 py-3.5 text-center"><ComparisonCell value={row.professional} /></td>
                    <td className="px-3 py-3.5 text-center"><ComparisonCell value={row.corporate} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section>
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Sık Sorulan Sorular</p>
          <h2 className="mt-1.5 text-2xl font-bold text-foreground">Merak Ettikleriniz</h2>
        </div>
        <div className="mx-auto max-w-2xl space-y-2.5">
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} faq={faq} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center premium-ring">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.18),transparent_65%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        <div className="relative mx-auto max-w-xl space-y-4">
          <Crown className="mx-auto h-12 w-12 text-accent opacity-80" />
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Premium ile Farkı Yaşayın
          </h2>
          <p className="text-sm leading-relaxed text-slate-400">
            Hâlâ karar veremediniz mi? İlk ay ücretsiz deneyimleyin. Taahhüt yok, istediğiniz zaman iptal.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button
              onClick={() => router.push("/upgrade/checkout?plan=professional")}
              className="gap-2 rounded-xl bg-gold-gradient px-8 py-3 text-base font-bold text-slate-900 shadow-lg hover:brightness-110 hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              Professional&apos;a Başla
            </Button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3 text-base font-semibold text-white transition hover:border-accent hover:bg-white/5 hover:text-accent"
            >
              Bizimle İletişime Geç
            </Link>
          </div>
          <p className="text-xs text-slate-500">Demo platform — gerçek ödeme alınmaz.</p>
        </div>
      </section>
    </div>
  );
}
