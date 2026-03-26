import PropertyForm from "@/components/forms/PropertyForm";

export default function AddListingPage() {
  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-slate-950 to-slate-900 p-6 text-white shadow-sm">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <p className="text-xs uppercase tracking-[0.2em] text-white/70">Vera Listing Studio</p>
        <h1 className="mt-2 text-3xl font-semibold">Yeni Ilan Ekle</h1>
        <p className="mt-1 max-w-2xl text-sm text-white/75">
          4 adimli sihirbaz ile ilaninizi premium sekilde olusturun. Tum adimlarda ayni tasarim dili ve net bilgi akisi korunur.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel-surface rounded-xl p-4 text-sm text-muted-foreground">
          1. Temel bilgiler: baslik, aciklama, fiyat
        </div>
        <div className="panel-surface rounded-xl p-4 text-sm text-muted-foreground">
          2. Ozellikler: oda, m2, durum, lokasyon
        </div>
        <div className="panel-surface rounded-xl p-4 text-sm text-muted-foreground">
          3. Gorseller ve yayin oncesi son kontrol
        </div>
      </div>
      <div className="panel-surface rounded-2xl p-5 shadow-sm md:p-6">
        <PropertyForm />
      </div>
    </section>
  );
}
