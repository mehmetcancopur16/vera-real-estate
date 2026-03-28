import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Flame,
  Home,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  Ruler,
  Shield,
  Sofa,
  Sparkles,
  Video,
} from "lucide-react";
import MapView from "@/components/map/MapView";
import ShareButton from "@/components/property/ShareButton";
import { getPropertyById } from "@/services/property.service";

/* ── constants ── */
const cityCoords = {
  istanbul: { lat: 41.0082, lng: 28.9784 },
  ankara:   { lat: 39.9334, lng: 32.8597 },
  izmir:    { lat: 38.4192, lng: 27.1287 },
  konya:    { lat: 37.8746, lng: 32.4932 },
  antalya:  { lat: 36.8969, lng: 30.7133 },
  bursa:    { lat: 40.1885, lng: 29.0610 },
};

const TYPE_LABELS = {
  apartment: "Daire",
  house: "Villa / Ev",
  land: "Arsa",
  commercial: "Ticari",
};

/* ── helpers ── */
function formatTry(price) {
  if (!price) return "Belirtilmemiş";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

function normalize(str = "") {
  return str
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c");
}

async function loadProperty(id) {
  try {
    const data = await getPropertyById(id);
    return data?.data || null;
  } catch {
    return null;
  }
}

/* ── metadata ── */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const property = await loadProperty(id);
  if (!property) {
    return { title: "İlan Bulunamadı | Vera Real Estate", description: "Aradığınız ilan bulunamadı." };
  }
  return {
    title: `${property.title} | Vera Real Estate`,
    description: property.description?.slice(0, 160) || "Vera Real Estate ilan detayı",
  };
}

/* ── page ── */
export default async function PropertyDetailPage({ params }) {
  const { id } = await params;
  const property = await loadProperty(id);

  if (!property) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <div className="rounded-2xl bg-slate-100 p-5">
          <Building2 className="h-10 w-10 text-slate-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">İlan Bulunamadı</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Bu ilan kaldırılmış ya da geçersiz olabilir.
          </p>
        </div>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-2.5 text-sm font-bold text-slate-900 shadow hover:brightness-105"
        >
          <ArrowLeft className="h-4 w-4" />
          İlanlara Dön
        </Link>
      </div>
    );
  }

  /* derived values */
  const city = normalize(property.location?.city || "");
  const coordinates = property.coordinates || cityCoords[city] || null;
  const mapProperties = [{ ...property, coordinates }];
  const isRent = property.listingType === "rent";
  const listingLabel = isRent ? "Kiralık" : "Satılık";
  const typeLabel = TYPE_LABELS[property.type] || property.type;
  const statusLabel =
    property.status === "under-construction" ? "İnşaat Aşamasında" : "Oturuma Hazır";
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];

  const fallbackImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1400&auto=format&fit=crop",
  ];
  const images = property.images?.length ? property.images : fallbackImages;
  const heroImage = images[0];
  const isLocalHero = heroImage.includes("localhost") || heroImage.includes("127.0.0.1");

  const heatingLabel = {
    kombi:    "Doğalgaz Kombisi",
    merkezi:  "Merkezi Isıtma",
    yerden:   "Yerden Isıtma",
    elektrik: "Elektrikli",
    klima:    "Klima",
    soba:     "Soba / Şömine",
    yok:      "Isıtma Yok",
  };

  const metrics = [
    { icon: BedDouble,     label: "Oda Sayısı",   value: property.features?.rooms ?? "-" },
    { icon: Bath,          label: "Banyo",         value: property.features?.bathrooms ?? "-" },
    { icon: Maximize2,     label: "Alan (m²)",     value: property.size ?? property.features?.area ?? "-" },
    { icon: Home,          label: "Kat",           value: property.features?.floor ?? "-" },
    { icon: CalendarDays,  label: "Yapı Yılı",     value: property.yearBuilt ?? "-" },
    { icon: ClipboardCheck,label: "Aidat",         value: property.maintenanceFee ? formatTry(property.maintenanceFee) : "-" },
    { icon: Flame,         label: "Isıtma",        value: property.features?.heating ? (heatingLabel[property.features.heating] || property.features.heating) : "-" },
    { icon: Building2,     label: "Toplam Kat",    value: property.totalFloors ?? "-" },
  ];

  return (
    <div className="space-y-8 pb-12">

      {/* ── BREADCRUMB ── */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="transition hover:text-accent">Ana Sayfa</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <Link href="/properties" className="transition hover:text-accent">İlanlar</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="max-w-[220px] truncate font-medium text-foreground">{property.title}</span>
      </nav>

      {/* ── GALLERY ── */}
      <section className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
        <div className="relative h-[320px] w-full md:h-[520px]">
          <Image
            src={heroImage}
            alt={property.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized={isLocalHero}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold shadow ${
                isRent ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
              }`}
            >
              {listingLabel}
            </span>
            {typeLabel && (
              <span className="rounded-full border border-white/30 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {typeLabel}
              </span>
            )}
            {property.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold-gradient px-3 py-1 text-xs font-bold text-slate-900 shadow">
                <Sparkles className="h-3 w-3" />
                Öne Çıkan
              </span>
            )}
          </div>

          {/* Back button */}
          <div className="absolute right-4 top-4">
            <Link
              href="/properties"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-black/55"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Geri Dön
            </Link>
          </div>

          {/* Bottom price */}
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-white drop-shadow-lg">
                {formatTry(property.price)}
                {isRent && <span className="ml-1 text-base font-normal text-white/80">/ay</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton title={property.title} text={`${property.title} - ${formatTry(property.price)}`} />
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-3 md:grid-cols-6">
            {images.slice(1, 7).map((img, i) => (
              <div
                key={`${img}-${i}`}
                className="relative h-16 overflow-hidden rounded-lg border border-slate-200 md:h-20"
              >
                <Image
                  src={img}
                  alt={`${property.title} ${i + 2}`}
                  fill
                  sizes="15vw"
                  className="object-cover transition hover:scale-105"
                  unoptimized={img.includes("localhost") || img.includes("127.0.0.1")}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">

        {/* Left column */}
        <div className="space-y-6">

          {/* Title & Tags */}
          <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <p className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <MapPin className="h-4 w-4 text-accent" />
                {[property.location?.district, property.location?.city].filter(Boolean).join(", ") || "Konum belirtilmemiş"}
              </p>
            </div>
            <h1 className="mt-3 text-2xl font-bold leading-snug text-foreground md:text-3xl">
              {property.title}
            </h1>

            {/* Tag row */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                property.status === "under-construction"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}>
                {statusLabel}
              </span>
              {property.deedStatus && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Tapu: {property.deedStatus}
                </span>
              )}
              {property.yearBuilt && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {property.yearBuilt} yapımı
                </span>
              )}
              {property.furnished && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  Eşyalı
                </span>
              )}
            </div>

            {/* Address */}
            {property.location?.address && (
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {property.location.address}
              </p>
            )}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {metrics.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
              >
                <div className="inline-flex rounded-xl bg-accent/10 p-2.5 w-fit">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                  <p className="mt-0.5 text-xl font-bold text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
            <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">Açıklama</h2>
            <h3 className="mb-4 text-xl font-bold text-foreground">Mülk Hakkında</h3>
            <p className="whitespace-pre-line leading-relaxed text-slate-600">
              {property.description || "Bu ilan için açıklama bilgisi girilmemiş."}
            </p>
          </div>

          {/* Amenities & Features */}
          <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
            <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">Özellikler</h2>
            <h3 className="mb-5 text-xl font-bold text-foreground">Olanaklar & Detaylar</h3>

            {amenities.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-accent/30 hover:bg-accent/5 hover:text-accent"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                    {amenity}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 border-t border-border/60 pt-5 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
                <div className={`rounded-xl p-2.5 ${property.parking ? "bg-emerald-50" : "bg-slate-100"}`}>
                  <Car className={`h-4 w-4 ${property.parking ? "text-emerald-600" : "text-slate-400"}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Otopark</p>
                  <p className={`text-sm font-bold ${property.parking ? "text-emerald-600" : "text-slate-500"}`}>
                    {property.parking ? "Mevcut" : "Yok"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
                <div className={`rounded-xl p-2.5 ${property.furnished ? "bg-blue-50" : "bg-slate-100"}`}>
                  <Sofa className={`h-4 w-4 ${property.furnished ? "text-blue-600" : "text-slate-400"}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Eşyalı</p>
                  <p className={`text-sm font-bold ${property.furnished ? "text-blue-600" : "text-slate-500"}`}>
                    {property.furnished ? "Evet" : "Hayır"}
                  </p>
                </div>
              </div>
              {property.virtualTourUrl && (
                <Link
                  href={property.virtualTourUrl}
                  target="_blank"
                  className="col-span-full flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/5 p-4 transition hover:bg-accent/10"
                >
                  <div className="rounded-xl bg-accent/15 p-2.5">
                    <Video className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">360° Sanal Tur</p>
                    <p className="text-sm font-bold text-accent">Sanal Turu Aç →</p>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
            <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">Konum</h2>
            <h3 className="mb-5 text-xl font-bold text-foreground">Harita</h3>
            <div className="overflow-hidden rounded-xl border border-border/60">
              <MapView properties={mapProperties} />
            </div>
            {property.location?.city && (
              <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-accent" />
                {[property.location?.address, property.location?.district, property.location?.city]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">

          {/* Price card */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="bg-primary px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">
                {isRent ? "Aylık Kira" : "Satış Fiyatı"}
              </p>
              <p className="mt-1.5 text-3xl font-bold text-white">
                {formatTry(property.price)}
                {isRent && <span className="ml-1 text-base font-normal text-slate-400">/ay</span>}
              </p>
            </div>
            <div className="space-y-2.5 p-5">
              <a
                href="tel:+902125551234"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-gradient py-3 text-sm font-bold text-slate-900 shadow-md transition hover:brightness-105"
              >
                <Phone className="h-4 w-4" />
                Hemen Ara
              </a>
              <a
                href="mailto:iletisim@veraestate.com"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-slate-700 transition hover:border-accent hover:bg-accent/5 hover:text-accent"
              >
                <Mail className="h-4 w-4" />
                E-posta Gönder
              </a>
              <Link
                href="/contact"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-slate-700 transition hover:border-accent hover:bg-accent/5 hover:text-accent"
              >
                <Ruler className="h-4 w-4" />
                Randevu Talep Et
              </Link>
            </div>
          </div>

          {/* Agent info */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-lg font-bold text-accent">
                VR
              </div>
              <div>
                <p className="font-bold text-foreground">Vera Danışman</p>
                <p className="text-xs text-slate-500">Uzman Portföy Yöneticisi</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Bu mülk hakkında daha fazla bilgi almak veya görüşme planlamak için doğrudan iletişime geçin.
            </p>
            <div className="mt-4 flex flex-col gap-1.5 text-sm text-slate-600">
              <a href="tel:+902125551234" className="flex items-center gap-2 hover:text-accent">
                <Phone className="h-4 w-4 text-accent" />
                +90 (212) 555 12 34
              </a>
              <a href="mailto:iletisim@veraestate.com" className="flex items-center gap-2 hover:text-accent">
                <Mail className="h-4 w-4 text-accent" />
                iletisim@veraestate.com
              </a>
            </div>
          </div>

          {/* Trust badges */}
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
            <div className="space-y-3">
              {[
                "Onaylı ve lisanslı ilan",
                "Hukuki inceleme garantisi",
                "Şeffaf fiyat politikası",
              ].map((text) => (
                <div key={text} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Shield className="h-4 w-4 shrink-0 text-accent" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Quick summary */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">İlan Özeti</p>
            <div className="space-y-2 text-sm">
              {[
                { label: "İlan No", value: id.slice(-8).toUpperCase() },
                { label: "İlan Türü", value: listingLabel },
                { label: "Emlak Tipi", value: typeLabel || "-" },
                { label: "Durum", value: statusLabel },
                { label: "Şehir", value: property.location?.city || "-" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
