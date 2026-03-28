"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Crown,
  Loader2,
  Lock,
  Shield,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { upgradePlan } from "@/services/admin.service";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PLAN_INFO = {
  professional: {
    name: "Professional",
    price: "₺299,00",
    period: "/ay",
    icon: Star,
    color: "from-blue-600 to-indigo-600",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    bgColor: "bg-blue-50",
  },
  corporate: {
    name: "Corporate",
    price: "₺799,00",
    period: "/ay",
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    bgColor: "bg-amber-50",
  },
};

function formatCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "professional";
  const plan = PLAN_INFO[planId] || PLAN_INFO.professional;
  const Icon = plan.icon;
  const { refreshMe } = useAuthStore();

  const [flipped, setFlipped] = useState(false);
  const [form, setForm] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  });

  const mutation = useMutation({
    mutationFn: () => upgradePlan(planId),
    onSuccess: async () => {
      await refreshMe();
      router.push(`/upgrade/success?plan=${planId}`);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Ödeme işlemi başarısız oldu");
    },
  });

  function handleChange(field, rawValue) {
    let value = rawValue;
    if (field === "cardNumber") value = formatCardNumber(rawValue);
    if (field === "expiry") value = formatExpiry(rawValue);
    if (field === "cvc") value = rawValue.replace(/\D/g, "").slice(0, 3);
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const digits = form.cardNumber.replace(/\s/g, "");
    if (digits.length < 16) { toast.error("Geçerli bir kart numarası girin"); return; }
    if (!form.cardName.trim()) { toast.error("Kart üzerindeki ismi girin"); return; }
    if (form.expiry.length < 5) { toast.error("Son kullanma tarihi girin (AA/YY)"); return; }
    if (form.cvc.length < 3) { toast.error("CVC kodunu girin"); return; }
    mutation.mutate();
  }

  const maskedCardNumber = form.cardNumber
    ? form.cardNumber.split(" ").map((g, i) => (i < 3 ? "****" : g)).join(" ")
    : "**** **** **** ****";

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back */}
      <div className="mb-6">
        <Link
          href="/upgrade"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Planlara Dön
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Plan summary + card visual */}
        <div className="space-y-6">
          {/* Plan summary */}
          <div className={`rounded-2xl border ${plan.borderColor} ${plan.bgColor} p-5`}>
            <div className="flex items-center gap-3">
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.color} shadow-md`}>
                <Icon className="h-5 w-5 text-white" />
              </span>
              <div>
                <p className="text-lg font-extrabold text-slate-900">{plan.name} Plan</p>
                <p className={`text-2xl font-extrabold tabular-nums ${plan.textColor}`}>
                  {plan.price}<span className="text-sm font-semibold text-slate-400">{plan.period}</span>
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-slate-600">
              {[
                "Hemen aktif olur",
                "30 günlük erişim",
                "İstediğiniz zaman iptal",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* 3D Card Flip Visual */}
          <div
            className="relative h-48 cursor-pointer"
            style={{ perspective: "1000px" }}
            onMouseEnter={() => setFlipped(true)}
            onMouseLeave={() => setFlipped(false)}
          >
            <div
              className="relative h-full w-full transition-all duration-700"
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-5 text-white shadow-2xl"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Vera Premium
                  </span>
                  <CreditCard className="h-8 w-8 text-amber-400" />
                </div>
                <div className="mt-6 text-lg font-mono font-bold tracking-widest text-slate-300">
                  {form.cardNumber || "**** **** **** ****"}
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">Kart Sahibi</p>
                    <p className="text-sm font-semibold text-white uppercase tracking-wide">
                      {form.cardName || "AD SOYAD"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">Son Tarih</p>
                    <p className="text-sm font-semibold text-white">
                      {form.expiry || "AA/YY"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-2xl"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="mt-6 h-10 bg-slate-600" />
                <div className="mt-4 flex items-center justify-end px-5">
                  <div className="flex h-8 w-24 items-center justify-end rounded bg-slate-200 px-2">
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {form.cvc || "***"}
                    </span>
                  </div>
                  <p className="ml-3 text-[10px] text-slate-400">CVC</p>
                </div>
                <div className="mt-6 px-5 text-center text-[10px] text-slate-500">
                  Bu kart demo amaçlıdır. Gerçek ödeme alınmaz.
                </div>
              </div>
            </div>
          </div>

          {/* Security badges */}
          <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              SSL Şifreli
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Güvenli Ödeme
            </div>
          </div>
        </div>

        {/* Right: Payment form */}
        <div>
          <h2 className="mb-5 text-xl font-extrabold text-slate-900">Ödeme Bilgileri</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Kart Numarası
              </label>
              <div className="relative">
                <Input
                  placeholder="0000 0000 0000 0000"
                  value={form.cardNumber}
                  onChange={(e) => handleChange("cardNumber", e.target.value)}
                  inputMode="numeric"
                  className="pr-10 font-mono"
                />
                <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Kart Üzerindeki İsim
              </label>
              <Input
                placeholder="AD SOYAD"
                value={form.cardName}
                onChange={(e) => handleChange("cardName", e.target.value.toUpperCase())}
                className="uppercase tracking-wide"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Son Kullanma
                </label>
                <Input
                  placeholder="AA/YY"
                  value={form.expiry}
                  onChange={(e) => handleChange("expiry", e.target.value)}
                  inputMode="numeric"
                  className="font-mono"
                  onFocus={() => setFlipped(false)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  CVC
                </label>
                <Input
                  placeholder="***"
                  value={form.cvc}
                  onChange={(e) => handleChange("cvc", e.target.value)}
                  inputMode="numeric"
                  className="font-mono tracking-widest"
                  onFocus={() => setFlipped(true)}
                  onBlur={() => setFlipped(false)}
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className={`mt-2 h-12 w-full rounded-2xl bg-gradient-to-r ${plan.color} text-base font-extrabold text-white shadow-lg transition hover:brightness-105 hover:-translate-y-0.5`}
            >
              {mutation.isPending ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" />İşleniyor...</>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  {plan.price} Öde — {plan.name}
                </>
              )}
            </Button>

            <p className="text-center text-xs text-slate-400">
              Demo sistem — gerçek ödeme alınmaz. Kart bilgileri işlenmez.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
