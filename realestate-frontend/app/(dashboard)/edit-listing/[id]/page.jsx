"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Camera,
  Edit3,
  FileText,
  Lightbulb,
  Loader2,
  MapPin,
  Sparkles,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PropertyForm from "@/components/forms/PropertyForm";
import { getPropertyById } from "@/services/property.service";

const STEPS_INFO = [
  {
    icon: FileText,
    label: "Temel Bilgiler",
    desc: "Başlık, açıklama, ilan tipi",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: MapPin,
    label: "Konum & Fiyat",
    desc: "Adres ve fiyatlandırma",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Building2,
    label: "Özellikler",
    desc: "Tüm teknik detaylar",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Camera,
    label: "Görseller",
    desc: "Fotoğraf güncelleme",
    color: "from-amber-500 to-orange-500",
  },
];

export default function EditListingPage() {
  const params = useParams();
  const id = params?.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getPropertyById(id),
    enabled: Boolean(id),
  });

  const property = data?.data;

  if (isLoading) {
    return (
      <section className="space-y-6 animate-in fade-in-0 duration-500">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-7 shadow-2xl">
          <div className="space-y-3">
            <div className="h-5 w-40 rounded-full bg-white/10 animate-pulse" />
            <div className="h-9 w-72 rounded-xl bg-white/10 animate-pulse" />
            <div className="h-4 w-96 rounded-lg bg-white/10 animate-pulse" />
          </div>
        </div>
        <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white py-24 shadow-sm">
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
            <p className="font-semibold text-slate-700">İlan yükleniyor...</p>
            <p className="text-sm text-slate-400">Lütfen bekleyin</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !property) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-red-200 bg-red-50 p-10 text-center animate-in fade-in-0 duration-500">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
          <Edit3 className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-red-900">İlan Bulunamadı</h2>
        <p className="max-w-sm text-sm text-red-700">
          Bu ilan mevcut değil veya düzenleme yetkiniz yok.
        </p>
        <Button asChild variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
          <Link href="/my-listings">← İlanlarıma Dön</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-7 text-white shadow-2xl">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl animate-float-delayed" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
              <Edit3 className="h-3 w-3 text-accent" />
              İlan Düzenle
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
              İlanı{" "}
              <span className="text-gradient-gold">Güncelle</span>
            </h1>
            <p className="mt-2 text-sm text-white/60 line-clamp-2 font-medium">
              &ldquo;{property.title}&rdquo;
            </p>
            <p className="mt-2 text-sm text-white/50 leading-relaxed">
              Bilgileri güncelleyip kaydedin. Görseller adımında yeni fotoğraf ekleyebilirsiniz.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs backdrop-blur-sm">
                <Timer className="h-3.5 w-3.5 text-accent" />
                <span className="font-semibold text-white/90">~2 dakika</span>
                <span className="text-white/50">güncelleme süresi</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-semibold text-white/90">Mevcut veriler</span>
                <span className="text-white/50">otomatik yüklendi</span>
              </div>
            </div>
          </div>

          <div className="hidden shrink-0 md:block">
            <div className="grid grid-cols-2 gap-2.5">
              {STEPS_INFO.map(({ icon: Icon, label, desc, color }, i) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 backdrop-blur-sm"
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

      {/* ── Info bar ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-blue-200/70 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow">
          <Lightbulb className="h-4 w-4 text-white" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-blue-800">Düzenleme Modu</p>
          <p className="text-xs text-blue-700 mt-0.5">
            Mevcut ilan bilgileri formlara yüklenmiştir. Değiştirmek istediğiniz alanları düzenleyin ve kaydedin.
          </p>
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl ring-2 ring-blue-500/10">
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
        <div className="p-1">
          <PropertyForm propertyId={id} defaultValues={property} />
        </div>
      </div>
    </section>
  );
}
