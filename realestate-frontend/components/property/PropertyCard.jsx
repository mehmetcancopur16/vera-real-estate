"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function formatTry(price) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

export default function PropertyCard({ property }) {
  const imageUrl = property.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop";
  const propertyId = property._id || property.id;
  const listingLabel = property.listingType === "rent" ? "Kiralik" : "Satilik";

  return (
    <Card className="group overflow-hidden border border-border/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700">{listingLabel}</span>
          {property.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" />
              One Cikan
            </span>
          )}
        </div>
      </div>
      <CardHeader className="space-y-2">
        <CardTitle className="line-clamp-1 text-lg">
          <Link href={`/properties/${propertyId}`} className="hover:underline">
            {property.title}
          </Link>
        </CardTitle>
        <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-accent" />
          {property.location?.city} / {property.location?.district || "Merkez"}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-primary">{formatTry(property.price)}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4 border-t border-slate-100 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <BedDouble className="h-4 w-4" />
          {property.features?.rooms ?? "-"} Oda
        </span>
        <span className="inline-flex items-center gap-1">
          <Bath className="h-4 w-4" />
          {property.features?.bathrooms ?? "-"} Banyo
        </span>
      </CardFooter>
    </Card>
  );
}
