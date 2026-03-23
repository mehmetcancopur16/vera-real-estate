"use client";

import Image from "next/image";
import { BedDouble, Bath } from "lucide-react";
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

  return (
    <Card className="overflow-hidden border border-border/80 shadow-sm">
      <div className="relative h-52 w-full">
        <Image src={imageUrl} alt={property.title} fill className="object-cover" />
      </div>
      <CardHeader className="space-y-1">
        <CardTitle className="line-clamp-1 text-lg">{property.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {property.location?.city} / {property.location?.district}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold text-primary">{formatTry(property.price)}</p>
      </CardContent>
      <CardFooter className="flex items-center gap-4 text-sm text-muted-foreground">
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
