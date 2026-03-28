"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Maximize2, Sparkles } from "lucide-react";

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

export default function PropertyCard({ property }) {
  const rawUrl = property.images?.[0] || "";
  const imageUrl = rawUrl ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop";
  const isLocalImage = imageUrl.includes("localhost") || imageUrl.includes("127.0.0.1");
  const propertyId = property._id || property.id;
  const isRent = property.listingType === "rent";
  const typeLabel = TYPE_LABELS[property.type] || property.type;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl">
      {/* Image */}
      <Link href={`/properties/${propertyId}`} className="relative block h-56 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized={isLocalImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${
              isRent
                ? "bg-blue-600 text-white"
                : "bg-emerald-600 text-white"
            }`}
          >
            {isRent ? "Kiralık" : "Satılık"}
          </span>
          {typeLabel && (
            <span className="rounded-full border border-white/30 bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {typeLabel}
            </span>
          )}
        </div>

        {/* Featured badge */}
        {property.isFeatured && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold-gradient px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm">
            <Sparkles className="h-3 w-3" />
            Öne Çıkan
          </span>
        )}

        {/* Price overlay */}
        <div className="absolute inset-x-3 bottom-3">
          <p className="text-xl font-bold text-white drop-shadow-lg">
            {formatTry(property.price)}
            {isRent && <span className="ml-1 text-sm font-normal text-white/80">/ay</span>}
          </p>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <Link
          href={`/properties/${propertyId}`}
          className="line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors hover:text-accent focus-visible:outline-none"
        >
          {property.title}
        </Link>

        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
          {[property.location?.district, property.location?.city].filter(Boolean).join(", ") || "Konum belirtilmemiş"}
        </p>

        {/* Metrics */}
        <div className="mt-4 flex items-center gap-4 border-t border-border/60 pt-4 text-sm text-slate-600">
          {property.features?.rooms != null && (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-foreground">{property.features.rooms}</span> Oda
            </span>
          )}
          {property.features?.bathrooms != null && (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-foreground">{property.features.bathrooms}</span> Banyo
            </span>
          )}
          {(property.features?.area != null || property.size != null) && (
            <span className="inline-flex items-center gap-1.5">
              <Maximize2 className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-foreground">{property.size ?? property.features?.area}</span> m²
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/60 px-5 py-3">
        <Link
          href={`/properties/${propertyId}`}
          className="block w-full rounded-xl border border-border py-2 text-center text-sm font-semibold text-slate-600 transition hover:border-accent hover:bg-accent/5 hover:text-accent"
        >
          Detayları Gör →
        </Link>
      </div>
    </article>
  );
}
