"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PropertyDetailError({ reset }) {
  return (
    <section className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <AlertTriangle className="mb-3 h-10 w-10 text-accent" />
      <h1 className="text-2xl font-semibold text-slate-900">Ilan detayi yuklenemedi</h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        Baglanti veya servis kaynakli gecici bir problem olusmus olabilir. Tekrar deneyebilirsiniz.
      </p>
      <Button onClick={reset} className="mt-4 bg-accent text-primary">
        Tekrar Dene
      </Button>
    </section>
  );
}
