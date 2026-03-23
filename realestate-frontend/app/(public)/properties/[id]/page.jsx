import Image from "next/image";
import { BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import MapView from "@/components/map/MapView";
import { getPropertyById } from "@/services/property.service";

const cityCoords = {
  istanbul: { lat: 41.0082, lng: 28.9784 },
  ankara: { lat: 39.9334, lng: 32.8597 },
  izmir: { lat: 38.4192, lng: 27.1287 },
  konya: { lat: 37.8746, lng: 32.4932 },
  antalya: { lat: 36.8969, lng: 30.7133 },
  bursa: { lat: 40.1885, lng: 29.061 },
};

function formatTry(price) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

async function loadProperty(id) {
  try {
    const data = await getPropertyById(id);
    return data?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const property = await loadProperty(params.id);

  if (!property) {
    return {
      title: "Ilan Bulunamadi | Vera Real Estate",
      description: "Aradiginiz ilan bulunamadi.",
    };
  }

  return {
    title: `${property.title} | Vera Real Estate`,
    description: property.description?.slice(0, 160) || "Vera Real Estate ilan detayi",
  };
}

export default async function PropertyDetailPage({ params }) {
  const property = await loadProperty(params.id);

  if (!property) {
    return (
      <section className="rounded-xl border border-border bg-card p-8">
        <h1 className="text-2xl font-semibold">Ilan bulunamadi</h1>
        <p className="mt-2 text-muted-foreground">Bu ilan kaldirilmis veya gecersiz olabilir.</p>
      </section>
    );
  }

  const city = (property.location?.city || "").toLowerCase();
  const coordinates = property.coordinates || cityCoords[city] || null;
  const mapProperties = [{ ...property, coordinates }];
  const heroImage =
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop";

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative h-[320px] w-full md:h-[460px]">
          <Image src={heroImage} alt={property.title} fill className="object-cover" />
        </div>
        <div className="space-y-4 p-6">
          <p className="text-sm text-muted-foreground">
            {property.location?.city} / {property.location?.district}
          </p>
          <h1 className="text-3xl font-semibold">{property.title}</h1>
          <p className="text-3xl font-bold text-primary">{formatTry(property.price)}</p>
          <p className="max-w-4xl leading-relaxed text-foreground/90">{property.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <BedDouble className="h-4 w-4" />
              {property.features?.rooms ?? "-"} Oda
            </span>
            <span className="inline-flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {property.features?.bathrooms ?? "-"} Banyo
            </span>
            <span className="inline-flex items-center gap-1">
              <Ruler className="h-4 w-4" />
              {property.size ?? "-"} m2
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {property.location?.address || "Adres bilgisi yok"}
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Konum</h2>
        <MapView properties={mapProperties} />
      </section>
    </div>
  );
}
