import PropertyForm from "@/components/forms/PropertyForm";

export default function AddListingPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Yeni Ilan Ekle</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ilan bilgilerini girin, isterseniz fotograflari hemen yukleyin.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 md:p-6">
        <PropertyForm />
      </div>
    </section>
  );
}
