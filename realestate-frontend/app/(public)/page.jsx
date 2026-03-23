import { Search } from "lucide-react";
import PropertyGrid from "@/components/property/PropertyGrid";
import MapView from "@/components/map/MapView";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockProperties = [
  {
    id: "p1",
    title: "Merkezde Luks 3+1 Daire",
    price: 7250000,
    location: { city: "Istanbul", district: "Besiktas" },
    features: { rooms: 3, bathrooms: 2 },
    coordinates: { lat: 41.0422, lng: 29.0083 },
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop"],
  },
  {
    id: "p2",
    title: "Deniz Manzarali Modern Villa",
    price: 18300000,
    location: { city: "Izmir", district: "Cesme" },
    features: { rooms: 5, bathrooms: 3 },
    coordinates: { lat: 38.3261, lng: 26.3058 },
    images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1400&auto=format&fit=crop"],
  },
  {
    id: "p3",
    title: "Yatirimlik Kiralik Ofis",
    price: 85000,
    location: { city: "Ankara", district: "Cankaya" },
    features: { rooms: 2, bathrooms: 1 },
    coordinates: { lat: 39.9042, lng: 32.8605 },
    images: ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1400&auto=format&fit=crop"],
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-2xl bg-[#0f172a] px-6 py-16 text-white md:px-12">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_top_right,#d4af37_0,transparent_38%)]" />
        <div className="relative space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-white/80">Vera Real Estate</p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
            Modern Yasamin Yeni Koordinati
          </h1>
          <p className="max-w-2xl text-sm text-white/75 md:text-base">
            Guzel lokasyonlar, akilli filtreler ve premium deneyim ile emlak yolculugunu yeniden
            tanimlayin.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <form className="flex flex-col gap-3 md:flex-row">
          <Input placeholder="Sehir ara (ornek: Istanbul)" className="md:max-w-sm" />
          <Button type="submit" className="gap-2">
            <Search className="h-4 w-4" />
            Ara
          </Button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">One Cikan Ilanlar</h2>
        <PropertyGrid properties={mockProperties} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Haritada Kesfet</h2>
        <MapView properties={mockProperties} />
      </section>
    </div>
  );
}
