"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, CalendarDays, Eye, MapPin, Maximize2, Sparkles } from "lucide-react";

function formatTry(price) {
  if (!price) return "Fiyat Belirtilmemiş";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

const TYPE_LABELS = {
  apartment: "Daire",
  house: "Villa / Ev",
  land: "Arsa",
  commercial: "Ticari",
};

export default function PropertyCardList({ property, index = 0 }) {
  const rawUrl = property.images?.[0] || "";
  const imageUrl =
    rawUrl ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop";
  const isLocalImage = imageUrl.includes("localhost") || imageUrl.includes("127.0.0.1");
  const propertyId = property._id || property.id;
  const isRent = property.listingType === "rent";
  const typeLabel = TYPE_LABELS[property.type] || property.type;
  const viewCount = property.viewCount ?? 0;

  return (
    <article
      className="group flex overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:border-accent/30 hover:shadow-xl card-entrance"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <Link
        href={`/properties/${propertyId}`}
        className="relative block h-40 w-48 shrink-0 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:h-auto sm:w-56"
      >
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 192px, 224px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized={isLocalImage}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/20" />

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm ${
              isRent ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
            }`}
          >
            {isRent ? "Kiralık" : "Satılık"}
          </span>
          {property.isFeatured && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-gold-gradient px-2 py-0.5 text-[10px] font-bold text-slate-900 shadow-sm">
              <Sparkles className="h-2.5 w-2.5" />
              Öne Çıkan
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5 min-w-0">
        <div className="space-y-2">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <Link
              href={`/properties/${propertyId}`}
              className="line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors hover:text-accent focus-visible:outline-none flex-1"
            >
              {property.title}
            </Link>
            <div className="shrink-0 text-right">
              <p className="text-lg font-bold text-foreground whitespace-nowrap">
                {formatTry(property.price)}
              </p>
              {isRent && <span className="text-xs text-slate-400">/ay</span>}
            </div>
          </div>

          {/* Location */}
          <p className="inline-flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
            {[property.location?.district, property.location?.city].filter(Boolean).join(", ") || "Konum belirtilmemiş"}
          </p>

          {/* Type + deed */}
          <div className="flex flex-wrap gap-1.5">
            {typeLabel && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                {typeLabel}
              </span>
            )}
            {property.deedStatus && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                {property.deedStatus}
              </span>
            )}
            {property.yearBuilt && (
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                <CalendarDays className="h-2.5 w-2.5" />
                {property.yearBuilt}
              </span>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            {property.features?.rooms != null && (
              <span className="inline-flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 text-slate-400" />
                <span className="font-semibold text-foreground">{property.features.rooms}</span>
              </span>
            )}
            {property.features?.bathrooms != null && (
              <span className="inline-flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-slate-400" />
                <span className="font-semibold text-foreground">{property.features.bathrooms}</span>
              </span>
            )}
            {(property.size != null || property.features?.area != null) && (
              <span className="inline-flex items-center gap-1.5">
                <Maximize2 className="h-4 w-4 text-slate-400" />
                <span className="font-semibold text-foreground">{property.size ?? property.features?.area}</span>
                <span className="text-xs text-slate-400">m²</span>
              </span>
            )}
            <span className="hidden items-center gap-1 text-xs text-slate-400 sm:inline-flex">
              <Eye className="h-3.5 w-3.5" />
              {viewCount.toLocaleString("tr-TR")}
            </span>
          </div>
          <Link
            href={`/properties/${propertyId}`}
            className="shrink-0 rounded-xl border border-border px-4 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-accent hover:bg-accent/5 hover:text-accent"
          >
            Detaylar →
          </Link>
        </div>
      </div>
    </article>
  );
}
