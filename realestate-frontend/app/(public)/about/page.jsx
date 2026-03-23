import { Building2, Landmark, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-primary px-6 py-14 text-white">
        <h1 className="text-4xl font-semibold">Hakkimizda</h1>
        <p className="mt-3 max-w-3xl text-white/80">
          Vera Real Estate, premium emlak deneyimini guven ve teknoloji ile birlestiren kurumsal
          bir markadir.
        </p>
      </section>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <Users className="h-5 w-5 text-accent" />
          <p className="mt-2 text-2xl font-semibold">500+</p>
          <p className="text-sm text-muted-foreground">Mutlu Musteri</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <Landmark className="h-5 w-5 text-accent" />
          <p className="mt-2 text-2xl font-semibold">50+ Milyon ₺</p>
          <p className="text-sm text-muted-foreground">Satis Hacmi</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <Building2 className="h-5 w-5 text-accent" />
          <p className="mt-2 text-2xl font-semibold">1.200+</p>
          <p className="text-sm text-muted-foreground">Portfoy</p>
        </div>
      </section>
    </div>
  );
}
