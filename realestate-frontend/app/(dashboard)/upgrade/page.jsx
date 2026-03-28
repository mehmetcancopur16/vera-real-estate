"use client";

import { useRouter } from "next/navigation";
import {
  Check,
  Crown,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    id: "free",
    name: "Free",
    priceLabel: "Ücretsiz",
    listingLimit: "3 ilan",
    icon: Zap,
    iconClass: "bg-slate-100 text-slate-600",
    badge: null,
    cardClass: "border-slate-200 bg-white",
    btnClass: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    features: [
      "3 ilan yayınlama hakkı",
      "Standart ilan görünürlüğü",
      "Temel arama filtreleri",
      "E-posta desteği",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    priceLabel: "₺299 / ay",
    listingLimit: "7 ilan",
    icon: Star,
    iconClass: "bg-blue-600 text-white",
    badge: "Popüler",
    cardClass: "border-blue-200 bg-gradient-to-b from-blue-50 to-white ring-2 ring-blue-200 shadow-xl",
    btnClass: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    features: [
      "7 ilan yayınlama hakkı",
      "Öne çıkarılmış ilan seçeneği",
      "Gelişmiş arama filtreleri",
      "Öncelikli e-posta desteği",
      "İlan istatistikleri",
      "Özel profil rozeti",
    ],
  },
  {
    id: "corporate",
    name: "Corporate",
    priceLabel: "₺799 / ay",
    listingLimit: "Sınırsız",
    icon: Crown,
    iconClass: "bg-gradient-to-br from-amber-400 to-orange-500 text-white",
    badge: "En Kapsamlı",
    cardClass: "border-amber-200 bg-gradient-to-b from-amber-50 to-white ring-2 ring-amber-200 shadow-xl",
    btnClass: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:brightness-105 shadow-md",
    features: [
      "Sınırsız ilan yayınlama",
      "Premium ilan görünürlüğü",
      "Tüm gelişmiş filtreler",
      "7/24 öncelikli destek",
      "Detaylı analitik raporlar",
      "Kurumsal profil rozeti",
      "API erişimi",
      "Özel müşteri temsilcisi",
    ],
  },
];

export default function UpgradePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const currentPlan = user?.subscription?.plan || "free";

  function handleUpgrade(planId) {
    if (planId === "free") return;
    router.push(`/upgrade/checkout?plan=${planId}`);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700 mb-4">
          <Sparkles className="h-4 w-4" />
          Abonelik Planları
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Planınızı Yükseltin
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          İhtiyacınıza uygun planı seçin, daha fazla ilan yayınlayın ve premium özelliklere erişin.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border p-6 transition hover:-translate-y-0.5 ${plan.cardClass}`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-0.5 text-[11px] font-black uppercase tracking-wide text-white shadow-md">
                  {plan.badge}
                </span>
              )}

              {/* Plan header */}
              <div className="mb-4 flex items-center gap-3">
                <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm ${plan.iconClass}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-extrabold text-slate-900">{plan.name}</p>
                  <p className="text-xs font-semibold text-slate-500">{plan.listingLimit}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-5">
                <p className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  {plan.priceLabel}
                </p>
                {plan.id !== "free" && (
                  <p className="text-xs text-slate-400 mt-0.5">KDV dahil · İptal edilebilir</p>
                )}
              </div>

              {/* Features */}
              <ul className="mb-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <div className="flex h-11 items-center justify-center rounded-2xl border border-green-200 bg-green-50 text-sm font-bold text-green-700">
                  Mevcut Planınız
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleUpgrade(plan.id)}
                  className={`flex h-11 w-full items-center justify-center rounded-2xl text-sm font-extrabold transition ${plan.btnClass}`}
                  disabled={plan.id === "free"}
                >
                  {plan.id === "free" ? "Ücretsiz" : "Yükselt →"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Note */}
      <p className="text-center text-xs text-slate-400">
        Bu platformda gerçek ödeme işlemi yapılmamaktadır. Abonelik sistemi demo amaçlıdır.
      </p>
    </div>
  );
}
