import PropertyForm from "@/components/forms/PropertyForm";

export default function AddListingPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Yeni İlan Ekle</h1>
        <p className="mt-1 text-sm text-slate-600">
          4 adımlı sihirbaz ile ilanınızı premium şekilde oluşturun. İsterseniz görselleri en sonda yükleyebilirsiniz.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <PropertyForm />
      </div>
    </section>
  );
}
