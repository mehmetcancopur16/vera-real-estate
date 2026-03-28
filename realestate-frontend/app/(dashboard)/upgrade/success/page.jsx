"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Crown,
  Loader2,
  Sparkles,
  Star,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";

const PLAN_INFO = {
  professional: {
    name: "Professional",
    limit: "7 ilan",
    icon: Star,
    color: "from-blue-600 to-indigo-600",
    ringColor: "ring-blue-200",
    badgeBg: "bg-blue-50 border-blue-200 text-blue-700",
    confettiColors: ["#3b82f6", "#6366f1", "#8b5cf6"],
  },
  corporate: {
    name: "Corporate",
    limit: "Sınırsız ilan",
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    ringColor: "ring-amber-200",
    badgeBg: "bg-amber-50 border-amber-200 text-amber-700",
    confettiColors: ["#f59e0b", "#f97316", "#eab308"],
  },
};

function ConfettiPiece({ color, style }) {
  return (
    <div
      className="absolute h-2 w-1.5 rounded-sm opacity-0"
      style={{
        backgroundColor: color,
        animation: "confettiFall 1.8s ease-out forwards",
        ...style,
      }}
    />
  );
}

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "professional";
  const plan = PLAN_INFO[planId] || PLAN_INFO.professional;
  const Icon = plan.icon;
  const { user } = useAuthStore();

  const [confetti, setConfetti] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const pieces = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      color: plan.confettiColors[i % plan.confettiColors.length],
      left: `${Math.random() * 90 + 5}%`,
      delay: `${Math.random() * 0.8}s`,
      rotate: `${Math.random() * 360}deg`,
    }));
    setConfetti(pieces);
  }, []);

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-60px) rotate(0deg); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(240px) rotate(360deg); opacity: 0; }
        }
        @keyframes successPop {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <div className="relative mx-auto max-w-lg overflow-hidden py-8">
        {/* Confetti */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {confetti.map((p) => (
            <ConfettiPiece
              key={p.id}
              color={p.color}
              style={{ left: p.left, top: "-8px", animationDelay: p.delay, transform: `rotate(${p.rotate})` }}
            />
          ))}
        </div>

        <div className="relative flex flex-col items-center text-center">
          {/* Success icon */}
          <div
            className={`mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${plan.color} ring-8 ${plan.ringColor} shadow-2xl`}
            style={{ animation: mounted ? "successPop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none", opacity: 0 }}
          >
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>

          {/* Main message */}
          <div style={{ animation: mounted ? "fadeSlideUp 0.5s 0.3s ease-out forwards" : "none", opacity: 0 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1 text-sm font-bold text-green-700 mb-4">
              <Sparkles className="h-4 w-4" />
              Ödeme Başarılı
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Tebrikler!
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              {plan.name} planına başarıyla yükseltildiniz.
            </p>
          </div>

          {/* Plan card */}
          <div
            className={`mt-6 w-full rounded-2xl border ${plan.badgeBg} p-5`}
            style={{ animation: mounted ? "fadeSlideUp 0.5s 0.5s ease-out forwards" : "none", opacity: 0 }}
          >
            <div className="flex items-center gap-3">
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.color} shadow-md`}>
                <Icon className="h-5 w-5 text-white" />
              </span>
              <div className="text-left">
                <p className="text-lg font-extrabold text-slate-900">{plan.name} Plan</p>
                <p className="text-sm text-slate-500">{plan.limit} yayınlama hakkı · 30 gün geçerli</p>
              </div>
            </div>

            {user && (
              <div className="mt-4 border-t border-current/10 pt-3">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">{user.name}</span> hesabınız güncellendi.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div
            className="mt-8 flex w-full flex-col gap-3"
            style={{ animation: mounted ? "fadeSlideUp 0.5s 0.7s ease-out forwards" : "none", opacity: 0 }}
          >
            <Button asChild className={`h-12 rounded-2xl bg-gradient-to-r ${plan.color} text-base font-extrabold text-white shadow-lg hover:brightness-105`}>
              <Link href="/add-listing">
                Hemen İlan Oluştur
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-2xl font-semibold">
              <Link href="/my-listings">
                Panele Dön
              </Link>
            </Button>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Demo sistemi — gerçek ödeme alınmamıştır.
          </p>
        </div>
      </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
