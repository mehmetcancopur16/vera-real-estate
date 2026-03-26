import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  CalendarDays,
  Car,
  CheckCircle2,
  ClipboardCheck,
  Home,
  MapPin,
  Phone,
  Ruler,
  Share2,
  Sofa,
  Sparkles,
  Video,
} from "lucide-react";
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
  const { id } = await params;
  const property = await loadProperty(id);

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
  const { id } = await params;
  const property = await loadProperty(id);

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
  const images = property.images?.length
    ? property.images
    : [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?q=80&w=1400&auto=format&fit=crop",
    ];
  const heroImage =
    images[0] ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop";
  const listingLabel = property.listingType === "rent" ? "Kiralik" : "Satilik";
  const statusLabel = property.status === "under-construction" ? "Insaat Asamasinda" : "Oturuma Hazir";
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];

  return (
    <div className="space-y-8">
      <section className="panel-surface space-y-4 overflow-hidden rounded-3xl p-4 md:p-6">
        <div className="relative h-[320px] w-full overflow-hidden rounded-2xl md:h-[520px]">
          <Image src={heroImage} alt={property.title} fill sizes="100vw" priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">{listingLabel}</span>
            {property.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                One Cikan
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {images.slice(0, 6).map((img, index) => (
            <div key={`${img}-${index}`} className="relative h-20 overflow-hidden rounded-lg border border-slate-200 md:h-24">
              <Image src={img} alt={`${property.title} ${index + 1}`} fill sizes="20vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="panel-surface rounded-2xl p-6">
            <p className="inline-flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-4 w-4 text-accent" />
              {property.location?.city} / {property.location?.district || "Merkez"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{property.title}</h1>
            <p className="mt-2 text-3xl font-bold text-primary">{formatTry(property.price)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{statusLabel}</span>
              {property.deedStatus && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Tapu: {property.deedStatus}
                </span>
              )}
              {property.yearBuilt && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Yil: {property.yearBuilt}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="panel-surface rounded-xl p-4">
              <p className="inline-flex items-center gap-2 text-xs text-slate-500"><BedDouble className="h-4 w-4 text-accent" /> Oda</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{property.features?.rooms ?? "-"}</p>
            </div>
            <div className="panel-surface rounded-xl p-4">
              <p className="inline-flex items-center gap-2 text-xs text-slate-500"><Bath className="h-4 w-4 text-accent" /> Banyo</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{property.features?.bathrooms ?? "-"}</p>
            </div>
            <div className="panel-surface rounded-xl p-4">
              <p className="inline-flex items-center gap-2 text-xs text-slate-500"><Ruler className="h-4 w-4 text-accent" /> m2</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{property.size ?? "-"}</p>
            </div>
            <div className="panel-surface rounded-xl p-4">
              <p className="inline-flex items-center gap-2 text-xs text-slate-500"><Home className="h-4 w-4 text-accent" /> Kat</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{property.features?.floor ?? "-"}</p>
            </div>
            <div className="panel-surface rounded-xl p-4">
              <p className="inline-flex items-center gap-2 text-xs text-slate-500"><CalendarDays className="h-4 w-4 text-accent" /> Yapi Yili</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{property.yearBuilt ?? "-"}</p>
            </div>
            <div className="panel-surface rounded-xl p-4">
              <p className="inline-flex items-center gap-2 text-xs text-slate-500"><ClipboardCheck className="h-4 w-4 text-accent" /> Aidat</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{property.maintenanceFee ? formatTry(property.maintenanceFee) : "-"}</p>
            </div>
          </div>

          <div className="panel-surface rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Aciklama</h2>
            <p className="mt-3 leading-relaxed text-slate-700">{property.description}</p>
            <p className="mt-4 inline-flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-4 w-4 text-accent" />
              {property.location?.address || "Adres bilgisi belirtilmemis."}
            </p>
          </div>

          <div className="panel-surface rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Olanaklar</h2>
            {amenities.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <span key={amenity} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Bu ilan icin ek olanak bilgisi paylasilmamis.</p>
            )}
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1"><Car className="h-4 w-4 text-accent" /> Otopark: {property.parking ? "Var" : "Yok"}</span>
              <span className="inline-flex items-center gap-1"><Sofa className="h-4 w-4 text-accent" /> Esyali: {property.furnished ? "Evet" : "Hayir"}</span>
              {property.virtualTourUrl && (
                <Link href={property.virtualTourUrl} target="_blank" className="inline-flex items-center gap-1 text-accent hover:underline">
                  <Video className="h-4 w-4" />
                  Sanal Turu Ac
                </Link>
              )}
            </div>
          </div>

          <div className="panel-surface space-y-3 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Konum</h2>
            <MapView properties={mapProperties} />
          </div>
        </div>

        <aside className="panel-surface h-fit rounded-2xl p-5 lg:sticky lg:top-24">
          <h3 className="text-xl font-semibold text-slate-900">Danismanla Iletisime Gec</h3>
          <p className="mt-2 text-sm text-slate-600">
            Bu ilanla ilgili detayli bilgi ve randevu talepleriniz icin uzman ekibimiz sizinle hizla iletisime gecsin.
          </p>
          <div className="mt-5 space-y-2">
            <button type="button" className="w-full rounded-lg bg-gold-gradient px-4 py-2.5 text-sm font-semibold text-primary transition hover:brightness-95">
              Iletisime Gec
            </button>
            <button type="button" className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Randevu Talep Et
            </button>
            <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <Share2 className="h-4 w-4" />
              Ilani Paylas
            </button>
          </div>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
            <Phone className="h-4 w-4 text-accent" />
            +90 (216) 555 12 34
          </p>
        </aside>
      </section>
    </div>
  );
}
