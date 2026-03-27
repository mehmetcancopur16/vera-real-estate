import PropertyForm from "@/components/forms/PropertyForm";
import {
  Building2,
  Camera,
  CheckCircle2,
  FileText,
  Home,
  Lightbulb,
  MapPin,
  Sparkles,
  Timer,
} from "lucide-react";

const STEPS_INFO = [
  {
    icon: FileText,
    label: "Temel Bilgiler",
    desc: "Başlık, açıklama, ilan tipi",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    icon: MapPin,
    label: "Konum & Fiyat",
    desc: "Adres ve fiyatlandırma",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  {
    icon: Building2,
    label: "Özellikler",
    desc: "Tüm teknik detaylar",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  {
    icon: Camera,
    label: "Görseller",
    desc: "Fotoğraf yükleme",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
];

export default function AddListingPage() {
  return (
    <section className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-7 text-white shadow-2xl">

        {/* Animated background orbs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl animate-float-delayed" />
        <div className="pointer-events-none absolute right-1/3 top-0 h-48 w-48 rounded-full bg-violet-500/10 blur-2xl" />

        {/* Top glow line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          {/* Left: title */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-accent" />
              Vera Listing Studio
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
              Yeni İlan{" "}
              <span className="text-gradient-gold">Ekle</span>
            </h1>
            <p className="mt-2 text-sm text-white/70 leading-relaxed">
              4 adımlı sihirbaz ile ilanınızı profesyonel şekilde oluşturun. Temel bilgilerden fotoğraflara kadar tüm detayları eksiksiz doldurun.
            </p>

            {/* Quick stats row */}
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs backdrop-blur-sm">
                <Timer className="h-3.5 w-3.5 text-accent" />
                <span className="font-semibold text-white/90">~3 dakika</span>
                <span className="text-white/50">tahmini süre</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs backdrop-blur-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                <span className="font-semibold text-white/90">4 adım</span>
                <span className="text-white/50">basit süreç</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs backdrop-blur-sm">
                <Camera className="h-3.5 w-3.5 text-blue-400" />
                <span className="font-semibold text-white/90">12 görsel</span>
                <span className="text-white/50">max yükleme</span>
              </div>
            </div>
          </div>

          {/* Right: step cards */}
          <div className="hidden shrink-0 md:block">
            <div className="grid grid-cols-2 gap-2.5">
              {STEPS_INFO.map(({ icon: Icon, label, desc, color }, i) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 backdrop-blur-sm transition hover:bg-white/10"
                >
                  <div
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-md",
                      color,
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/90">
                      <span className="mr-1 text-accent">{i + 1}.</span>
                      {label}
                    </p>
                    <p className="text-[10px] text-white/50">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Step progress visualization (mobile) ── */}
      <div className="flex items-center gap-0 overflow-x-auto md:hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {STEPS_INFO.map(({ icon: Icon, label, color }, i) => (
          <div key={label} className="flex flex-1 min-w-0 items-center">
            <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
              <div
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br shadow text-white text-xs font-bold",
                  color,
                ].join(" ")}
              >
                {i + 1}
              </div>
              <p className="text-[10px] font-semibold text-slate-600 text-center leading-tight truncate w-full px-1">
                {label}
              </p>
            </div>
            {i < STEPS_INFO.length - 1 && (
              <div className="h-0.5 w-6 shrink-0 bg-gradient-to-r from-slate-200 to-slate-300 mx-0.5" />
            )}
          </div>
        ))}
      </div>

      {/* ── Info bar ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow">
          <Lightbulb className="h-4 w-4 text-white" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-amber-800">Bilgi</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Yıldızlı (<span className="text-red-500 font-bold">*</span>) alanlar zorunludur.
            İlanınız yayınlandıktan sonra{" "}
            <strong className="text-amber-900">İlanlarım</strong> sayfasından düzenleyebilirsiniz.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-3 py-1.5 text-[11px] font-bold text-amber-700 shrink-0">
          <Timer className="h-3 w-3" />
          ~3 dakika
        </span>
      </div>

      {/* ── Form card ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl ring-2 ring-accent/10">
        {/* Subtle top accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-accent via-amber-400 to-orange-400" />
        <div className="p-1">
          <PropertyForm />
        </div>
      </div>
    </section>
  );
}
