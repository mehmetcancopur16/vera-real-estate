import PropertyForm from "@/components/forms/PropertyForm";
import { Building2, Camera, FileText, Home, MapPin } from "lucide-react";

const STEPS_INFO = [
  { icon: FileText, label: "Temel Bilgiler",  desc: "Başlık, açıklama, ilan tipi" },
  { icon: MapPin,   label: "Konum & Fiyat",   desc: "Adres ve fiyatlandırma" },
  { icon: Building2,label: "Özellikler",      desc: "Tüm teknik detaylar" },
  { icon: Camera,   label: "Görseller",       desc: "Fotoğraf yükleme" },
];

export default function AddListingPage() {
  return (
    <section className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-7 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
              <Home className="h-3 w-3 text-accent" />
              Vera Listing Studio
            </div>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              Yeni İlan <span className="text-accent">Ekle</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              4 adımlı sihirbaz ile ilanınızı profesyonel şekilde oluşturun. Temel bilgilerden fotoğraflara kadar tüm detayları eksiksiz doldurun.
            </p>
          </div>
          {/* step summary */}
          <div className="hidden shrink-0 md:block">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {STEPS_INFO.map(({ icon: Icon, label, desc }, i) => (
                <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                    <Icon className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-white/90">{i + 1}. {label}</p>
                    <p className="text-white/50">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200/50 bg-amber-50/60 px-4 py-3 text-xs font-medium text-amber-700">
        <span className="text-base">💡</span>
        <span>Yıldızlı alanlar zorunludur. İlanınız yayınlandıktan sonra <strong>İlanlarım</strong> sayfasından düzenleyebilirsiniz.</span>
        <span className="ml-auto text-amber-500">Tahmini süre: ~3 dakika</span>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-border/60 bg-card p-1 shadow-sm">
        <PropertyForm />
      </div>
    </section>
  );
}
